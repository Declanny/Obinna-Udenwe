import asyncio
import os

import cloudinary.uploader
from fastapi import UploadFile

from app.config import settings


async def upload_to_cloudinary(file: UploadFile) -> dict:
    ext = os.path.splitext(file.filename or "")[1].lower()
    content = await file.read()
    return await asyncio.to_thread(
        cloudinary.uploader.upload,
        content,
        folder=settings.cloudinary_folder,
        resource_type="auto",
        use_filename=True,
        unique_filename=True,
    )
