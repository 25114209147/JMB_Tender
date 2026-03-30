"""
Vercel serverless function entry point for FastAPI backend deployment
"""
import sys
import os

# Setup path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    # Import FastAPI app
    from main import app
    
    # Import Mangum
    from mangum import Mangum
    
    # Create handler with lifespan disabled for serverless
    handler = Mangum(app, lifespan="off")
    
except Exception as e:
    # Fallback handler if import fails
    import logging
    logging.error(f"Failed to initialize handler: {e}", exc_info=True)
    
    from fastapi import FastAPI
    from mangum import Mangum
    
    error_app = FastAPI(title="Error Handler")
    
    @error_app.get("/")
    def error_root():
        return {"error": "Failed to initialize application", "details": str(e)}
    
    @error_app.get("/health")
    def error_health():
        return {"status": "error", "message": str(e)}
    
    handler = Mangum(error_app, lifespan="off")
