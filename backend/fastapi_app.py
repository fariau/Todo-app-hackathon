# backend/fastapi_app.py
# Vercel-compatible FastAPI app entry point
import os
from mangum import Mangum
from src.main import app

# For Vercel deployment
handler = Mangum(app)

def main(event, context):
    return handler(event, context)