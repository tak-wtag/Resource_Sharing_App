from sqlalchemy import Table,Column, Integer, String, ForeignKey, TIMESTAMP, func
from db import meta

users = Table(
    'users',meta,
    Column('id', Integer, primary_key = True, index = True),
    Column('name', String(255)),
    Column('email', String(255)),
    Column('password', String)
)

resource = Table(
    'resource',meta,
    Column('id', Integer, primary_key=True),
    Column('title', String(255)),
    Column('user_id', Integer, ForeignKey("user.id"), nullable=False),
    Column('created_at', TIMESTAMP,default=func.now(), nullable=False)
)

resource_details = Table(
    "resource_details",meta,
    Column('id', Integer, primary_key=True),
    Column('user_id', Integer, ForeignKey("user.id"), nullable=False),
    Column('link', String),
    Column('created_at', TIMESTAMP,default=func.now(), nullable=False)
)