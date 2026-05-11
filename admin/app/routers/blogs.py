from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.dependencies import get_current_admin, get_db
from app.models.blog import Blog
from app.schemas.blog import BlogOut

router = APIRouter()


@router.get("/", response_model=list[BlogOut])
def list_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).all()


@router.post("/", response_model=BlogOut, dependencies=[Depends(get_current_admin)])
async def create_blog(
    title: str = Form(...),
    category: str = Form("blog"),
    published_on: str = Form(""),
    excerpt: str = Form(""),
    body: str = Form(""),
    status: str = Form("draft"),
    cover: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    cover_url = (await upload_to_cloudinary(cover))["secure_url"] if cover else ""
    blog = Blog(
        title=title,
        category=category,
        published_on=published_on,
        excerpt=excerpt,
        body=body,
        status=status,
        cover=cover_url,
    )
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
async def update_blog(
    blog_id: int,
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    published_on: Optional[str] = Form(None),
    excerpt: Optional[str] = Form(None),
    body: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    cover: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    blog = db.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    if cover:
        blog.cover = (await upload_to_cloudinary(cover))["secure_url"]
    if title is not None:
        blog.title = title
    if category is not None:
        blog.category = category
    if published_on is not None:
        blog.published_on = published_on
    if excerpt is not None:
        blog.excerpt = excerpt
    if body is not None:
        blog.body = body
    if status is not None:
        blog.status = status
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
