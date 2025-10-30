# app/config.py
from pydantic_settings import BaseSettings
from pydantic import AnyUrl



class Settings(BaseSettings):
    MONGODB_URI: str
    MONGODB_DB: str = "blog_db"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
