from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.models import OAuthFlows, OAuthFlowPassword
from fastapi.security import OAuth2PasswordBearer
from contextlib import asynccontextmanager
import logging
from routers import users, tenders, bids
from database import create_all_tables

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Try to create tables, but don't fail if it doesn't work (e.g., in serverless)
    try:
        await create_all_tables()
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.warning(f"Failed to initialize database tables (this is OK in serverless): {e}")
        # Don't raise - allow the app to start even if tables already exist
    yield

app = FastAPI(
    title="JMB Tender System API",
    description="API for managing tenders, bids, and users",
    version="1.0.0",
    lifespan=lifespan,
    swagger_ui_init_oauth={
        "usePkceWithAuthorizationCodeGrant": False,
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/")
def read_root():
    return {
        "message": "JMB Tender System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tenders.router, prefix="/tenders", tags=["tenders"])
app.include_router(bids.router, prefix="/bids", tags=["bids"])