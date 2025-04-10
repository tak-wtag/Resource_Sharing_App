from datetime import datetime, timedelta,timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response, Request, Cookie
from pydantic import BaseModel
from sqlalchemy import MetaData
from starlette import status
from db import conn
from model import users
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from hash import async_hash_password, verify_password
from schemas import User, Token, Resource, Resource_details, TokenData
import json
from sqlalchemy.exc import NoResultFound
from fastapi.middleware.cors import CORSMiddleware
from db import redis_client


router = APIRouter(
    prefix='/auth',
    tags=['auth']
)



SECRET_KEY = "5891150d329bf4e25694aead344664df52e3d68783cca99d6cbe54975b12d9ab"
ALGORITHM= "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

def hash_password(password: str) -> str:
    return async_hash_password(password)


def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {**data, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
# oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

@router.on_event("startup")
def create_table():
    cursor = conn.cursor()
    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR NOT NULL
    )
    """
    cursor.execute(create_table_query)
    create_table_query = """
    CREATE TABLE IF NOT EXISTS resource (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT fk_resource_users FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """
    cursor.execute(create_table_query)
    create_table_query = """
    CREATE TABLE IF NOT EXISTS resource_details (
        id SERIAL PRIMARY KEY,
        resource_id INT NOT NULL,
        link VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT fk_resource_details_users FOREIGN KEY(resource_id) REFERENCES resource(id)
        ON DELETE CASCADE
    )
    """
    cursor.execute(create_table_query)

@router.post("/register")
def register(user: User):
    cursor = conn.cursor()
    exist_q = "SELECT * from users WHERE email = %s"
    cursor.execute(exist_q,(user.email, ))
    existing_user = cursor.fetchone()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user.password)
    insert_q = "INSERT INTO users(name, email, password) VALUES (%s, %s, %s)"
    cursor.execute(insert_q,(user.name, user.email, hashed_password))
    conn.commit()
    return {'msg': 'user created successfully'}
@router.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
    access_token = create_access_token(data={"id": user[0], "name": user[1]})
    return { "access_token": access_token, "type": "bearer"}


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    try:
        user = authenticate_user(form_data.username, form_data.password)
        access_token = create_access_token(data={"id": user[0], "name": user[1]})
        response_content = {"id": user[0], "name": user[1]}
        response = Response(
            content=json.dumps(response_content), media_type="application/json"
        )
        response.set_cookie(
            key="token",
            value=access_token,
            httponly=True,
            max_age=1800,
            samesite="None",
            secure=True,
        )
        return response

    except NoResultFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log in: {str(e)}",
        )

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out successfully"}


def authenticate_user(name : str, password: str):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
    user = cursor.fetchone()
    if not user:
        return False
    if not verify_password(password, user[3]):
        return False
    conn.commit()
    return user

@router.get("/users/")
async def read():
    cursor = conn.cursor()
    select_q = "SELECT * from users"
    cursor.execute(select_q, )
    user = cursor.fetchall()
    conn.commit()
    #cursor.close()
    if user:
        return user
    else:
        return {"msg": "Data not available"}
@router.get("/resource/all")
def read_all_resource():
    cursor = conn.cursor()
    select_q = "SELECT * from resource "
    cursor.execute(select_q, )
    resource = cursor.fetchall()
    conn.commit()
    if resource:
        resource_list = [
            {"id": res[0], "title": res[1], "user_id": res[2], "created_at": res[3]} for res in resource
        ]
        return resource_list
    else:
        return {"msg": "Data not available"}

def get_resource_from_db(resource_id):
    """Fetch user details from PostgreSQL."""
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM resource WHERE id = {resource_id};")
    resource = cur.fetchone()
    return resource

@router.get("/resource/{resource_id}")
def get_resource(resource_id):
    """Fetch user details from Redis cache or PostgreSQL."""
    # Check if the user is in Redis cache
    cache_key = f"resource:{resource_id}"
    cached_resource = redis_client.get(cache_key)
    
    if cached_resource:
        print("Fetching from Redis Cache...")
        return json.loads(cached_resource)
    else:
        # If not in cache, fetch from PostgreSQL and cache the result
        print("Fetching from PostgreSQL...")
        resource = get_resource_from_db(resource_id)
        if resource:
            resource_list = {"id":resource[0] , "title": resource[1], "user_id": resource[2]}
            redis_client.setex(cache_key, 600, json.dumps(resource_list))
        return resource 

@router.get("/resource_details")
def read_all_resource_details():
    cursor = conn.cursor()
    select_q = "SELECT * from resource_details"
    cursor.execute(select_q,)
    resource = cursor.fetchall()
    conn.commit()
    if resource:
        resource_list = [
            {"id": res[0], "resource_id": res[1], "link": res[2], "created_at": res[3]} for res in resource
        ]
        return resource_list
    else:
        return {"msg": "Data not available"}
    
def get_resource_details_from_db(resource_id):
    """Fetch user details from PostgreSQL."""
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM resource_details WHERE id = {resource_id};")
    resource = cur.fetchone()
    return resource

@router.get("/resource_details/{resource_id}")
def get_resource_details(resource_id):
    """Fetch user details from Redis cache or PostgreSQL."""
    # Check if the user is in Redis cache
    cache_key = f"resource_details:{resource_id}"
    cached_resource = redis_client.get(cache_key)
    
    if cached_resource:
        print("Fetching from Redis Cache...")
        return json.loads(cached_resource)
    else:
        # If not in cache, fetch from PostgreSQL and cache the result
        print("Fetching from PostgreSQL...")
        resource = get_resource_details_from_db(resource_id)
        if resource:
            resource_list = {"id":resource[0] , "resource_id": resource[1], "link": resource[2]}
            redis_client.setex(cache_key, 600, json.dumps(resource_list))
        return resource  