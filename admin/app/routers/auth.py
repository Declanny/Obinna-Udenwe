import re
from datetime import datetime, timedelta

import bcrypt
from fastapi import APIRouter, HTTPException, status
from jose import jwt

from app.config import settings
from app.email_utils import send_otp_email
from app.otp_store import store_otp, validate_otp
from app.schemas.auth import LoginRequest, OTPSentResponse, TokenResponse, VerifyOTPRequest

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
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to send verification email. Check SMTP configuration.",
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
