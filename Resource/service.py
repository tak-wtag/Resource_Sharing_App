import fastapi 
from fastapi import HTTPException, Depends, status, Cookie
import fastapi.security 
from typing import Optional
from jose import jwt, JWTError
import datetime 
import passlib.hash 
import schemas
from schemas import Token, TokenData
from db import conn
import auth


SECRET_KEY = "5891150d329bf4e25694aead344664df52e3d68783cca99d6cbe54975b12d9ab"
ALGORITHM= "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300


# async def create_resource(user: schemas.User, resource: schemas.Resource ):
#     cursor = conn.cursor()
#     insert_q = "INSERT INTO resource(title, user_id) VALUES (%s, %s)"
#     cursor.execute(insert_q,(resource.title, user[0], ))
#     conn.commit()
#     return {"msg": "Resource created successfully"}

def get_token_data(token: str = Cookie('token', secure=True, httponly=True)) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return TokenData(id=str(payload.get("id")), name=str(payload.get("name")))
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (jwt.JWTError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(token_data: TokenData = Depends(get_token_data)) -> schemas.User:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (token_data.id,))
    user_data = cursor.fetchone()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data