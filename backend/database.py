from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(
    os.getenv("MONGODB_URL"),
    tls=True,
    tlsAllowInvalidCertificates=False,  # Keep True only for testing
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=10000
)

try:
    # Test connection on startup
    client.admin.command('ping')
    print("MongoDB Atlas connected successfully!")
except Exception as e:
    print("Unable to connect to MongoDB Atlas:", e)

db = client[os.getenv("DB_NAME")]