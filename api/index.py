"""
Vercel serverless function entry point for FastAPI backend.
This file exposes the FastAPI app from apps/backend to Vercel's Python runtime.
"""
import sys
from pathlib import Path

# Add the apps/backend directory to Python path so imports work
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir / "apps" / "backend"))

# Import the FastAPI app
from main import app

# Vercel expects the app to be available at module level
# The variable must be named 'app' or 'handler'
__all__ = ["app"]
