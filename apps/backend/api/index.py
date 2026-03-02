import sys
import os

# Add parent directory to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

# Import FastAPI app
from main import app as fastapi_app

# Export the FastAPI app directly - Vercel will handle it with their ASGI adapter
app = fastapi_app
