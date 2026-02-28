from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ─── Auth ───

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    display_name: Optional[str] = Field(None, max_length=100)


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


# ─── User ───

class UserPublic(BaseModel):
    id: int
    username: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    display_name: Optional[str] = Field(None, max_length=100)


# ─── Model3D ───

class Model3DCreate(BaseModel):
    title: str = Field("Untitled Model", max_length=200)
    description: Optional[str] = None
    is_public: bool = True


class Model3DResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    file_path: str
    original_photo_path: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_public: bool
    likes_count: int
    created_at: datetime
    owner: Optional[UserPublic] = None
    is_liked: bool = False
    is_favorited: bool = False

    class Config:
        from_attributes = True


class Model3DUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    is_public: Optional[bool] = None


# ─── Model Version ───

class ModelVersionResponse(BaseModel):
    id: int
    model_id: int
    file_path: str
    label: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Feed / Pagination ───

class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    per_page: int
    pages: int
