from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.email_utils import send_contact_notification
from app.models.contact import ContactSubmission
from app.schemas.contact import ContactSubmissionCreate, ContactSubmissionOut

router = APIRouter()


@router.post("/", response_model=ContactSubmissionOut, status_code=status.HTTP_201_CREATED)
async def submit_contact(
    payload: ContactSubmissionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    data = payload.model_dump()
    data["organization"] = data["organization"] or ""
    data["schedule"] = data["schedule"] or ""
    submission = ContactSubmission(**data)
    db.add(submission)
    db.commit()
    db.refresh(submission)

    background_tasks.add_task(
        send_contact_notification,
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
        inquiry_type=payload.inquiry_type,
        organization=payload.organization,
        schedule=payload.schedule,
    )

    return submission


@router.get("/", response_model=list[ContactSubmissionOut], dependencies=[Depends(get_current_admin)])
def list_submissions(db: Session = Depends(get_db)):
    return db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).all()


@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_submission(submission_id: int, db: Session = Depends(get_db)):
    submission = db.get(ContactSubmission, submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    db.delete(submission)
    db.commit()
