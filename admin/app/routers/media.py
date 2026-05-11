import asyncio

import cloudinary.uploader
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.dependencies import get_current_admin, get_db
from app.models.media import MediaAsset
from app.schemas.media import MediaAssetOut

router = APIRouter()

_IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
_VIDEO_TYPES = {".mp4", ".mov", ".avi", ".webm"}


def _resource_type(ext: str) -> str:
    if ext in _IMAGE_TYPES:
        return "image"
    if ext in _VIDEO_TYPES:
        return "video"
    return "raw"


@router.get("/", response_model=list[MediaAssetOut])
def list_media(db: Session = Depends(get_db)):
    return db.query(MediaAsset).order_by(MediaAsset.created_at.desc()).all()


@router.post("/upload", response_model=MediaAssetOut, dependencies=[Depends(get_current_admin)])
async def upload_media(file: UploadFile = File(...), db: Session = Depends(get_db)):
    import os
    ext = os.path.splitext(file.filename or "")[1].lower()
    result = await upload_to_cloudinary(file)

    asset = MediaAsset(
        filename=file.filename or result["original_filename"],
        public_id=result["public_id"],
        url=result["secure_url"],
        file_type=_resource_type(ext),
        size=result.get("bytes", 0),
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
async def delete_media(asset_id: int, db: Session = Depends(get_db)):
    asset = db.get(MediaAsset, asset_id)
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")

    await asyncio.to_thread(
        cloudinary.uploader.destroy,
        asset.public_id,
        resource_type=asset.file_type,
    )

    db.delete(asset)
    db.commit()
