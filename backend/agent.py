import os
import json
import re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

def extract_interaction(state):
    user_input = state["input"]

    prompt = f"""
    You are an API. Return ONLY valid JSON.

    Extract structured data from:
    {user_input}

    {{
      "hcp_name": "",
      "summary": "",
      "products_discussed": "",
      "sentiment": "",
      "next_action": ""
    }}
    """

    try:
        response = llm.invoke(prompt)
        text = response.content

        print("RAW:", text)

        json_match = re.search(r'\{.*\}', text, re.DOTALL)

        if json_match:
            parsed = json.loads(json_match.group())
            return {"output": parsed}
        else:
            return {"output": "Invalid JSON"}

    except Exception as e:
        print("ERROR:", str(e))
        return {"output": str(e)}


graph = StateGraph(dict)
graph.add_node("extract", extract_interaction)
graph.set_entry_point("extract")

app_graph = graph.compile()

print("Agent loaded successfully")