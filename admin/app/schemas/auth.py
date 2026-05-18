from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class VerifyOTPRequest(BaseModel):
    username: str
    code: str  # str to preserve leading zeros (e.g. "007342")


class OTPSentResponse(BaseModel):
    message: str = "Verification code sent to admin email"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
