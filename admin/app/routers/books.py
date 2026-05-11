from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.cloudinary_utils import upload_to_cloudinary
from app.dependencies import get_current_admin, get_db
from app.models.book import Book
from app.schemas.book import BookOut

router = APIRouter()


@router.get("/", response_model=list[BookOut])
def list_books(db: Session = Depends(get_db)):
    return db.query(Book).all()


@router.post("/", response_model=BookOut, dependencies=[Depends(get_current_admin)])
async def create_book(
    title: str = Form(...),
    year: int = Form(...),
    tagline: str = Form(""),
    description: str = Form(""),
    status: str = Form("draft"),
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
    title: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    tagline: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
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
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    db.delete(book)
    db.commit()
