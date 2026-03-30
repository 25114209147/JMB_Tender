from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from routers import users, tenders, bids
from database import create_all_tables

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await create_all_tables()
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.warning(f"Failed to initialize database tables: {e}")
    yield

app = FastAPI(
    title="JMB Tender System API",
    description="API for managing tenders, bids, and users",
    version="1.0.0",
    lifespan=lifespan,
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