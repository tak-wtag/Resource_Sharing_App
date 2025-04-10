import os
import psycopg2
from sqlalchemy import MetaData
from redis.asyncio import client
import redis

redis_server = os.getenv('REDIS_SERVER', 'redis')
redis_port = int(os.getenv('REDIS_PORT', 6379))  
redis_db = int(os.getenv('REDIS_DB', 0))        

conn = psycopg2.connect(host=os.environ.get('DB_HOST'), database=os.environ.get('DB_NAME'), user=os.environ.get('DB_USER'), password=os.environ.get('DB_PASSWORD'), port=os.environ.get('DB_PORT'))
meta = MetaData()

redis_client = redis.Redis(host=redis_server, port=redis_port, db=redis_db)