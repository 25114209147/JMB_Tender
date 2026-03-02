"""
Vercel serverless function wrapper for FastAPI
Vercel expects a .py file in api/ that exports an ASGI app (FastAPI)
"""
import sys
import os

# Add the parent directory to the path so we can import from the backend
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Vercel needs this export for serverless
# Vercel's Python runtime can handle FastAPI directly as an ASGI app
handler = app

# Alternative: If you need AWS Lambda compatibility, use Mangum:
# from mangum import Mangum
# handler = Mangum(app, lifespan="off")
