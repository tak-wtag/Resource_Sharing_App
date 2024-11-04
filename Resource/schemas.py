from pydantic import BaseModel
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    name: str
    email: str
    password: str

class Resource(BaseModel):
    title: str
    user_id: int

class Resource_details(BaseModel):
    resource_id: int
    link: str