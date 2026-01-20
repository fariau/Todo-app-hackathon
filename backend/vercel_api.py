# backend/vercel_api.py
# Entry point for Vercel serverless functions
import asyncio
from fastapi import FastAPI
from mangum import Mangum
from src.main import app

# Create the Mangum adapter for ASGI compatibility with Vercel
handler = Mangum(app, lifespan="off")

# For Vercel Python runtime, we need to make sure the database is initialized
# In serverless environment, initialization happens per request if needed
def main(event, context):
    return handler(event, context)