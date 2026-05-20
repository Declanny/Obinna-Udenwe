from datetime import datetime

from sqlalchemy import Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Subscriber(Base):
    __tablename__ = "subscribers"
    __table_args__ = (UniqueConstraint("email", name="uq_subscriber_email"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False, index=True)
    subscribed_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
