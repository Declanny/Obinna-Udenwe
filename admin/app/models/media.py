from datetime import datetime

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    public_id: Mapped[str] = mapped_column(String, nullable=False)  # Cloudinary public_id for deletion
    url: Mapped[str] = mapped_column(String, nullable=False)        # Cloudinary secure_url
    file_type: Mapped[str] = mapped_column(String, default="image") # "image" | "video" | "raw"
    size: Mapped[int] = mapped_column(Integer, default=0)           # bytes
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
