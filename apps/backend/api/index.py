"""
Vercel serverless function wrapper for FastAPI
Vercel expects a .py file in api/ that exports an ASGI app (FastAPI)
"""
import sys
import os
import logging

# Set up logging to help debug
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Get the backend directory (parent of api/)
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logger.info(f"Backend directory: {backend_dir}")
    
    # Add backend directory to Python path
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
        logger.info(f"Added {backend_dir} to sys.path")
    
    # Change working directory to backend for relative imports
    original_cwd = os.getcwd()
    os.chdir(backend_dir)
    logger.info(f"Changed working directory from {original_cwd} to {backend_dir}")
    
    # Now import the FastAPI app
    logger.info("Importing main app...")
    from main import app
    logger.info("Successfully imported FastAPI app")
    
    # Vercel needs this export for serverless
    # Export the FastAPI app directly (Vercel's Python runtime handles ASGI apps)
    handler = app
    logger.info("Handler exported successfully")
    
except Exception as e:
    logger.error(f"Error setting up handler: {e}", exc_info=True)
    # Create a minimal error handler
    from fastapi import FastAPI
    error_app = FastAPI()
    
    @error_app.get("/")
    def error_root():
        return {"error": "Failed to initialize application", "details": str(e)}
    
    @error_app.get("/health")
    def error_health():
        return {"status": "error", "message": str(e)}
    
    handler = error_app

# For local testing with uvicorn, expose 'app' directly
# Usage: cd apps/backend && uvicorn api.index:app --reload
__all__ = ["app", "handler"]
