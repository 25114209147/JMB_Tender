"""
Vercel serverless function wrapper for FastAPI
Vercel expects a .py file in api/ that exports an ASGI app (FastAPI)
"""
import sys
import os

# Get the backend directory (parent of api/)
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Add backend directory to Python path
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Change working directory to backend for relative imports
os.chdir(backend_dir)

# Now import the FastAPI app
from main import app

# Vercel needs this export for serverless
# Export the FastAPI app directly (Vercel's Python runtime handles ASGI apps)
handler = app

# For local testing with uvicorn, expose 'app' directly
# Usage: cd apps/backend && uvicorn api.index:app --reload
__all__ = ["app", "handler"]
