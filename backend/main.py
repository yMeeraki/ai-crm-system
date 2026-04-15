from fastapi import FastAPI
from database import Base, engine, SessionLocal
from models import Interaction
from agent import app_graph
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.post("/chat-log")
def chat_log(data: dict):
    result = app_graph.invoke({"input": data["message"]})
    return result

@app.post("/log-interaction")
def log_interaction(data: dict):
    db = SessionLocal()
    interaction = Interaction(**data)
    db.add(interaction)
    db.commit()
    return {"message": "Saved"}

@app.get("/interactions")
def get_interactions():
    db = SessionLocal()
    return db.query(Interaction).all()


@app.get("/test")
def test():
    return {"message": "API working"}