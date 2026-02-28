from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # ─── App ───
    APP_NAME: str = "Tridi"
    DEBUG: bool = True

    # ─── Database ───
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/tridi"

    # ─── JWT ───
    SECRET_KEY: str = "super-secret-key-change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ─── File Storage ───
    UPLOAD_DIR: Path = Path("uploads")
    MODELS_DIR: Path = Path("uploads/models")
    PHOTOS_DIR: Path = Path("uploads/photos")
    MAX_UPLOAD_SIZE_MB: int = 10

    # ─── CORS ───
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

# Ensure upload directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.MODELS_DIR.mkdir(parents=True, exist_ok=True)
settings.PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
