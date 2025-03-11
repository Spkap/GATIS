# GATIS Backend

This repository contains the backend API for the GATIS project, built with FastAPI.

## Overview

The GATIS backend provides RESTful API endpoints for the GATIS application. It's built using FastAPI, a modern, fast web framework for building APIs with Python.

## Prerequisites

- Python 3.11+
- Conda or Miniconda (recommended for environment management)

## Environment Setup

This project uses a Conda environment for dependency management. To set up the environment:

```bash
# Clone the repository
git clone <repository-url>
cd /Users/sourabhkapure/Developer/Projects/GATIS/Backend

# Create and activate the Conda environment from the environment.yml file
conda env create -f Environment.yml
conda activate fastapi-env
```

## Project Structure

```
Backend/
├── Environment.yml        # Conda environment file
├── README.md             # This file
├── database.py           # Database connection and functions
├── main.py               # Main FastAPI application
├── model.py              # Text-to-Image model implementation
└── models/               # Directory for model files
    ├── gan_model.pth     # GAN model weights
    ├── text_encoder.pth  # Text encoder model weights
    └── captions.pickle   # Vocabulary file
```

## Configuration

The application can be configured using environment variables:

- `USE_CUDA`: Set to 'true' or 'false' to enable/disable CUDA (default: 'true')
- `GAN_GF_DIM`: Generator filter dimension (default: 32)
- `GAN_DF_DIM`: Discriminator filter dimension (default: 64)
- `GAN_Z_DIM`: Noise vector dimension (default: 100)
- `GAN_CONDITION_DIM`: Condition dimension (default: 100)
- `GAN_R_NUM`: Number of residual blocks (default: 2)
- `GAN_B_ATTENTION`: Use attention or not (default: 'true')
- `TEXT_EMBEDDING_DIM`: Text embedding dimension (default: 256)
- `RNN_HIDDEN_DIM`: RNN hidden dimension (default: 256)
- `RNN_INPUT_DIM`: RNN input embedding dimension (default: 300)
- `TREE_BRANCH_NUM`: Number of branches for generator (default: 3)
- `TREE_BASE_SIZE`: Base image size (default: 64)

## Running the Application

To run the FastAPI application:

```bash
# Activate the environment
conda activate fastapi-env

# Run the application with uvicorn
python main.py
```

Or directly with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication

- `POST /signup`: Register a new user
- `POST /token`: Login and get access token

### Image Generation

- `POST /generate`: Generate an image from text (requires authentication)
- `GET /images/{image_name}`: Retrieve a generated image

## API Documentation

Once the server is running, API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
Check 