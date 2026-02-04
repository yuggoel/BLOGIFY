# repositories/posts_supabase.py
"""
PostgreSQL/Supabase implementation of PostRepository
"""
from typing import Optional, List
from datetime import datetime
import asyncpg


class PostRepository:
    def __init__(self, pool: asyncpg.Pool):
        self._pool = pool

    async def create_post(
        self,
        title: str,
        content: str,
        user_id: str,
        tags: Optional[list] = None,
        image_url: Optional[str] = None
    ) -> dict:
        query = """
            INSERT INTO posts (title, content, user_id, tags, image_url, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING id, title, content, user_id, tags, image_url, created_at, updated_at
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(
                query, title, content, user_id, tags or [], image_url
            )
            return self._row_to_dict(row)

    async def get_post(self, post_id: str) -> Optional[dict]:
        query = """
            SELECT id, title, content, user_id, tags, image_url, created_at, updated_at
            FROM posts WHERE id = $1
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, post_id)
            if not row:
                return None
            return self._row_to_dict(row)

    async def list_posts(self, skip: int = 0, limit: int = 20) -> List[dict]:
        query = """
            SELECT id, title, content, user_id, tags, image_url, created_at, updated_at
            FROM posts
            ORDER BY created_at DESC
            OFFSET $1 LIMIT $2
        """
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(query, skip, limit)
            return [self._row_to_dict(row) for row in rows]

    async def update_post(
        self,
        post_id: str,
        title: Optional[str],
        content: Optional[str],
        tags: Optional[list],
        image_url: Optional[str] = None
    ) -> Optional[dict]:
        # Build dynamic update query
        updates = []
        values = []
        param_count = 1

        if title is not None:
            updates.append(f"title = ${param_count}")
            values.append(title)
            param_count += 1
        if content is not None:
            updates.append(f"content = ${param_count}")
            values.append(content)
            param_count += 1
        if tags is not None:
            updates.append(f"tags = ${param_count}")
            values.append(tags)
            param_count += 1
        if image_url is not None:
            updates.append(f"image_url = ${param_count}")
            values.append(image_url)
            param_count += 1

        if not updates:
            return await self.get_post(post_id)

        updates.append("updated_at = NOW()")
        values.append(post_id)

        query = f"""
            UPDATE posts SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING id, title, content, user_id, tags, image_url, created_at, updated_at
        """

        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, *values)
            if not row:
                return None
            return self._row_to_dict(row)

    async def delete_post(self, post_id: str) -> bool:
        query = "DELETE FROM posts WHERE id = $1"
        async with self._pool.acquire() as conn:
            result = await conn.execute(query, post_id)
            return result == "DELETE 1"

    async def count_posts(self) -> int:
        query = "SELECT COUNT(*) FROM posts"
        async with self._pool.acquire() as conn:
            return await conn.fetchval(query)

    @staticmethod
    def _row_to_dict(row: asyncpg.Record) -> dict:
        return {
            "id": str(row["id"]),
            "title": row["title"],
            "content": row["content"],
            "user_id": str(row["user_id"]) if row["user_id"] else None,
            "tags": list(row["tags"]) if row["tags"] else [],
            "image_url": row["image_url"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
