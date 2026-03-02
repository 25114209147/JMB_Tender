import sys
import os

# Add parent directory to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

# Import FastAPI app
from main import app as fastapi_app

# Use Mangum to wrap FastAPI for Vercel/AWS Lambda compatibility
from mangum import Mangum

# Create handler - Vercel expects it to be named 'app'
app = Mangum(fastapi_app, lifespan="off")
