from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.config import settings
from app.dependencies import get_current_admin, get_db
from app.email_utils import send_content_broadcast
from app.models.blog import Blog
from app.models.subscriber import Subscriber
from app.schemas.blog import BlogOut

router = APIRouter()


def _maybe_notify(db: Session, background_tasks: BackgroundTasks, blog: Blog, notify: bool) -> None:
    if notify and blog.status == "published":
        subs = db.query(Subscriber).all()
        if subs:
            url = f"{settings.client_url}/news/{blog.id}"
            background_tasks.add_task(
                send_content_broadcast, subs, "blog", blog.title, blog.excerpt, blog.cover, url
            )


@router.get("/", response_model=list[BlogOut])
def list_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).all()


@router.post("/", response_model=BlogOut, dependencies=[Depends(get_current_admin)])
async def create_blog(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    category: str = Form("blog"),
    published_on: str = Form(""),
    excerpt: str = Form(""),
    body: str = Form(""),
    status: str = Form("draft"),
    notify_subscribers: bool = Form(False),
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
    _maybe_notify(db, background_tasks, blog, notify_subscribers)
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
    background_tasks: BackgroundTasks,
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    published_on: Optional[str] = Form(None),
    excerpt: Optional[str] = Form(None),
    body: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    notify_subscribers: bool = Form(False),
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
    _maybe_notify(db, background_tasks, blog, notify_subscribers)
    return blog


@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    db.delete(blog)
    db.commit()
