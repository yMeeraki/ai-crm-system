import os
import json
import re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph
from typing import TypedDict

load_dotenv()

# LLM
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

# STATE
class AgentState(TypedDict):
    input: str
    hcp_name: str
    summary: str
    products_discussed: str
    sentiment: str
    next_action: str


# ---------- TOOLS (SEPARATE NODES) ----------

def extract_hcp(state):
    prompt = f"Extract ONLY doctor name from: {state['input']}"
    res = llm.invoke(prompt)
    state["hcp_name"] = res.content.strip()
    return state


def summarize(state):
    prompt = f"Summarize this interaction: {state['input']}"
    res = llm.invoke(prompt)
    state["summary"] = res.content.strip()
    return state


def extract_products(state):
    prompt = f"List products discussed: {state['input']}"
    res = llm.invoke(prompt)
    state["products_discussed"] = res.content.strip()
    return state


def sentiment(state):
    prompt = f"Give sentiment (Positive/Neutral/Negative): {state['input']}"
    res = llm.invoke(prompt)
    state["sentiment"] = res.content.strip()
    return state


def next_action(state):
    prompt = f"Suggest next sales action: {state['input']}"
    res = llm.invoke(prompt)
    state["next_action"] = res.content.strip()
    return state


# ---------- GRAPH ----------

graph = StateGraph(AgentState)

graph.add_node("hcp", extract_hcp)
graph.add_node("summary", summarize)
graph.add_node("products", extract_products)
graph.add_node("sentiment", sentiment)
graph.add_node("action", next_action)

# FLOW (multi-step agent)
graph.set_entry_point("hcp")
graph.add_edge("hcp", "summary")
graph.add_edge("summary", "products")
graph.add_edge("products", "sentiment")
graph.add_edge("sentiment", "action")

# COMPILE
app_graph = graph.compile()

print("Multi-tool agent loaded successfully")