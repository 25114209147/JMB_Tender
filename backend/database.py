import os
import logging
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

load_dotenv()
logger = logging.getLogger(__name__)

class Base(DeclarativeBase):
    pass

# Database URL builder
def get_standard_url() -> str:
    mode = os.getenv("DB_MODE", "local").lower()

    if mode == "sqlite":
        path = os.getenv("SQLITE_PATH", "./app.db")
        logger.info(f"Using SQLite (async): {path}")
        return f"sqlite+aiosqlite:///{path}"

    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "jmb_tender")

    if not all([user, password, db_name]):
        raise ValueError("Missing DB_USER, DB_PASSWORD or DB_NAME in .env")

    if mode == "supabase":
        host = os.getenv("SUPABASE_HOST")
        if not host:
            raise ValueError("SUPABASE_HOST required when DB_MODE=supabase")
        logger.info("Using Supabase (asyncpg)")

    elif mode == "proxy":
        host = "127.0.0.1"  # Cloud SQL Auth Proxy
        logger.info("Using Cloud SQL Auth Proxy")

    else:
        logger.info("Using local PostgreSQL")

    return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

# Cloud SQL Connector (optional, for GCP users)
def get_cloud_connector_engine():
    try:
        from google.cloud.sql.connector import Connector, IPTypes
    except ImportError:
        raise ImportError(
            "google-cloud-sql-connector not installed. "
            "Run: pip install google-cloud-sql-connector"
        )

    connector = Connector(ip_type=IPTypes.PUBLIC)  

    def getconn():
        return connector.connect(
            os.getenv("INSTANCE_CONNECTION_NAME"),
            "asyncpg",
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            db=os.getenv("DB_NAME"),
        )

    logger.info("Using Google Cloud SQL Connector (asyncpg)")
    return create_async_engine(
        "postgresql+asyncpg://",
        creator=getconn,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )

# Initialize engine & session
mode = os.getenv("DB_MODE", "local").lower()

if mode == "cloud_connector":
    engine = get_cloud_connector_engine()
else:
    url = get_standard_url()
    engine = create_async_engine(
        url,
        echo=os.getenv("SQL_ECHO", "false").lower() == "true",
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# FastAPI dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency to get async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Utilities 
async def create_all_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("All tables created")

async def drop_all_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    logger.warning("All tables dropped")