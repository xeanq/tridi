import uuid
import aiofiles
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.db.models import User, Model3D, ModelVersion, Like, Favorite
from app.api.deps import get_current_user
from app.api.schemas import (
    Model3DResponse,
    Model3DUpdate,
    ModelVersionResponse,
    PaginatedResponse,
)
from app.core.config import settings

router = APIRouter(prefix="/api/models", tags=["Models"])

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/generate", response_model=Model3DResponse, status_code=201)
async def generate_model(
    file: UploadFile = File(...),
    title: str = Form("Untitled Model"),
    description: str = Form(None),
    is_public: bool = Form(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a photo and generate a 3D model from it."""
    # Validate file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WEBP images are accepted")

    # Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")

    # Save the uploaded photo
    file_ext = Path(file.filename).suffix or ".png"
    photo_filename = f"{uuid.uuid4()}{file_ext}"
    photo_path = settings.PHOTOS_DIR / photo_filename

    async with aiofiles.open(photo_path, "wb") as f:
        await f.write(contents)

    # TODO: Phase 4 — trigger AI pipeline (rembg → TripoSR → trimesh)
    # For now, create a placeholder model record
    model_filename = f"{uuid.uuid4()}.obj"
    model_path = settings.MODELS_DIR / model_filename

    model = Model3D(
        user_id=current_user.id,
        title=title,
        description=description,
        file_path=str(model_path),
        original_photo_path=str(photo_path),
        is_public=is_public,
    )
    db.add(model)
    db.commit()
    db.refresh(model)

    return model


@router.get("", response_model=list[Model3DResponse])
def get_my_models(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all models owned by the current user."""
    models = (
        db.query(Model3D)
        .filter(Model3D.user_id == current_user.id)
        .order_by(Model3D.created_at.desc())
        .all()
    )
    return models


@router.get("/{model_id}", response_model=Model3DResponse)
def get_model(
    model_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific model by ID."""
    model = db.query(Model3D).filter(Model3D.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model


@router.put("/{model_id}", response_model=Model3DResponse)
def update_model(
    model_id: int,
    data: Model3DUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update model metadata (title, description, visibility)."""
    model = db.query(Model3D).filter(
        Model3D.id == model_id, Model3D.user_id == current_user.id
    ).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    if data.title is not None:
        model.title = data.title
    if data.description is not None:
        model.description = data.description
    if data.is_public is not None:
        model.is_public = data.is_public

    db.commit()
    db.refresh(model)
    return model


@router.delete("/{model_id}", status_code=204)
def delete_model(
    model_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a model owned by the current user."""
    model = db.query(Model3D).filter(
        Model3D.id == model_id, Model3D.user_id == current_user.id
    ).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    db.delete(model)
    db.commit()


# ─── Likes & Favorites ───

@router.post("/{model_id}/like", status_code=200)
def toggle_like(
    model_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle a like on a model."""
    model = db.query(Model3D).filter(Model3D.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    existing = db.query(Like).filter(
        Like.user_id == current_user.id, Like.model_id == model_id
    ).first()

    if existing:
        db.delete(existing)
        model.likes_count = max(0, model.likes_count - 1)
        db.commit()
        return {"liked": False, "likes_count": model.likes_count}
    else:
        like = Like(user_id=current_user.id, model_id=model_id)
        db.add(like)
        model.likes_count += 1
        db.commit()
        return {"liked": True, "likes_count": model.likes_count}


@router.post("/{model_id}/favorite", status_code=200)
def toggle_favorite(
    model_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle a favorite on a model."""
    model = db.query(Model3D).filter(Model3D.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id, Favorite.model_id == model_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"favorited": False}
    else:
        fav = Favorite(user_id=current_user.id, model_id=model_id)
        db.add(fav)
        db.commit()
        return {"favorited": True}


# ─── Export ───

@router.get("/{model_id}/export")
def export_model(
    model_id: int,
    format: str = Query("stl", regex="^(stl|obj|3mf|amf)$"),
    db: Session = Depends(get_db),
):
    """Export a model in the specified format (stl, obj, 3mf, amf)."""
    model = db.query(Model3D).filter(Model3D.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    # TODO: Phase 4 — convert via trimesh and return file
    return {"model_id": model_id, "format": format, "status": "not_implemented"}


# ─── Versions ───

@router.get("/{model_id}/versions", response_model=list[ModelVersionResponse])
def get_model_versions(
    model_id: int,
    db: Session = Depends(get_db),
):
    """Get all saved versions (snapshots) of a model."""
    versions = (
        db.query(ModelVersion)
        .filter(ModelVersion.model_id == model_id)
        .order_by(ModelVersion.created_at.desc())
        .all()
    )
    return versions
