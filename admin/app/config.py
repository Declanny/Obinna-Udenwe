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
