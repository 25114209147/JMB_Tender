"""
Vercel serverless function wrapper for FastAPI
Vercel expects a .py file in api/ that exports an ASGI app (FastAPI)
"""
import sys
import os

# Add the parent directory to the path so we can import from the backend
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

# Change to backend directory to ensure relative imports work
os.chdir(backend_dir)

from main import app

# Vercel needs this export for serverless
# Export the FastAPI app directly (Vercel's Python runtime handles ASGI apps)
handler = app

# For local testing, you can also expose 'app' directly
# This allows: uvicorn api.index:app (when run from apps/backend/)
__all__ = ["app", "handler"]
