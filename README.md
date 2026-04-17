# AI-First CRM HCP Module – Log Interaction Screen

## Overview

This project is an AI-first Customer Relationship Management (CRM) system designed for Healthcare Professional (HCP) interaction tracking. It enables field representatives to log interactions using either a structured form or a conversational chat interface powered by AI.

The system leverages LangGraph and Large Language Models (LLMs) to automate data extraction, summarization, and decision support, reducing manual effort and improving data quality.

---

## Key Features

- Chat-based interaction logging (AI-powered)
- Structured form-based data entry
- Auto-fill form using AI
- AI-generated next best action
- Edit and update interactions
- Delete with confirmation
- Real-time search functionality
- Toast notifications for actions
- Clean dashboard UI

---

## Tech Stack

### Frontend

- React.js
- Redux Toolkit (State Management)
- Axios
- Simple CSS UI

### Backend

- FastAPI (Python)
- SQLAlchemy ORM
- MySQL / PostgreSQL

### AI Layer

- LangGraph (Agent Framework)
- Groq LLM
  - llama-3.3-70b-versatile
  - gemma2-9b-it (recommended)

---

## System Architecture

User (React UI)
↓
Redux (State Management)
↓
FastAPI Backend
↓
LangGraph Agent
↓
Groq LLM
↓
Database (MySQL/Postgres)

---

## LangGraph Agent Role

The LangGraph agent acts as an intelligent orchestration layer that processes unstructured user input and converts it into structured CRM data.

It performs:

- Entity extraction (HCP name, products)
- Summarization
- Sentiment analysis
- Next action recommendation

This enables an AI-first workflow where users can log interactions through natural language instead of manual data entry.

---

## LangGraph Tools

### 1. Log Interaction Tool

- Converts chat input into structured data
- Extracts:
  - HCP Name
  - Summary
  - Products Discussed
  - Sentiment
  - Next Action

---

### 2. Edit Interaction Tool

- Allows modification of saved interactions
- Ensures flexibility and data correction
- Updates database records

---

### 3. Summarization Tool

- Converts raw interaction into concise summary
- Helps maintain consistent reporting

---

### 4. Sentiment Analysis Tool

- Classifies interaction sentiment:
  - Positive
  - Neutral
  - Negative

- Helps in sales strategy

---

### 5. Next Best Action Tool

- Suggests follow-up actions
- Examples:
  - Schedule meeting
  - Share samples
  - Send product details

---

## LangGraph Flow

Input (User Chat)
→ Extract HCP
→ Generate Summary
→ Extract Products
→ Analyze Sentiment
→ Suggest Next Action

---

## API Endpoints

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | /chat-log                | AI-based interaction processing |
| POST   | /log-interaction         | Save interaction                |
| GET    | /interactions            | Fetch all interactions          |
| PUT    | /edit-interaction/{id}   | Update interaction              |
| DELETE | /delete-interaction/{id} | Delete interaction              |
| GET    | /search                  | Search interactions             |
| POST   | /suggest-next-action     | AI suggestion                   |

---

## Setup Instructions

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Create `.env` file:

```
GROQ_API_KEY=your_api_key
```

Run server:

```bash
uvicorn main:app --reload
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```
REACT_APP_API_URL=http://127.0.0.1:8000
```

Run:

```bash
npm start
```

---

## Application Flow

1. User enters interaction via chat
2. LangGraph agent processes input
3. AI extracts structured data
4. Form auto-fills
5. Next action is auto-generated
6. User saves interaction
7. Data stored in database
8. Dashboard updates in real-time

---

## Demo Usage

- Enter chat:
  "Met Dr Sharma, discussed insulin, positive response"
- Click "Log with AI"
- Form auto-fills
- Next action generated
- Click "Save"
- Data appears in table

---

## What I Learned

- Building AI-first applications using LangGraph
- Integrating LLMs into real-world workflows
- Designing CRM systems for healthcare use cases
- Managing full-stack architecture (React + FastAPI)
- Improving UX with AI automation

---

## Future Improvements

- Role-based access (Admin / Sales Rep)
- Advanced analytics dashboard
- Pagination and filters
- Export reports (CSV/PDF)
- AI-powered recommendations history

---

## Author

Yukti Gupta

---

## Submission Notes

This project fulfills the assignment requirements by:

- Using LangGraph as the AI agent framework
- Implementing 5 AI tools
- Providing both chat and form-based logging
- Demonstrating full CRUD operations
- Integrating LLM for intelligent automation

---
