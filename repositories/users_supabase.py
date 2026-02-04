# repositories/users_supabase.py
"""
PostgreSQL/Supabase implementation of UserRepository
"""
import bcrypt
from typing import Optional
import asyncpg


class UserRepository:
    def __init__(self, pool: asyncpg.Pool):
        self._pool = pool

    async def create_user(self, name: str, email: str, password: str) -> Optional[dict]:
        # Check if email already exists
        check_query = "SELECT id FROM users WHERE email = $1"
        async with self._pool.acquire() as conn:
            existing = await conn.fetchval(check_query, email)
            if existing:
                return None

            # Hash password with bcrypt
            password_hash = bcrypt.hashpw(
                password.encode("utf-8"), bcrypt.gensalt()
            ).decode("utf-8")

            insert_query = """
                INSERT INTO users (name, email, password_hash, created_at)
                VALUES ($1, $2, $3, NOW())
                RETURNING id, name, email, profile_picture_url, created_at
            """
            row = await conn.fetchrow(insert_query, name, email, password_hash)
            return self._row_to_dict(row)

    async def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )

    async def get_user_by_email(self, email: str) -> Optional[dict]:
        query = """
            SELECT id, name, email, password_hash, profile_picture_url, created_at
            FROM users WHERE email = $1
        """
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(query, email)
            if not row:
                return None
            # Return full data including password_hash for verification
            return {
                "_id": str(row["id"]),
                "name": row["name"],
                "email": row["email"],
                "password_hash": row["password_hash"],
                "profile_picture_url": row["profile_picture_url"],
                "created_at": row["created_at"],
            }

    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        query = """
            SELECT id, name, email, profile_picture_url, created_at
            FROM users WHERE id = $1
        """
        async with self._pool.acquire() as conn:
            try:
                row = await conn.fetchrow(query, user_id)
            except Exception:
                return None
            if not row:
                return None
            return self._row_to_dict(row)

    async def update_user(self, user_id: str, update_data: dict) -> Optional[dict]:
        # Filter out None values
        update_data = {k: v for k, v in update_data.items() if v is not None}

        if not update_data:
            return await self.get_user_by_id(user_id)

        # Build dynamic update query
        updates = []
        values = []
        param_count = 1

        for key, value in update_data.items():
            updates.append(f"{key} = ${param_count}")
            values.append(value)
            param_count += 1

        values.append(user_id)

        query = f"""
            UPDATE users SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING id, name, email, profile_picture_url, created_at
        """

        async with self._pool.acquire() as conn:
            try:
                row = await conn.fetchrow(query, *values)
            except Exception:
                return None
            if not row:
                return None
            return self._row_to_dict(row)

    async def delete_user(self, user_id: str) -> bool:
        query = "DELETE FROM users WHERE id = $1"
        async with self._pool.acquire() as conn:
            try:
                result = await conn.execute(query, user_id)
                return result == "DELETE 1"
            except Exception:
                return False

    async def count_users(self) -> int:
        query = "SELECT COUNT(*) FROM users"
        async with self._pool.acquire() as conn:
            return await conn.fetchval(query)

    @staticmethod
    def _row_to_dict(row: asyncpg.Record) -> dict:
        return {
            "id": str(row["id"]),
            "name": row["name"],
            "email": row["email"],
            "profile_picture_url": row["profile_picture_url"],
            "created_at": row["created_at"],
        }
