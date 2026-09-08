from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_DO_BANCO = "postgresql://postgres:1234@localhost:5432/delivery_db"

engine = create_engine(URL_DO_BANCO)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()