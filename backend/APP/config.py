from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # MongoDB connection string — the database name must be in the URI.
    # Local:  mongodb://localhost:27017/blogify
    # Atlas:  mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/blogify
    mongodb_uri: str

    # Secret key used to sign and verify our own JWTs (any long random string).
    jwt_secret: str

    # Token validity in minutes — default 7 days.
    jwt_expire_minutes: int = 10080

    # Public base URL of this API, used to build absolute image URLs.
    # Set this to your Railway URL in production.
    api_base_url: str = "http://127.0.0.1:8000"

    # Frontend origin for CORS — set to your Vercel URL in production.
    frontend_url: str = "http://localhost:3000"

    app_host: str = "0.0.0.0"
    app_port: int = 8000

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
