from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.cloudinary_config import init_cloudinary
from app.database import Base, engine
from app.routers import auth, blogs, books, gallery, media, site_content, stories


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_cloudinary()
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Obinna Udenwe Admin API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://([a-z0-9-]+\.)?obinna-udenwe[a-z0-9-]*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api/v1"
app.include_router(auth.router,         prefix=f"{PREFIX}/auth",         tags=["auth"])
app.include_router(books.router,        prefix=f"{PREFIX}/books",        tags=["books"])
app.include_router(blogs.router,        prefix=f"{PREFIX}/blogs",        tags=["blogs"])
app.include_router(stories.router,      prefix=f"{PREFIX}/stories",      tags=["stories"])
app.include_router(gallery.router,      prefix=f"{PREFIX}/gallery",      tags=["gallery"])
app.include_router(media.router,        prefix=f"{PREFIX}/media",        tags=["media"])
app.include_router(site_content.router, prefix=f"{PREFIX}/site-content", tags=["site-content"])


@app.get("/")
def root():
    return {"message": "Obinna Udenwe Admin API", "docs": "/docs"}
