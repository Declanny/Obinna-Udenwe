import json
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, model_validator


class SiteContentUpdate(BaseModel):
    hero_kicker: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_cta_label: Optional[str] = None
    hero_image: Optional[str] = None
    awards: Optional[list[str]] = None
    featured_kicker: Optional[str] = None
    featured_title: Optional[str] = None
    featured_tagline: Optional[str] = None
    featured_description: Optional[str] = None
    featured_image: Optional[str] = None
    newsletter_headline: Optional[str] = None
    newsletter_body: Optional[str] = None
    contact_email: Optional[str] = None


class SiteContentOut(BaseModel):
    id: int
    hero_kicker: str
    hero_title: str
    hero_subtitle: str
    hero_cta_label: str
    hero_image: str
    awards: list[str]
    featured_kicker: str
    featured_title: str
    featured_tagline: str
    featured_description: str
    featured_image: str
    newsletter_headline: str
    newsletter_body: str
    contact_email: str
    updated_at: datetime

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def parse_awards(cls, data):
        """Deserialise awards_json -> awards when reading from ORM object."""
        if hasattr(data, "awards_json"):
            obj = dict(data.__dict__)
            obj["awards"] = json.loads(data.awards_json or "[]")
            return obj
        return data
