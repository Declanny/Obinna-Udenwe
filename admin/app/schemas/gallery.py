from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class GalleryBase(BaseModel):
    title: str
    image: str = ""


class GalleryCreate(GalleryBase):
    pass


class GalleryUpdate(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None


class GalleryOut(GalleryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
