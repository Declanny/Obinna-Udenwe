from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.email_utils import send_new_subscriber_alert
from app.models.subscriber import Subscriber
from app.schemas.subscriber import SubscriberCreate, SubscriberOut

router = APIRouter()


@router.post("/", response_model=SubscriberOut, status_code=status.HTTP_201_CREATED)
async def subscribe(
    payload: SubscriberCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    subscriber = Subscriber(name=payload.name, email=payload.email)
    db.add(subscriber)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already subscribed.",
        )
    db.refresh(subscriber)
    background_tasks.add_task(send_new_subscriber_alert, payload.name, payload.email)
    return subscriber


@router.get("/", response_model=list[SubscriberOut], dependencies=[Depends(get_current_admin)])
def list_subscribers(db: Session = Depends(get_db)):
    return db.query(Subscriber).order_by(Subscriber.subscribed_at.desc()).all()


@router.delete("/{subscriber_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_subscriber(subscriber_id: int, db: Session = Depends(get_db)):
    subscriber = db.get(Subscriber, subscriber_id)
    if not subscriber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")
    db.delete(subscriber)
    db.commit()
