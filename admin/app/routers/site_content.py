import json
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.dependencies import get_current_admin, get_db
from app.models.site_content import SiteContent
from app.schemas.site_content import SiteContentOut

router = APIRouter()


def _get_or_create(db: Session) -> SiteContent:
    row = db.get(SiteContent, 1)
    if not row:
        row = SiteContent(id=1)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("/", response_model=SiteContentOut)
def get_site_content(db: Session = Depends(get_db)):
    return _get_or_create(db)


@router.put("/", response_model=SiteContentOut, dependencies=[Depends(get_current_admin)])
async def update_site_content(
    hero_kicker: Optional[str] = Form(None),
    hero_title: Optional[str] = Form(None),
    hero_subtitle: Optional[str] = Form(None),
    hero_cta_label: Optional[str] = Form(None),
    hero_image: Optional[UploadFile] = File(None),
    awards: Optional[str] = Form(None),  # JSON array string e.g. '["Award A","Award B"]'
    featured_kicker: Optional[str] = Form(None),
    featured_title: Optional[str] = Form(None),
    featured_tagline: Optional[str] = Form(None),
    featured_description: Optional[str] = Form(None),
    featured_image: Optional[UploadFile] = File(None),
    newsletter_headline: Optional[str] = Form(None),
    newsletter_body: Optional[str] = Form(None),
    contact_email: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    row = _get_or_create(db)

    if hero_image:
        row.hero_image = (await upload_to_cloudinary(hero_image))["secure_url"]
    if featured_image:
        row.featured_image = (await upload_to_cloudinary(featured_image))["secure_url"]
    if awards is not None:
        row.awards_json = json.dumps(json.loads(awards))

    simple_fields = {
        "hero_kicker": hero_kicker,
        "hero_title": hero_title,
        "hero_subtitle": hero_subtitle,
        "hero_cta_label": hero_cta_label,
        "featured_kicker": featured_kicker,
        "featured_title": featured_title,
        "featured_tagline": featured_tagline,
        "featured_description": featured_description,
        "newsletter_headline": newsletter_headline,
        "newsletter_body": newsletter_body,
        "contact_email": contact_email,
    }
    for field, value in simple_fields.items():
        if value is not None:
            setattr(row, field, value)

    db.commit()
    db.refresh(row)
    return row
