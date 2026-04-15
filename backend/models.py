from sqlalchemy import Column, Integer, String, Text
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String)
    summary = Column(Text)
    products_discussed = Column(String)
    sentiment = Column(String)
    next_action = Column(String)