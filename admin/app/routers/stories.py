from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.dependencies import get_current_admin, get_db
from app.models.story import Story
from app.schemas.story import StoryOut

router = APIRouter()


@router.get("/", response_model=list[StoryOut])
def list_stories(db: Session = Depends(get_db)):
    return db.query(Story).all()


@router.post("/", response_model=StoryOut, dependencies=[Depends(get_current_admin)])
async def create_story(
    title: str = Form(...),
    read_time: str = Form(""),
    excerpt: str = Form(""),
    body: str = Form(""),
    status: str = Form("draft"),
    cover: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    cover_url = (await upload_to_cloudinary(cover))["secure_url"] if cover else ""
    story = Story(
        title=title,
        read_time=read_time,
        excerpt=excerpt,
        body=body,
        status=status,
        cover=cover_url,
    )
    db.add(story)
    db.commit()
    db.refresh(story)
    return story


@router.get("/{story_id}", response_model=StoryOut)
def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    return story


@router.put("/{story_id}", response_model=StoryOut, dependencies=[Depends(get_current_admin)])
async def update_story(
    story_id: int,
    title: Optional[str] = Form(None),
    read_time: Optional[str] = Form(None),
    excerpt: Optional[str] = Form(None),
    body: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    cover: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    story = db.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    if cover:
        story.cover = (await upload_to_cloudinary(cover))["secure_url"]
    if title is not None:
        story.title = title
    if read_time is not None:
        story.read_time = read_time
    if excerpt is not None:
        story.excerpt = excerpt
    if body is not None:
        story.body = body
    if status is not None:
        story.status = status
    db.commit()
    db.refresh(story)
    return story


@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    db.delete(story)
    db.commit()
