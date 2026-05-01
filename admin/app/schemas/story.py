from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class StoryBase(BaseModel):
    title: str
    read_time: str = ""
    excerpt: str = ""
    body: str = ""
    cover: str = ""
    status: Literal["draft", "published"] = "draft"


class StoryCreate(StoryBase):
    pass


class StoryUpdate(BaseModel):
    title: Optional[str] = None
    read_time: Optional[str] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    cover: Optional[str] = None
    status: Optional[Literal["draft", "published"]] = None


class StoryOut(StoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
