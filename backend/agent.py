import os, json, re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

# -------- NORMAL EXTRACTION --------
def extract_all(state):
    text = state["input"]

    prompt = f"""
    Extract CRM data. Return JSON:
    {{
      "hcp_name":"",
      "summary":"",
      "products_discussed":"",
      "sentiment":"",
      "next_action":""
    }}
    Text: {text}
    """

    res = llm.invoke(prompt)
    match = re.search(r"\{.*\}", res.content, re.DOTALL)
    parsed = json.loads(match.group()) if match else {}

    return {"output": parsed}


# -------- EDIT MODE --------
def edit_fields(state):
    text = state["input"]

    prompt = f"""
    Modify ONLY requested fields. Return JSON:
    {{
      "hcp_name": null,
      "summary": null,
      "products_discussed": null,
      "sentiment": null,
      "next_action": null
    }}

    Command: {text}
    """

    res = llm.invoke(prompt)
    match = re.search(r"\{.*\}", res.content, re.DOTALL)
    parsed = json.loads(match.group()) if match else {}

    return {"output": parsed}


# -------- ROUTER --------
def route(state):
    t = state["input"].lower()
    if "change" in t or "update" in t or "edit" in t:
        return "edit"
    return "extract"


# -------- VALIDATE --------
def validate(state):
    data = state.get("output", {})

    state["output"] = {
        "hcp_name": data.get("hcp_name"),
        "summary": data.get("summary"),
        "products_discussed": data.get("products_discussed"),
        "sentiment": data.get("sentiment"),
        "next_action": data.get("next_action"),
    }

    state["message"] = "Done"
    return state


# -------- GRAPH --------
graph = StateGraph(dict)

graph.add_node("extract", extract_all)
graph.add_node("edit", edit_fields)
graph.add_node("validate", validate)

graph.set_conditional_entry_point(route)
graph.add_edge("extract", "validate")
graph.add_edge("edit", "validate")

app_graph = graph.compile()