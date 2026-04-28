from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
db_URL = "postgresql://postgres:Harini18@localhost:5432/fastapi_demo"
engine = create_engine(db_URL)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)