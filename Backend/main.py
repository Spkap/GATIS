import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import open_clip
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = "models_clip_jit"
JIT_GENERATOR_PATH = os.path.join(MODEL_DIR, "generator_clip_final_jit.pt")

CLIP_MODEL_NAME = 'ViT-B-32'
CLIP_PRETRAINED = 'laion2b_s34b_b79k'

LATENT_DIM = 100

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
logger.info(f"Using device: {device}")

generator_jit: torch.jit.ScriptModule = None
clip_model: nn.Module = None
clip_tokenizer = None

def load_models():
    global generator_jit, clip_model, clip_tokenizer
    logger.info("Loading models...")
    try:
        if not os.path.exists(JIT_GENERATOR_PATH):
             raise FileNotFoundError(f"JIT Generator model not found at {JIT_GENERATOR_PATH}")
        generator_jit = torch.jit.load(JIT_GENERATOR_PATH, map_location=device)
        generator_jit.eval()
        logger.info("JIT Generator loaded successfully.")

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

app = FastAPI(title="Bird Text-to-Image API (CLIP+JIT)", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPrompt(BaseModel):
    text: str

def generate_image_api(text_prompt: str) -> Image.Image:
    if generator_jit is None or clip_model is None or clip_tokenizer is None:
         logger.error("Models not loaded before inference call.")
         raise HTTPException(status_code=503, detail="Models are not ready. Please try again later.")

    start_time = time.time()
    logger.info(f"Received generation request for prompt: '{text_prompt}'")
    try:
        with torch.no_grad():
            text_tokens = clip_tokenizer([text_prompt]).to(device)
            text_embedding = clip_model.encode_text(text_tokens)

        noise = torch.randn(1, LATENT_DIM, device=device)

        with torch.no_grad():
            fake_image_tensor = generator_jit(noise, text_embedding)

        processed_image = fake_image_tensor[0].cpu().mul(0.5).add(0.5).clamp(0, 1)
        pil_image = transforms.ToPILImage()(processed_image)

        end_time = time.time()
        logger.info(f"Image generated successfully in {end_time - start_time:.2f} seconds.")
        return pil_image

    except Exception as e:
        logger.error(f"Error during image generation for prompt '{text_prompt}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Image generation failed: {e}")

@app.on_event("startup")
async def startup_event():
    load_models()

@app.get("/", summary="Root endpoint", tags=["General"])
async def read_root():
    return {"message": "Welcome to the Bird Text-to-Image API (CLIP+JIT)! Use the /generate-image/ endpoint (POST)."}

@app.post("/generate-image/", response_class=StreamingResponse, summary="Generate Image from Text", tags=["Image Generation"])
async def generate_image_endpoint(prompt: TextPrompt):
    if not prompt.text or not prompt.text.strip():
        raise HTTPException(status_code=400, detail="Text prompt cannot be empty.")

    logger.info(f"Processing request for prompt: {prompt.text}")
    pil_image = generate_image_api(prompt.text)

    img_byte_arr = BytesIO()
    pil_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return StreamingResponse(img_byte_arr, media_type="image/png")
