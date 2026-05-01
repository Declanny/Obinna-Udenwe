from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.gallery import GalleryItem
from app.schemas.gallery import GalleryCreate, GalleryOut, GalleryUpdate

router = APIRouter()


@router.get("/", response_model=list[GalleryOut])
def list_gallery(db: Session = Depends(get_db)):
    return db.query(GalleryItem).all()


@router.post("/", response_model=GalleryOut, dependencies=[Depends(get_current_admin)])
def create_gallery_item(payload: GalleryCreate, db: Session = Depends(get_db)):
    item = GalleryItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/{item_id}", response_model=GalleryOut)
def get_gallery_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(GalleryItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    return item


@router.put("/{item_id}", response_model=GalleryOut, dependencies=[Depends(get_current_admin)])
def update_gallery_item(item_id: int, payload: GalleryUpdate, db: Session = Depends(get_db)):
    item = db.get(GalleryItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_gallery_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(GalleryItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    db.delete(item)
    db.commit()
