# app/db_supabase.py
"""
Supabase/PostgreSQL database connection using asyncpg
"""
import asyncpg
from typing import Optional
from .config import settings

_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    """Get or create the connection pool"""
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            settings.DATABASE_URL,
            min_size=2,
            max_size=10,
        )
    return _pool


async def close_pool():
    """Close the connection pool"""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


async def get_connection():
    """Get a connection from the pool"""
    pool = await get_pool()
    return pool
