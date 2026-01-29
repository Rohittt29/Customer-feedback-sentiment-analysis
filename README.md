# Customer Feedback Analysis System

A full-stack application designed to analyze customer feedback from CSV files. The system performs sentiment analysis (Positive, Neutral, Negative) and extracts common keywords from negative feedback to help businesses understand their customers better.

## 🚀 Features

- **CSV Upload**: Upload bulk customer feedback via CSV files.
- **Sentiment Analysis**: Automatically categorizes feedback using NLTK's VADER sentiment analyzer.
- **Keyword Extraction**: Identifies common recurring words in negative feedback.
- **Dashboard**: View sentiment distribution and feedback summaries.
- **Recent Feedback**: Scroll through the most recent feedback entries with their sentiment scores.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python
- **Libraries**:
  - `pandas` (Data processing)
  - `nltk` (Sentiment analysis - VADER)
  - `sqlite3` (Database)
  - `uvicorn` (ASGI Server)

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript

### 🏁 Getting Started
Prerequisites
Python 3.8+
Node.js 18+
1. Backend Setup
Navigate to the backend directory and set up the Python environment.

bash
cd backend
# Create a virtual environment
python -m venv venv
# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Run the server
uvicorn main:app --reload
The backend API will be available at http://localhost:8000. API Docs (Swagger UI): http://localhost:8000/docs

2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the development server.

bash
cd frontend
# Install dependencies
npm install
# Run the development server
npm run dev
The frontend application will be available at http://localhost:3000.

## 📂 Project Structure

```bash
Customer-feedback-analysis/
├── backend/            # FastAPI backend
│   ├── main.py         # API entry point & endpoints
│   ├── database.py     # Database connection & init
│   ├── sentiment.py    # Sentiment analysis logic
│   ├── preprocess.py   # Text cleaning utilities
│   ├── feedback.db     # SQLite database
│   └── requirements.txt
│
└── frontend/           # Next.js frontend
    ├── app/            # App router & pages
    ├── public/         # Static assets
    └── package.json
