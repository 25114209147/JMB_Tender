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
    mode = os.getenv("DB_MODE", "sqlite").lower()

    if mode == "sqlite":
        path = os.getenv("SQLITE_PATH", "./my_project_database.db")
        logger.info(f"Using SQLite (async): {path}")
        return f"sqlite+aiosqlite:///{path}"

    # Check for Vercel Supabase integration variables first
    postgres_url = os.getenv("POSTGRES_URL") or os.getenv("POSTGRES_URL_NON_POOLING")
    if postgres_url:
        # Vercel provides connection string, convert to asyncpg format if needed
        if postgres_url.startswith("postgresql://"):
            # Convert to asyncpg format
            url = postgres_url.replace("postgresql://", "postgresql+asyncpg://")
            logger.info("Using Vercel Supabase integration (POSTGRES_URL)")
            print(f"Database URL: {url[:50]}...")  # Log partial URL for security
            return url
        elif postgres_url.startswith("postgresql+asyncpg://"):
            logger.info("Using Vercel Supabase integration (POSTGRES_URL)")
            print(f"Database URL: {postgres_url[:50]}...")
            return postgres_url

    # Fall back to individual environment variables (Vercel or manual setup)
    user = os.getenv("POSTGRES_USER") or os.getenv("DB_USER")
    password = os.getenv("POSTGRES_PASSWORD") or os.getenv("DB_PASSWORD")
    host = os.getenv("POSTGRES_HOST") or os.getenv("DB_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT") or os.getenv("DB_PORT", "5432")
    db_name = os.getenv("POSTGRES_DATABASE") or os.getenv("DB_NAME", "jmb_tender")
    
    print(f"DB_MODE={mode}, DB_USER={user}, DB_HOST={host}, DB_PORT={port}, DB_NAME={db_name}")

    if not all([user, password, db_name]):
        raise ValueError("Missing database credentials. Need POSTGRES_USER/DB_USER, POSTGRES_PASSWORD/DB_PASSWORD, and POSTGRES_DATABASE/DB_NAME")

    if mode == "supabase":
        # Check for Vercel SUPABASE_URL or manual SUPABASE_URL
        supabase_host = os.getenv("SUPABASE_URL") or host
        if supabase_host and supabase_host != "localhost":
            host = supabase_host
        logger.info("Using Supabase")

    elif mode == "proxy":
        host = "127.0.0.1"  # Cloud SQL Auth Proxy
        logger.info("Using Cloud SQL Auth Proxy")

    else:
        logger.info("Using local PostgreSQL")

    url = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"
    print(f"Database URL: {url[:50]}...")  # Log partial URL for security
    return url

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