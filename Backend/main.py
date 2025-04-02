import os
import torch
import torch.nn as nn  # Although not defining classes, good to have for type hints if desired
import torchvision.transforms as transforms
import open_clip  # Use open_clip library
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse  # Sends back image bytes directly
from fastapi.middleware.cors import CORSMiddleware  # For React integration
from pydantic import BaseModel
from PIL import Image
from io import BytesIO  # To handle image bytes in memory
import time
import logging

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Configuration ---
# Use relative paths assuming main.py is in the project root
MODEL_DIR = "models_clip_jit"
JIT_GENERATOR_PATH = os.path.join(MODEL_DIR, "generator_clip_final_jit.pt")  # Make sure filename matches

# CLIP Configuration (Must match what was used in the notebook's inference example)
CLIP_MODEL_NAME = 'ViT-B-32'
CLIP_PRETRAINED = 'laion2b_s34b_b79k'

LATENT_DIM = 100  # Latent dimension used during training

# Determine device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
logger.info(f"Using device: {device}")

# --- Global Variables for Loaded Models ---
# Load models ONCE at startup to be efficient
generator_jit: torch.jit.ScriptModule = None
clip_model: nn.Module = None
clip_tokenizer = None

# --- Load Models Function ---
def load_models():
    """Loads the JIT Generator and CLIP components."""
    global generator_jit, clip_model, clip_tokenizer
    logger.info("Loading models...")
    try:
        # Load TorchScript Generator
        if not os.path.exists(JIT_GENERATOR_PATH):
             raise FileNotFoundError(f"JIT Generator model not found at {JIT_GENERATOR_PATH}")
        generator_jit = torch.jit.load(JIT_GENERATOR_PATH, map_location=device)
        generator_jit.eval()  # Ensure evaluation mode
        logger.info("JIT Generator loaded successfully.")

        # Load CLIP model and tokenizer for text encoding
        logger.info(f"Loading CLIP model: {CLIP_MODEL_NAME} ({CLIP_PRETRAINED})")
        clip_model, _, _ = open_clip.create_model_and_transforms(CLIP_MODEL_NAME, pretrained=CLIP_PRETRAINED)
        clip_tokenizer = open_clip.get_tokenizer(CLIP_MODEL_NAME)
        clip_model = clip_model.to(device).eval()
        logger.info("CLIP Model and Tokenizer loaded successfully.")

    except FileNotFoundError as e:
        logger.error(f"Model file not found: {e}")
        raise RuntimeError(f"Could not load models due to missing file: {e}") from e
    except Exception as e:
        logger.error(f"An unexpected error occurred during model loading: {e}", exc_info=True)
        raise RuntimeError(f"Model loading failed unexpectedly: {e}") from e

# --- FastAPI App Initialization ---
app = FastAPI(title="Bird Text-to-Image API (CLIP+JIT)", version="1.0.0")

# --- CORS Middleware (Essential for React Frontend) ---
# Define the origins allowed to access your backend.
# For development, allow localhost from the typical React port (3000).
# For production, replace/add your actual frontend domain.
origins = [
    "http://localhost:3000",  # Default React development server
    "http://localhost:3001",  # Another common React dev port
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    # "https://your-react-frontend-domain.com", # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# --- Request Body Model ---
class TextPrompt(BaseModel):
    text: str

# --- Inference Function ---
def generate_image_api(text_prompt: str) -> Image.Image:
    """Generates a PIL Image from text using globally loaded models."""
    if generator_jit is None or clip_model is None or clip_tokenizer is None:
         logger.error("Models not loaded before inference call.")
         raise HTTPException(status_code=503, detail="Models are not ready. Please try again later.")

    start_time = time.time()
    logger.info(f"Received generation request for prompt: '{text_prompt}'")
    try:
        # 1. Encode Text using CLIP
        with torch.no_grad():
            # Tokenize requires a list of strings
            text_tokens = clip_tokenizer([text_prompt]).to(device)
            # Encode text
            text_embedding = clip_model.encode_text(text_tokens)  # Shape: [1, 512]

        # 2. Generate Noise
        noise = torch.randn(1, LATENT_DIM, device=device)  # Shape: [1, 100]

        # 3. Generate Image using JIT Generator
        with torch.no_grad():
            fake_image_tensor = generator_jit(noise, text_embedding)  # Pass noise and embedding

        # 4. Post-process tensor to PIL Image
        # De-normalize from [-1, 1] to [0, 1], convert to CPU, clamp, and make PIL image
        processed_image = fake_image_tensor[0].cpu().mul(0.5).add(0.5).clamp(0, 1)
        pil_image = transforms.ToPILImage()(processed_image)

        end_time = time.time()
        logger.info(f"Image generated successfully in {end_time - start_time:.2f} seconds.")
        return pil_image

    except Exception as e:
        logger.error(f"Error during image generation for prompt '{text_prompt}': {e}", exc_info=True)
        # Re-raise as HTTPException for FastAPI to handle and return error to client
        raise HTTPException(status_code=500, detail=f"Image generation failed: {e}")

# --- API Endpoints ---
@app.on_event("startup")
async def startup_event():
    """Load models when the FastAPI application starts."""
    load_models()

@app.get("/", summary="Root endpoint", tags=["General"])
async def read_root():
    """Provides a simple welcome message."""
    return {"message": "Welcome to the Bird Text-to-Image API (CLIP+JIT)! Use the /generate-image/ endpoint (POST)."}

@app.post("/generate-image/", response_class=StreamingResponse, summary="Generate Image from Text", tags=["Image Generation"])
async def generate_image_endpoint(prompt: TextPrompt):
    """
    Accepts a JSON payload with a 'text' field containing the prompt,
    generates a bird image based on the prompt, and returns the image as a PNG stream.
    """
    if not prompt.text or not prompt.text.strip():
        raise HTTPException(status_code=400, detail="Text prompt cannot be empty.")

    logger.info(f"Processing request for prompt: {prompt.text}")
    pil_image = generate_image_api(prompt.text)  # Call the core generation logic

    # Save PIL image to a bytes buffer in PNG format
    img_byte_arr = BytesIO()
    pil_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)  # Important: Rewind buffer to the beginning before sending

    # Return image bytes as a streaming response
    return StreamingResponse(img_byte_arr, media_type="image/png")

# --- Run Instruction ---
# To run this app locally (after installing requirements):
# Open your terminal in the 'Backend' directory (where main.py is)
# Run: uvicorn main:app --reload --port 8000
# --reload is optional, useful for development
# The API will be available at http://127.0.0.1:8000
# Access the interactive documentation (Swagger UI) at http://127.0.0.1:8000/docs