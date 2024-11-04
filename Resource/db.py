import os
import psycopg2
from sqlalchemy import MetaData

conn = psycopg2.connect(host="localhost", database="crud_db", user="root", password="1234", port="5433")
meta = MetaData()
