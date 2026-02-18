from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    # Found in Supabase Dashboard → Settings → API → JWT Settings → JWT Secret
    supabase_jwt_secret: str
    app_host: str = "127.0.0.1"
    app_port: int = 8000

    model_config = {"env_file": "backend/.env", "extra": "ignore"}


settings = Settings()
