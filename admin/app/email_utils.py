import asyncio
from typing import Optional

import resend

from app.config import settings


def _client() -> None:
    resend.api_key = settings.resend_api_key


async def send_otp_email(code: str) -> None:
    _client()
    await asyncio.to_thread(
        resend.Emails.send,
        {
            "from": settings.resend_from_email,
            "to": [settings.admin_email],
            "subject": "Admin Login Verification Code",
            "html": f"""
            <div style="font-family:sans-serif;color:#333;">
              <p>Your admin login verification code is:</p>
              <h2 style="letter-spacing:8px;font-size:32px;">{code}</h2>
              <p>This code expires in <strong>10 minutes</strong>.</p>
              <p style="color:#999;font-size:12px;">
                If you did not request this code, please ignore this email.
              </p>
            </div>
            """,
        },
    )


async def send_contact_notification(
    name: str,
    email: str,
    subject: str,
    message: str,
    inquiry_type: str,
    organization: Optional[str],
    schedule: Optional[str],
) -> None:
    _client()
    extra_rows = ""
    if organization:
        extra_rows += f"<tr><td><strong>Organization:</strong></td><td>{organization}</td></tr>"
    if schedule:
        extra_rows += f"<tr><td><strong>Schedule:</strong></td><td>{schedule}</td></tr>"

    await asyncio.to_thread(
        resend.Emails.send,
        {
            "from": settings.resend_from_email,
            "to": [settings.admin_email],
            "subject": f"New Contact Inquiry: {subject}",
            "html": f"""
            <div style="font-family:sans-serif;color:#333;">
              <h2>New Contact Form Submission</h2>
              <table cellpadding="6">
                <tr><td><strong>Name:</strong></td><td>{name}</td></tr>
                <tr><td><strong>Email:</strong></td><td><a href="mailto:{email}">{email}</a></td></tr>
                <tr><td><strong>Inquiry Type:</strong></td><td>{inquiry_type}</td></tr>
                {extra_rows}
                <tr><td><strong>Subject:</strong></td><td>{subject}</td></tr>
              </table>
              <p><strong>Message:</strong></p>
              <p style="white-space:pre-wrap;">{message}</p>
            </div>
            """,
        },
    )


async def send_new_subscriber_alert(name: str, email: str) -> None:
    _client()
    await asyncio.to_thread(
        resend.Emails.send,
        {
            "from": settings.resend_from_email,
            "to": [settings.admin_email],
            "subject": f"New Subscriber: {name}",
            "html": f"""
            <div style="font-family:sans-serif;color:#333;">
              <h2>New Newsletter Subscriber</h2>
              <table cellpadding="6">
                <tr><td><strong>Name:</strong></td><td>{name}</td></tr>
                <tr><td><strong>Email:</strong></td><td><a href="mailto:{email}">{email}</a></td></tr>
              </table>
            </div>
            """,
        },
    )


async def send_content_broadcast(
    subscribers: list,
    content_type: str,
    title: str,
    excerpt: str,
    cover_url: str,
    content_url: str,
) -> None:
    _client()
    cover_html = f'<img src="{cover_url}" style="width:100%;max-width:600px;margin-bottom:16px;" />' if cover_url else ""
    label = {"blog": "New Article", "story": "New Story", "book": "New Book"}.get(content_type, "New Content")

    async def _send_one(sub_name: str, sub_email: str) -> None:
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": settings.resend_from_email,
                "to": [sub_email],
                "subject": f"{label}: {title}",
                "html": f"""
                <div style="font-family:sans-serif;color:#333;max-width:600px;margin:auto;">
                  {cover_html}
                  <p style="color:#888;text-transform:uppercase;font-size:12px;letter-spacing:2px;">{label}</p>
                  <h2 style="margin:8px 0 12px;">{title}</h2>
                  <p style="line-height:1.6;">{excerpt}</p>
                  <a href="{content_url}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#b8960c;color:#fff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:1px;">
                    Read Now
                  </a>
                  <hr style="margin-top:40px;border:none;border-top:1px solid #eee;" />
                  <p style="color:#aaa;font-size:11px;">Hi {sub_name}, you're receiving this because you subscribed to updates from Obinna Udenwe.</p>
                </div>
                """,
            },
        )

    await asyncio.gather(*[_send_one(s.name, s.email) for s in subscribers], return_exceptions=True)
