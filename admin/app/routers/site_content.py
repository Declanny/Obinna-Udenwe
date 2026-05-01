import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.site_content import SiteContent
from app.schemas.site_content import SiteContentOut, SiteContentUpdate

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
def update_site_content(payload: SiteContentUpdate, db: Session = Depends(get_db)):
    row = _get_or_create(db)
    data = payload.model_dump(exclude_none=True)
    if "awards" in data:
        row.awards_json = json.dumps(data.pop("awards"))
    for field, value in data.items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row
