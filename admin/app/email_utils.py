from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.config import settings


async def send_contact_notification(name: str, email: str, subject: str, message: str, inquiry_type: str, organization: str | None, schedule: str | None) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"New Contact Inquiry: {subject}"
    msg["From"] = settings.smtp_from_email
    msg["To"] = settings.admin_email

    extras = ""
    if organization:
        extras += f"\nOrganization: {organization}"
    if schedule:
        extras += f"\nSchedule: {schedule}"

    plain = (
        f"New contact form submission\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Inquiry Type: {inquiry_type}{extras}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message}"
    )
    extra_html = ""
    if organization:
        extra_html += f"<tr><td><strong>Organization:</strong></td><td>{organization}</td></tr>"
    if schedule:
        extra_html += f"<tr><td><strong>Schedule:</strong></td><td>{schedule}</td></tr>"

    html = f"""
    <html><body style="font-family:sans-serif;color:#333;">
      <h2>New Contact Form Submission</h2>
      <table cellpadding="6">
        <tr><td><strong>Name:</strong></td><td>{name}</td></tr>
        <tr><td><strong>Email:</strong></td><td><a href="mailto:{email}">{email}</a></td></tr>
        <tr><td><strong>Inquiry Type:</strong></td><td>{inquiry_type}</td></tr>
        {extra_html}
        <tr><td><strong>Subject:</strong></td><td>{subject}</td></tr>
      </table>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;">{message}</p>
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
