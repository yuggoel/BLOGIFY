import io

import gridfs
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse

from ..auth import get_current_user_id
from ..config import settings
from ..database import db, fs

router = APIRouter(tags=["upload"])

# Allowed MIME types for uploads
_ALLOWED = {"image/jpeg", "image/png", "image/gif", "image/webp"}


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    _: str = Depends(get_current_user_id),
):
    """
    Upload an image. Requires authentication.
    Returns an absolute URL pointing to GET /images/{file_id}.
    """
    if file.content_type not in _ALLOWED:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, GIF, WEBP",
        )

    data = await file.read()
    file_id = fs.put(data, filename=file.filename, content_type=file.content_type)
    url = f"{settings.api_base_url}/images/{file_id}"
    return {"url": url}


@router.get("/images/{file_id}")
def get_image(file_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Serve an image stored in MongoDB GridFS."""
    try:
        oid = ObjectId(file_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    try:
        grid_out = fs.get(oid)
    except gridfs.errors.NoFile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    return StreamingResponse(
        io.BytesIO(grid_out.read()),
        media_type=grid_out.content_type or "application/octet-stream",
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
