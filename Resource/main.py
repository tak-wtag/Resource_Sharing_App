from fastapi import FastAPI, Depends, HTTPException,status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from model import users
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from db import conn
import auth 
import schemas
import service
import fastapi
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



app.include_router(auth.router)

@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: None):
    cursor = conn.cursor()
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication failed')
    conn.commit()
    return {"User": user}
# @app.post("/register")
# def register_user(user: schemas.User):
#     cursor = conn.cursor()
#     exist_q = "SELECT * from users WHERE email = %s"
#     cursor.execute(exist_q,(user.email, ))
#     existing_user = cursor.fetchone()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     encrypted_password =get_hashed_password(user.password)
#     conn.commit()
#     return {"message":"user created successfully"}

#conn.close()
@app.get("/user/me")
async def see_user(user: schemas.User = Depends(service.get_current_user)):
    return user

@app.post("/resource")
async def create_resource(
    resource: schemas.ResourceCreate,
    user: schemas.User = Depends(service.get_current_user)
):
    cursor = conn.cursor()
    insert_q = "INSERT INTO resource(title, user_id) VALUES (%s, %s)"
    resource = cursor.execute(insert_q,(resource.title, user[0], ))
    conn.commit()
    return {"msg": "Resource created successfully"}