from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import users, tenders, bids
from database import create_all_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_all_tables()
    yield

app = FastAPI(
    title="JMB Tender System API",
    description="API for managing tenders, bids, and users",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
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