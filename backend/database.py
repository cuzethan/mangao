import os
import psycopg2 as pg
from dotenv import load_dotenv

load_dotenv()

HOSTNAME = os.getenv("HOST")
DATABASE = os.getenv("DB_NAME")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
PORT = os.getenv("PORT")

pg.connect(
    host=HOSTNAME,
    user=USERNAME,
    password=PASSWORD,
    dbname=DATABASE,
    port=PORT
)
