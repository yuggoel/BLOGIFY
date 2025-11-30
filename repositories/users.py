import hashlib
import datetime
import bcrypt
from bson import ObjectId

class UserRepository:
    def __init__(self, db):
        self.db = db

    async def create_user(self, name: str, email: str, password: str):
        # Check if email already exists
        existing = await self.db.users.find_one({"email": email})
        if existing:
            return None
        
        # Hash password with bcrypt directly
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        created_at = datetime.datetime.utcnow()
        user_data = {
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "created_at": created_at
        }
        result = await self.db.users.insert_one(user_data)
        # ← FIXED: Include created_at in response
        return {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "created_at": created_at
        }

    async def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        # Verify password with bcrypt directly
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    async def get_user_by_email(self, email: str):
        return await self.db.users.find_one({"email": email})

    async def get_user_by_id(self, user_id: str):
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return None
        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "created_at": user.get("created_at")
        }

    async def delete_user(self, user_id: str):
        """Delete a user by ID"""
        if not ObjectId.is_valid(user_id):
            return False
        
        result = await self.db.users.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0