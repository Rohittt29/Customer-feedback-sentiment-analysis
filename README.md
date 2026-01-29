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
