from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.db.models import Model3D
from app.api.schemas import Model3DResponse

router = APIRouter(prefix="/api/feed", tags=["Feed"])


@router.get("", response_model=dict)
def get_feed(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get the public feed of models with pagination."""
    query = (
        db.query(Model3D)
        .filter(Model3D.is_public == True)
        .options(joinedload(Model3D.owner))
        .order_by(Model3D.created_at.desc())
    )

    total = query.count()
    models = query.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": [Model3DResponse.model_validate(m) for m in models],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page,
    }
