from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class BlogBase(BaseModel):
    title: str
    category: Literal["blog", "news"] = "blog"
    published_on: str = ""
    excerpt: str = ""
    body: str = ""
    cover: str = ""
    status: Literal["draft", "published"] = "draft"


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[Literal["blog", "news"]] = None
    published_on: Optional[str] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    cover: Optional[str] = None
    status: Optional[Literal["draft", "published"]] = None


class BlogOut(BlogBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
