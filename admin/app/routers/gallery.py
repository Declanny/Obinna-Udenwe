from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.dependencies import get_current_admin, get_db
from app.models.gallery import GalleryItem
from app.schemas.gallery import GalleryOut

router = APIRouter()


@router.get("/", response_model=list[GalleryOut])
def list_gallery(db: Session = Depends(get_db)):
    return db.query(GalleryItem).all()


@router.post("/", response_model=GalleryOut, dependencies=[Depends(get_current_admin)])
async def create_gallery_item(
    title: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_url = (await upload_to_cloudinary(image))["secure_url"] if image else ""
    item = GalleryItem(title=title, image=image_url)
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
async def update_gallery_item(
    item_id: int,
    title: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    item = db.get(GalleryItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    if image:
        item.image = (await upload_to_cloudinary(image))["secure_url"]
    if title is not None:
        item.title = title
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
