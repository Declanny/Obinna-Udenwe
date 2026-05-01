from datetime import datetime

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SiteContent(Base):
    """Singleton row (id=1) holding all editable site-wide content."""

    __tablename__ = "site_content"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)

    # Hero section
    hero_kicker: Mapped[str] = mapped_column(String, default="")
    hero_title: Mapped[str] = mapped_column(String, default="")
    hero_subtitle: Mapped[str] = mapped_column(String, default="")
    hero_cta_label: Mapped[str] = mapped_column(String, default="")
    hero_image: Mapped[str] = mapped_column(String, default="")

    # Awards — stored as a JSON array string e.g. '["Award A", "Award B"]'
    awards_json: Mapped[str] = mapped_column(Text, default="[]")

    # Featured book section
    featured_kicker: Mapped[str] = mapped_column(String, default="")
    featured_title: Mapped[str] = mapped_column(String, default="")
    featured_tagline: Mapped[str] = mapped_column(String, default="")
    featured_description: Mapped[str] = mapped_column(String, default="")
    featured_image: Mapped[str] = mapped_column(String, default="")

    # Newsletter / contact
    newsletter_headline: Mapped[str] = mapped_column(String, default="")
    newsletter_body: Mapped[str] = mapped_column(String, default="")
    contact_email: Mapped[str] = mapped_column(String, default="")

    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)
