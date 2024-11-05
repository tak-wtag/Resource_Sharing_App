import fastapi 
from fastapi import HTTPException, Depends, status
import fastapi.security 
from typing import Optional
from jose import jwt, JWTError
import datetime 
import passlib.hash 
import schemas
from schemas import Token, TokenData
from db import conn
import auth
from auth import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, verify_token

oauth2schema = fastapi.security.OAuth2PasswordBearer(tokenUrl="auth/token")

async def create_resource(user: schemas.User, resource: schemas.Resource ):
    cursor = conn.cursor()
    insert_q = "INSERT INTO resource(title, user_id) VALUES (%s, %s)"
    cursor.execute(insert_q,(resource.title, user.id, ))
    conn.commit()
    return {"msg": "Resource created successfully"}

async def get_current_user(
    token: str = fastapi.Depends(oauth2schema),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token=token)
        username: str = payload.get("sub")
    except JWTError:
        raise credentials_exception
    cursor = conn.cursor()
    select_q = "SELECT * from users where name=%s"
    cursor.execute(select_q, (username) )
    user = cursor.fetchall() 
    if user is None:
        raise credentials_exception
    return user
