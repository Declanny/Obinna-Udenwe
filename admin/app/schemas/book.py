from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class BookBase(BaseModel):
    title: str
    year: int
    image: str = ""
    tagline: str = ""
    description: str = ""
    status: Literal["draft", "published"] = "draft"


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    year: Optional[int] = None
    image: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["draft", "published"]] = None


class BookOut(BookBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
