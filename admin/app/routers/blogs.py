from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.blog import Blog
from app.schemas.blog import BlogCreate, BlogOut, BlogUpdate

router = APIRouter()


@router.get("/", response_model=list[BlogOut])
def list_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).all()


@router.post("/", response_model=BlogOut, dependencies=[Depends(get_current_admin)])
def create_blog(payload: BlogCreate, db: Session = Depends(get_db)):
    blog = Blog(**payload.model_dump())
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog


@router.get("/{blog_id}", response_model=BlogOut)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    return blog


@router.put("/{blog_id}", response_model=BlogOut, dependencies=[Depends(get_current_admin)])
def update_blog(blog_id: int, payload: BlogUpdate, db: Session = Depends(get_db)):
    blog = db.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(blog, field, value)
    db.commit()
    db.refresh(blog)
    return blog


@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    db.delete(blog)
    db.commit()
