import os
from datetime import datetime, timedelta

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/streamx")
DATABASE_NAME = os.getenv("DATABASE_NAME", "streamx")
JWT_SECRET = os.getenv("JWT_SECRET", "replace_this_with_a_long_random_secret")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
users_collection = db["users"]

app = FastAPI(title="STREAMX API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def create_token(user_id: str, role: str) -> str:
    payload = {
        "id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@app.get("/")
def root():
    return {
        "message": "STREAMX Backend is running successfully!",
        "api": "/api/auth",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "backend": "STREAMX Backend",
        "port": PORT,
        "database": MONGO_URI,
    }


@app.post("/api/auth/register")
def register(payload: RegisterRequest):
    name = payload.name.strip()
    email = payload.email.lower().strip()
    password = payload.password

    if not name or not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, email and password are required",
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters",
        )

    if users_collection.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    result = users_collection.insert_one(
        {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "user",
        }
    )

    token = create_token(str(result.inserted_id), "user")

    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "role": "user",
        },
    }


@app.post("/api/auth/login")
def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    password = payload.password

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required",
        )

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    is_valid = bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8"))
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_token(str(user["_id"]), user.get("role", "user"))

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user.get("role", "user"),
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
