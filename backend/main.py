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
    db = SessionLocal()

    result = app_graph.invoke({"input": data["message"]})

    ai_data = {
        "hcp_name": result.get("hcp_name"),
        "summary": result.get("summary"),
        "products_discussed": result.get("products_discussed"),
        "sentiment": result.get("sentiment"),
        "next_action": result.get("next_action"),
    }

    interaction = Interaction(**ai_data)

    db.add(interaction)
    db.commit()

    return {
        "ai_output": ai_data,
        "message": "Saved successfully"
    }

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

@app.put("/edit-interaction/{id}")
def edit_interaction(id: int, data: dict):
    db = SessionLocal()

    interaction = db.query(Interaction).filter(Interaction.id == id).first()

    if not interaction:
        return {"error": "Interaction not found"}

    for key, value in data.items():
        setattr(interaction, key, value)

    db.commit()
    db.close()

    return {"message": "Updated successfully"}

@app.get("/search")
def search_interaction(query: str):
    db = SessionLocal()

    results = db.query(Interaction).filter(
        Interaction.hcp_name.contains(query) |
        Interaction.products_discussed.contains(query)
    ).all()

    db.close()
    return results

@app.post("/suggest-next-action")
def suggest_next_action(data: dict):
    prompt = f"Suggest next action for this interaction: {data['summary']}"
    result = app_graph.invoke({"input": prompt})
    return result

@app.delete("/delete-interaction/{id}")
def delete_interaction(id: int):
    db = SessionLocal()

    interaction = db.query(Interaction).filter(Interaction.id == id).first()

    if not interaction:
        return {"error": "Not found"}

    db.delete(interaction)
    db.commit()
    db.close()

    return {"message": "Deleted successfully"}