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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow all origins, replace with specific front-end URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/resource_details")
async def create_resource_details(
    resource_details: schemas.ResourceDetailsCreate,
    user: schemas.User = Depends(service.get_current_user)
):
    cursor = conn.cursor()
    select_q = "SELECT * FROM resource where id=%s and user_id=%s"
    cursor.execute(select_q,( resource_details.resource_id, user[0], ))
    resource_data = cursor.fetchone()
    if resource_data:
        insert_q = "INSERT INTO resource_details(resource_id, link) VALUES (%s, %s)"
        resource = cursor.execute(insert_q,(resource_details.resource_id, resource_details.link, ))
        conn.commit()
        return {"msg": "Resource created successfully"}
    else:
        return {"msg": "You are not permitted"}
    
@app.put("/update_resource/{id}")
async def update_resource(
    id: int,
    resource: schemas.ResourceCreate,
    user: schemas.User = Depends(service.get_current_user)
):
    cursor = conn.cursor()
    select_q = "SELECT * FROM resource where id=%s and user_id=%s"
    cursor.execute(select_q,( id, user[0], ))
    resource_data = cursor.fetchone()
    if resource_data:
        insert_q = "UPDATE resource SET title = %s, user_id = %s where id=%s"
        resource = cursor.execute(insert_q,(resource.title, user[0], id,  ))
        conn.commit()
        return {"msg": "Resource updated successfully"}
    else:
        return {"msg": "You are not permitted"}

@app.put("/update_resource_details/{id}")
async def update_resource(
    id: int,
    resource_details: schemas.ResourceDetailsCreate,
    user: schemas.User = Depends(service.get_current_user)
):
    cursor = conn.cursor()
    select_q = "SELECT * FROM resource where id=%s and user_id=%s"
    cursor.execute(select_q,( resource_details.resource_id, user[0], ))
    resource_data = cursor.fetchone()
    if resource_data:
        insert_q = "UPDATE resource_details SET resource_id = %s, link = %s where id=%s"
        resource = cursor.execute(insert_q,(resource_details.resource_id, resource_details.link, id,  ))
        conn.commit()
        return {"msg": "Resource Details updated successfully"}
    else:
        return {"msg": "You are not permitted"}

@app.delete("/delete_resource/{id}")
def delete(id: int, user: schemas.User = Depends(service.get_current_user)):
    cursor = conn.cursor()
    select_q = "SELECT * FROM resource where id=%s and user_id=%s"
    cursor.execute(select_q,( id, user[0], ))
    resource_data = cursor.fetchone()
    if resource_data:
        delete_q = "DELETE FROM resource WHERE id = %s"
        resource = cursor.execute(delete_q,(id,  ))
        conn.commit()
        return {"msg": "Resource deleted successfully"}
    else:
        return {"msg": "You are not permitted"}

@app.delete("/delete_resource_details/{id}")
def delete(id: int, user: schemas.User = Depends(service.get_current_user)):
    cursor = conn.cursor()
    select_q = "SELECT * FROM resource_details where id=%s"
    cursor.execute(select_q,( id, ))
    resource_data = cursor.fetchone()
    if resource_data:
        selectr_q = "SELECT * FROM resource where id=%s and user_id=%s"
        cursor.execute(selectr_q,( resource_data[1],user[0] ))
        resource_data_details = cursor.fetchone()
        if resource_data_details:
            delete_q = "DELETE FROM resource_details WHERE id = %s"
            resource = cursor.execute(delete_q,(id,  ))
            conn.commit()
            return {"msg": "Resource deleted successfully"}
        else:
            return {"msg": "You are not permitted"}
    else:
            return {"msg": "Resource not found"}
# @app.post("/resource_details")
# async def create_resource_details(
#     resource_details: schemas.ResourceDetailsCreate,
#     user: schemas.User = Depends(service.get_current_user)
# ):
#     cursor = conn.cursor()
#     select_q = "SELECT * FROM resource where id=%s and user_id=%s"
#     cursor.execute(select_q,( resource_details.resource_id, user[0], ))
#     resource_data = cursor.fetchone()
#     if resource_data:
#         insert_q = "INSERT INTO resource_details(resource_id, link) VALUES (%s, %s)"
#         resource = cursor.execute(insert_q,(resource_details.resource_id, resource_details.link, ))
#         conn.commit()
#         return {"msg": "Resource created successfully"}
#     else:
#         return {"msg": "You are not permitted"}
    

# @user.put("/user{id}")
# def update(id: int, user: User):
#     cursor = conn.cursor()
#     update_q = "UPDATE users SET name = %s, email = %s, password = %s WHERE id = %s"
#     cursor.execute(update_q, (user.name, user.email, user.password, id))
#     conn.commit()
#     #cursor.close()
#     return {"msg": "Values updated"}

