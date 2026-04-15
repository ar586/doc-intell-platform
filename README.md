# Books RAG Platform

A full-stack web application that processes book data and enables intelligent querying using Retrieval-Augmented Generation (RAG).

## Features
- **Automated Book Collection**: Selenium-based web scraper that fetches books from the web.
- **AI Insights & RAG**: Context-aware Q&A and AI-generated insights (Summary, Genre) powered by Gemini API.
- **REST APIs**: Django DRF endpoints for document upload, retrieval, and intelligent querying.
- **Modern UI**: Next.js & Tailwind CSS for an aesthetic, responsive interface.
- **Vector DB integration**: In-memory Qdrant similarity search.

## Tech Stack
- **Backend:** Django Rest Framework, Python, SQLite
- **Vector Search:** Qdrant (Local In-Memory)
- **Frontend:** Next.js, React, Tailwind CSS
- **AI Integration:** Google Gemini
- **Automation:** Selenium WebDriver

## Setup Instructions

### Prerequisites
- Python 3.12+
- Node.js 18+

### Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. `source venv/bin/activate`
4. `pip install -r requirements.txt` (or manually install dependencies: `django djangorestframework qdrant-client google-generativeai selenium requests beautifulsoup4 pymysql django-cors-headers`)
5. Set `GEMINI_API_KEY` in environment variables: `export GEMINI_API_KEY=your_key`
6. `python manage.py makemigrations`
7. `python manage.py migrate`
8. `python manage.py runserver 8000`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Scraping Books Data
In another terminal instance, while your backend is running:
1. `cd backend`
2. `source venv/bin/activate`
3. `python scraper/scraper.py`

## API Documentation

### GET `/api/books/`
Lists all uploaded books. 

### GET `/api/books/<id>/`
Retrieves details for a specific book.

### GET `/api/books/<id>/recommend/`
Returns top 3 similar books based on description using Qdrant vector similarity.

### POST `/api/upload/`
Uploads a book and processes it by generating LLM insights. Also adds its chunks to Qdrant index.

### POST `/api/ask/`
**Payload Model:** `{"question": "some message"}`
Processes user input through the RAG pipeline generating context-aware answers.

## Sample Q&A from the System
**Q:** What is A Light in the Attic about?
**A:** Based on the description context, this book explores a variety of fun poems and stories for kids. *(Actual generation may vary based on Gemini inferences)*
