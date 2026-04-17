from fastapi import FastAPI
from database import Base, engine, SessionLocal
from models import Interaction
from agent import app_graph
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat-log")
def chat_log(data: dict):
    result = app_graph.invoke({"input": data["message"]})
    return {
        "ai_output": result.get("output", {}),
        "message": result.get("message", "")
    }

@app.post("/log-interaction")
def log_interaction(data: dict):
    db = SessionLocal()
    interaction = Interaction(**data)
    db.add(interaction)
    db.commit()
    db.close()
    return {"message": "Saved"}

@app.get("/interactions")
def get_all():
    db = SessionLocal()
    data = db.query(Interaction).all()
    db.close()
    return data

@app.delete("/delete-interaction/{id}")
def delete(id: int):
    db = SessionLocal()
    obj = db.query(Interaction).filter(Interaction.id == id).first()
    db.delete(obj)
    db.commit()
    db.close()
    return {"message": "Deleted"}

@app.get("/search")
def search(q: str):
    db = SessionLocal()
    data = db.query(Interaction).filter(
        or_(
            Interaction.hcp_name.ilike(f"%{q}%"),
            Interaction.products_discussed.ilike(f"%{q}%")
        )
    ).all()
    db.close()
    return data

@app.put("/edit-interaction/{id}")
def edit_interaction(id: int, data: dict):
    db = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(Interaction.id == id).first()

        if not interaction:
            return {"error": "Interaction not found"}

        for key, value in data.items():
            if hasattr(interaction, key):
                setattr(interaction, key, value)

        db.commit()
        db.refresh(interaction)   # ✅ ADD THIS

        return {"message": "Updated successfully"}
    finally:
        db.close()