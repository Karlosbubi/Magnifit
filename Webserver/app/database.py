import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker

# Load .env variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env file")

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Automap the existing database schema
Base = automap_base()

async def prepare_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.prepare, reflect=True)

# Create async session factory
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
