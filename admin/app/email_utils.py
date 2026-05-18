from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.config import settings


async def send_otp_email(code: str) -> None:
    """Send a 6-digit OTP to the configured admin email address."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Admin Login Verification Code"
    msg["From"] = settings.smtp_from_email
    msg["To"] = settings.admin_email

    plain = (
        f"Your admin login verification code is: {code}\n\n"
        f"This code expires in 10 minutes.\n"
        f"If you did not request this, please ignore this email."
    )
    html = f"""
    <html><body style="font-family:sans-serif;color:#333;">
      <p>Your admin login verification code is:</p>
      <h2 style="letter-spacing:8px;font-size:32px;">{code}</h2>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p style="color:#999;font-size:12px;">
        If you did not request this code, please ignore this email.
      </p>
    </body></html>
    """

    msg.attach(MIMEText(plain, "plain"))
    msg.attach(MIMEText(html, "html"))

    await aiosmtplib.send(
        msg,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_username,
        password=settings.smtp_password,
        start_tls=settings.smtp_use_tls,
    )
