import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from repositories.users import UserRepository

async def test_user_creation():
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        db = client['blog_db']
        repo = UserRepository(db)
        
        # Test creating a user
        print("Testing user creation...")
        user = await repo.create_user("Test User", "test@example.com", "password123")
        
        if user:
            print(f"User created successfully: {user}")
            
            # Test checking if email exists
            print("Testing email existence check...")
            existing_user = await repo.get_user_by_email("test@example.com")
            if existing_user:
                print(f"User found: {existing_user}")
            else:
                print("User not found")
                
            # Clean up - delete the test user
            print("Cleaning up test user...")
            user_id = user['id']
            success = await repo.delete_user(user_id)
            if success:
                print("Test user deleted successfully")
            else:
                print("Failed to delete test user")
        else:
            print("User creation returned None - email might already exist")
            
        # Close the connection
        client.close()
    except Exception as e:
        print(f"User creation test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_user_creation())