import gridfs
from pymongo import MongoClient, DESCENDING
from .config import settings

# Synchronous PyMongo client.
# The URI must include the database name, e.g.:
#   mongodb://localhost:27017/blogify
#   mongodb+srv://user:pass@cluster.mongodb.net/blogify
client: MongoClient = MongoClient(settings.mongodb_uri)

# get_default_database() reads the database name from the URI.
db = client.get_default_database()

posts_col = db["posts"]
users_col = db["users"]

# GridFS bucket for storing uploaded images.
fs = gridfs.GridFS(db)

# Ensure indexes for the most common query patterns.
posts_col.create_index([("created_at", DESCENDING)])
posts_col.create_index("user_id")
users_col.create_index("email", unique=True)
