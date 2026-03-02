"""
Vercel serverless function wrapper for FastAPI using Mangum
"""
import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mangum import Mangum
from main import app

# Create Mangum handler for AWS Lambda/Vercel
handler = Mangum(app, lifespan="off")
