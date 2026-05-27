from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./admin.db"
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480  # 8 hours
    admin_username: str = "admin"
    admin_password_hash: str

    # Cloudinary
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str
    cloudinary_folder: str = "obinna-udenwe"

    # Email
    resend_api_key: str
    resend_from_email: str = "Obinna Udenwe <onboarding@resend.dev>"
    admin_email: str

    # Client
    client_url: str = "https://obinnaudenwe.com"

    model_config = {"env_file": ".env"}


settings = Settings()


def update_password_hash(new_hash: str) -> None:
    import re
    from pathlib import Path

    env_path = Path(__file__).parent.parent / ".env"
    content = env_path.read_text()
    content = re.sub(
        r"^ADMIN_PASSWORD_HASH=.*$",
        f"ADMIN_PASSWORD_HASH={new_hash}",
        content,
        flags=re.MULTILINE,
    )
    env_path.write_text(content)
    settings.admin_password_hash = new_hash
