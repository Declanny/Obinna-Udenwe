from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.config import settings
from app.dependencies import get_current_admin, get_db
from app.email_utils import send_content_broadcast
from app.models.book import Book
from app.models.subscriber import Subscriber
from app.schemas.book import BookOut

router = APIRouter()


def _maybe_notify(db: Session, background_tasks: BackgroundTasks, book: Book, notify: bool) -> None:
    if notify and book.status == "published":
        subs = db.query(Subscriber).all()
        if subs:
            url = f"{settings.client_url}/books/{book.id}"
            background_tasks.add_task(
                send_content_broadcast, subs, "book", book.title, book.tagline, book.image, url
            )


@router.get("/", response_model=list[BookOut])
def list_books(db: Session = Depends(get_db)):
    return db.query(Book).all()


@router.post("/", response_model=BookOut, dependencies=[Depends(get_current_admin)])
async def create_book(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    year: int = Form(...),
    tagline: str = Form(""),
    description: str = Form(""),
    status: str = Form("draft"),
    notify_subscribers: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_url = (await upload_to_cloudinary(image))["secure_url"] if image else ""
    book = Book(
        title=title,
        year=year,
        tagline=tagline,
        description=description,
        status=status,
        image=image_url,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    _maybe_notify(db, background_tasks, book, notify_subscribers)
    return book


@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return book


@router.put("/{book_id}", response_model=BookOut, dependencies=[Depends(get_current_admin)])
async def update_book(
    book_id: int,
    background_tasks: BackgroundTasks,
    title: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    tagline: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    notify_subscribers: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    if image:
        book.image = (await upload_to_cloudinary(image))["secure_url"]
    if title is not None:
        book.title = title
    if year is not None:
        book.year = year
    if tagline is not None:
        book.tagline = tagline
    if description is not None:
        book.description = description
    if status is not None:
        book.status = status
    db.commit()
    db.refresh(book)
    _maybe_notify(db, background_tasks, book, notify_subscribers)
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    db.delete(book)
    db.commit()
