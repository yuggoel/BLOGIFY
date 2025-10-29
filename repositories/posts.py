# app/repositories/posts.py
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase

# Helper: convert Mongo document to dict with string id
def _doc_to_post(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "content": doc["content"],
        "tags": doc.get("tags", []),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }


class PostRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self._coll = db.get_collection("posts")

    async def create_post(self, title: str, content: str, tags: Optional[list] = None) -> dict:
        now = datetime.utcnow()
        doc = {
            "title": title,
            "content": content,
            "tags": tags or [],
            "created_at": now,
            "updated_at": None,
        }
        result = await self._coll.insert_one(doc)
        doc["_id"] = result.inserted_id
        return _doc_to_post(doc)

    async def get_post(self, post_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(post_id):
            return None
        doc = await self._coll.find_one({"_id": ObjectId(post_id)})
        if not doc:
            return None
        return _doc_to_post(doc)

    async def list_posts(self, skip: int = 0, limit: int = 20) -> List[dict]:
        cursor = self._coll.find().sort("created_at", -1).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [_doc_to_post(d) for d in docs]

    async def update_post(self, post_id: str, title: Optional[str], content: Optional[str], tags: Optional[list]) -> Optional[dict]:
        if not ObjectId.is_valid(post_id):
            return None
        update_fields = {}
        if title is not None:
            update_fields["title"] = title
        if content is not None:
            update_fields["content"] = content
        if tags is not None:
            update_fields["tags"] = tags
        if not update_fields:
            # nothing to update
            return await self.get_post(post_id)

        update_fields["updated_at"] = datetime.utcnow()
        result = await self._coll.find_one_and_update(
            {"_id": ObjectId(post_id)},
            {"$set": update_fields},
            return_document=True  # returns the updated doc
        )
        if not result:
            return None
        return _doc_to_post(result)

    async def delete_post(self, post_id: str) -> bool:
        if not ObjectId.is_valid(post_id):
            return False
        result = await self._coll.delete_one({"_id": ObjectId(post_id)})
        return result.deleted_count == 1
