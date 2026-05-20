from datetime import datetime

from pydantic import BaseModel


class SubscriberCreate(BaseModel):
    name: str
    email: str


class SubscriberOut(SubscriberCreate):
    id: int
    subscribed_at: datetime

    model_config = {"from_attributes": True}
