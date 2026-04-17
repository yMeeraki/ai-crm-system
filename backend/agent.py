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
You are a CRM AI assistant for pharmaceutical sales.

Extract structured information from the text.

Return ONLY valid JSON:

{{
  "hcp_name": "",
  "summary": "",
  "products_discussed": "",
  "sentiment": "Positive | Neutral | Negative",
  "next_action": ""
}}

STRICT RULES:

1. hcp_name:
- MUST extract doctor name starting with "Dr"
- Example: "Dr Sharma", "Dr Mehta"
- If not found → "Unknown Doctor"

2. summary:
- 1 short professional sentence

3. products_discussed:
- Extract actual product names (like insulin, antibiotics, diabetes drugs)
- NEVER return "Not specified" if product exists
- If multiple → comma separated

4. sentiment:
- Positive → interest / excited / wants details
- Neutral → normal discussion
- Negative → rejection / not interested
- ONLY one word

5. next_action:
- MUST ALWAYS be generated
- Short (2–5 words)
- Examples:
  - "Schedule follow-up"
  - "Send pricing details"
  - "Provide samples"

6. DO NOT leave ANY field empty

Text:
{text}
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