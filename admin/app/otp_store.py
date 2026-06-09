import secrets
import string
from dataclasses import dataclass, field
from datetime import datetime, timedelta

OTP_TTL_MINUTES = 10
OTP_MAX_ATTEMPTS = 3


@dataclass
class OTPEntry:
    code: str
    expires_at: datetime
    attempts: int = field(default=0)


# Module-level singleton. Safe for single-process, single-admin use.
# Key is the admin username string.
_store: dict[str, OTPEntry] = {}


def generate_otp() -> str:
    return "".join(secrets.choice(string.digits) for _ in range(6))


def store_otp(username: str, fixed_code: str | None = None) -> str:
    """Generate (or use fixed_code), persist, and return a new OTP. Overwrites any pending entry."""
    code = fixed_code if fixed_code is not None else generate_otp()
    _store[username] = OTPEntry(
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    return code


def validate_otp(username: str, code: str) -> bool:
    """
    Returns True and clears the entry on success.
    Returns False for wrong code, expired code, or no pending entry.
    Invalidates the entry after OTP_MAX_ATTEMPTS failed attempts.
    """
    entry = _store.get(username)
    if entry is None:
        return False
    if datetime.utcnow() > entry.expires_at:
        del _store[username]
        return False
    entry.attempts += 1
    if entry.attempts > OTP_MAX_ATTEMPTS:
        del _store[username]
        return False
    if entry.code != code:
        return False
    del _store[username]
    return True
