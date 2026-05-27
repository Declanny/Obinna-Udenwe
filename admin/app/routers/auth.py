import logging
import re
from datetime import datetime, timedelta

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt

from app.config import settings, update_password_hash
from app.dependencies import get_current_admin
from app.email_utils import send_otp_email
from app.otp_store import store_otp, validate_otp
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    OTPSentResponse,
    PasswordChangedResponse,
    TokenResponse,
    VerifyOTPRequest,
)

logger = logging.getLogger(__name__)

router = APIRouter()

_CODE_RE = re.compile(r"^\d{6}$")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


@router.post("/login", response_model=OTPSentResponse)
async def login(payload: LoginRequest) -> OTPSentResponse:
    """Step 1 — validate credentials and dispatch OTP."""
    if payload.username != settings.admin_username or not verify_password(
        payload.password, settings.admin_password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )
    code = store_otp(payload.username)
    try:
        await send_otp_email(code)
    except Exception as exc:
        logger.exception("SMTP error sending OTP to %s: %s", settings.admin_email, exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to send verification email: {exc}",
        )
    return OTPSentResponse()


@router.post("/resend", response_model=OTPSentResponse)
async def resend_otp(payload: LoginRequest) -> OTPSentResponse:
    """Re-validate credentials and dispatch a fresh OTP, invalidating any pending one."""
    if payload.username != settings.admin_username or not verify_password(
        payload.password, settings.admin_password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )
    code = store_otp(payload.username)
    try:
        await send_otp_email(code)
    except Exception as exc:
        logger.exception("SMTP error resending OTP to %s: %s", settings.admin_email, exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to send verification email: {exc}",
        )
    return OTPSentResponse()


@router.post("/verify", response_model=TokenResponse)
async def verify_otp(payload: VerifyOTPRequest) -> TokenResponse:
    """Step 2 — exchange a valid OTP for a JWT."""
    if not _CODE_RE.match(payload.code):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Code must be exactly 6 digits",
        )
    if not validate_otp(payload.username, payload.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code",
        )
    token = create_access_token({"sub": payload.username})
    return TokenResponse(access_token=token)


@router.post("/change-password/request-otp", response_model=OTPSentResponse)
async def request_change_password_otp(
    username: str = Depends(get_current_admin),
) -> OTPSentResponse:
    code = store_otp(username)
    try:
        await send_otp_email(code)
    except Exception as exc:
        logger.exception("SMTP error sending change-password OTP: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to send verification email: {exc}",
        )
    return OTPSentResponse()


@router.post("/change-password/confirm", response_model=PasswordChangedResponse)
async def confirm_change_password(
    payload: ChangePasswordRequest,
    username: str = Depends(get_current_admin),
) -> PasswordChangedResponse:
    if not _CODE_RE.match(payload.otp_code):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Code must be exactly 6 digits",
        )
    if not verify_password(payload.old_password, settings.admin_password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid current password",
        )
    if not validate_otp(username, payload.otp_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code",
        )
    new_hash = bcrypt.hashpw(payload.new_password.encode(), bcrypt.gensalt()).decode()
    update_password_hash(new_hash)
    return PasswordChangedResponse()
