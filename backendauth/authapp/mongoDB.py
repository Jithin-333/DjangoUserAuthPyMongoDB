from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["auth_user"]
users_collection = db["users"]
