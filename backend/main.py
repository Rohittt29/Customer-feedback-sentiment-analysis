"""
FastAPI main application
Customer Feedback & Sentiment Analysis System API
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
from typing import List
import uvicorn

from database import (
    init_db, insert_feedback_batch, record_upload,
    get_sentiment_summary, get_negative_keywords, get_sample_feedback
)
from sentiment import analyze_batch

# Initialize FastAPI app
app = FastAPI(
    title="Customer Feedback Analysis API",
    description="API for analyzing customer feedback sentiment",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Customer Feedback & Sentiment Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "POST /upload-feedback",
            "summary": "GET /sentiment-summary",
            "keywords": "GET /keywords",
            "sample": "GET /sample-feedback"
        }
    }


@app.post("/upload-feedback")
async def upload_feedback(file: UploadFile = File(...)):
    """
    Upload and process CSV file containing customer feedback
    
    Expected CSV format:
    - Must have at least one column: 'feedback_text' or 'feedback'
    - Other columns are ignored
    """
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a CSV file."
        )
    
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Find feedback column (flexible naming)
        feedback_column = None
        for col in df.columns:
            if col.lower() in ['feedback_text', 'feedback', 'text', 'comment', 'review']:
                feedback_column = col
                break
        
        if feedback_column is None:
            raise HTTPException(
                status_code=400,
                detail="CSV file must contain a column named 'feedback_text', 'feedback', 'text', 'comment', or 'review'"
            )
        
        # Extract feedback texts
        feedback_texts = df[feedback_column].dropna().astype(str).tolist()
        
        if len(feedback_texts) == 0:
            raise HTTPException(
                status_code=400,
                detail="No valid feedback data found in the CSV file"
            )
        
        # Analyze sentiment for all feedback
        analysis_results = analyze_batch(feedback_texts)
        
        # Store in database
        insert_feedback_batch(analysis_results)
        record_upload(file.filename, len(analysis_results))
        
        return {
            "message": "Feedback uploaded and processed successfully",
            "filename": file.filename,
            "rows_processed": len(analysis_results),
            "preview": analysis_results[:5]  # Return first 5 for preview
        }
    
    except pd.errors.EmptyDataError:
        raise HTTPException(
            status_code=400,
            detail="CSV file is empty or invalid"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


@app.get("/sentiment-summary")
def sentiment_summary():
    """
    Get overall sentiment distribution summary
    """
    try:
        summary = get_sentiment_summary()
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving sentiment summary: {str(e)}"
        )


@app.get("/keywords")
def keywords(limit: int = 10):
    """
    Get top keywords from negative feedback
    
    Args:
        limit: Number of top keywords to return (default: 10)
    """
    try:
        keywords_list = get_negative_keywords(limit=limit)
        return {
            "keywords": keywords_list,
            "count": len(keywords_list)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving keywords: {str(e)}"
        )


@app.get("/sample-feedback")
def sample_feedback(limit: int = 50):
    """
    Get sample feedback with sentiment labels
    
    Args:
        limit: Number of feedback entries to return (default: 50)
    """
    try:
        feedback_list = get_sample_feedback(limit=limit)
        return {
            "feedback": feedback_list,
            "count": len(feedback_list)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving sample feedback: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
