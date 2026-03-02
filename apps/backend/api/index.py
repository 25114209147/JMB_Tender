import sys
import os

# Get backend directory
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Add to Python path without changing directory
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import app using absolute import path
from main import app

# Wrap with Mangum for Vercel compatibility
from mangum import Mangum

# Export handler - Vercel requires this exact name
handler = Mangum(app, lifespan="off")
