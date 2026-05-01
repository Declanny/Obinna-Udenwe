from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.story import Story
from app.schemas.story import StoryCreate, StoryOut, StoryUpdate

router = APIRouter()


@router.get("/", response_model=list[StoryOut])
def list_stories(db: Session = Depends(get_db)):
    return db.query(Story).all()


@router.post("/", response_model=StoryOut, dependencies=[Depends(get_current_admin)])
def create_story(payload: StoryCreate, db: Session = Depends(get_db)):
    story = Story(**payload.model_dump())
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
def update_story(story_id: int, payload: StoryUpdate, db: Session = Depends(get_db)):
    story = db.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(story, field, value)
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
