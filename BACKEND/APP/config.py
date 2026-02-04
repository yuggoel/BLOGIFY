# app/config.py
from pydantic_settings import BaseSettings
from pydantic import AnyUrl
from typing import Optional


class Settings(BaseSettings):
    # Database - supports both MongoDB and Supabase/PostgreSQL
    MONGODB_URI: Optional[str] = None
    MONGODB_DB: str = "blog_db"
    DATABASE_URL: Optional[str] = None  # Supabase PostgreSQL connection string
    
    # App settings
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    
    # Database mode: "mongodb" or "supabase"
    DB_MODE: str = "mongodb"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
