import os
import psycopg2
from sqlalchemy import MetaData

conn = psycopg2.connect(host=os.environ.get('DB_HOST'), database=os.environ.get('DB_NAME'), user=os.environ.get('DB_USER'), password=os.environ.get('DB_PASSWORD'), port=os.environ.get('DB_PORT'))
meta = MetaData()