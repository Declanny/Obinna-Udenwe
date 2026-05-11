from datetime import datetime

from pydantic import BaseModel


class MediaAssetOut(BaseModel):
    id: int
    filename: str
    public_id: str
    url: str
    file_type: str
    size: int
    created_at: datetime

    model_config = {"from_attributes": True}
