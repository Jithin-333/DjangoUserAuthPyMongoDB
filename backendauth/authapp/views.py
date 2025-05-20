from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .mongoDB import users_collection
from bson.json_util import dumps
import bcrypt
#jwtauth
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from django.conf import settings

from bson.objectid import ObjectId
from bson.errors import InvalidId


# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        serializer  =  UserSerializer(data = data)
        
        if serializer.is_valid():
            if users_collection.find_one({"email": data["email"]}):
                return Response({"error": "Email is already Registerd"}, status=400)
            
            if users_collection.find_one({"username": data["username"]}):
                return Response({"error": "username is already Registerd! Try another name."}, status=400)
            
            hashed_pw = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
            users_collection.insert_one({
                "username": data["username"],
                "email": data["email"],
                "password": hashed_pw,
                "admin_user": False,

            })
            return Response({"message": "User Registerd Successfully"}, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        user = users_collection.find_one({"email": email})
        if not user:
            return Response({"error": "Email not Found, Please Register First"},status=404)
        
        if not bcrypt.checkpw(password.encode(), user["password"]):
            return Response({"error": "Invalid password"}, status=401)
        
        refresh = RefreshToken()
        refresh["user_id"] = str(user["_id"])
        refresh["email"] = user["email"]

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "admin_user": user.get("admin_user", False)
        })
    
class UserView(APIView):
    def get(self, request):
        users = list(users_collection.find({}, {"password": 0}))
        for user in users:
            user["_id"] = str(user["_id"])  
        return Response(users, status=200)
    
    def post(self, request):
        return RegisterView().post(request)
    


class UserDetailView(APIView):
    def put(self, request, username):
        data = request.data
        update_data = {}

        if "username" in data:
            update_data["username"] = data["username"]
        if "email" in data:
            update_data["email"] = data["email"]
        if "password" in data:
            update_data["password"] = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

        users_collection.update_one({"username": username}, {"$set": update_data})
        return Response({"message": "User updated"}, status=200)

    def delete(self, request, username):
        users_collection.delete_one({"username": username})
        return Response({"message": "User deleted"}, status=204)


class AdminUserDetailView(APIView):
    def put(self, request, user_id):
        try:
            user_object_id = ObjectId(user_id)
        except InvalidId:
            return Response({"error": "Invalid user ID"}, status=400)

        data = request.data
        update_data = {}

        if "username" in data:
            update_data["username"] = data["username"]
        if "email" in data:
            update_data["email"] = data["email"]
        if "admin_user" in data:
            update_data["admin_user"] = data["admin_user"]

        result = users_collection.update_one(
            {"_id": user_object_id}, {"$set": update_data}
        )

        if result.matched_count == 0:
            return Response({"error": "User not found"}, status=404)

        return Response({"message": "User updated"}, status=200)


class AdminUserDeleteView(APIView):
    def delete(self, request, user_id):
        try:
            user_object_id = ObjectId(user_id)
        except InvalidId:
            return Response({"error": "Invalid user ID"}, status=400)

        result = users_collection.delete_one({"_id": user_object_id})
        if result.deleted_count == 0:
            return Response({"error": "User not found"}, status=404)

        return Response({"message": "User deleted"}, status=204)