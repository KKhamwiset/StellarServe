from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = "StellaServe"
    app_env: str = "development"
    debug: bool = True

    # Server
    host: str = "192.168.100.39"
    port: int = 8000

    # Database
    database_url: str = os.getenv("DATABASE_URL")

    # JWT Auth
    secret_key: str = os.getenv("SECRET_KEY")
    algorithm: str = os.getenv("ALGORITHM")
    access_token_expire_minutes: int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

    # CORS
    cors_origins: str = os.getenv("CORS_ORIGINS")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
