from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import engine, Base
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.models import router as models_router
from app.api.feed import router as feed_router
from app.api.ws import router as ws_router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        description="Web platform for generating 3D models from photographs",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ─── CORS ───
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ─── Routers ───
    app.include_router(auth_router)
    app.include_router(users_router)
    app.include_router(models_router)
    app.include_router(feed_router)
    app.include_router(ws_router)

    # ─── Static files (uploads) ───
    app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

    # ─── Startup ───
    @app.on_event("startup")
    async def on_startup():
        # Create all tables (dev only — use Alembic migrations in prod)
        Base.metadata.create_all(bind=engine)

    @app.get("/api/health")
    async def health_check():
        return {"status": "ok", "app": settings.APP_NAME}

    return app


app = create_app()
