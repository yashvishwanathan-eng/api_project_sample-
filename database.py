from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

engine = create_engine(db_URL)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
