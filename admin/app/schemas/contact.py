from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr


class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    inquiry_type: Literal["reader", "press", "publishers", "events"]
    organization: Optional[str] = None
    schedule: Optional[str] = None


class ContactSubmissionOut(ContactSubmissionCreate):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
