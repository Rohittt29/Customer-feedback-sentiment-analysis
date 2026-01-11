"""
Database module for SQLite operations
Handles database initialization and data persistence
"""
import sqlite3
from typing import List, Dict, Optional, Any

DB_PATH = "feedback_analysis.db"


def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            feedback_text TEXT NOT NULL,
            sentiment_label TEXT NOT NULL,
            sentiment_score REAL NOT NULL,
            processed_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            rows_processed INTEGER NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()


def insert_feedback_batch(feedback_data: List[Dict[str, Any]]):
    """Insert multiple feedback records into the database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    for item in feedback_data:
        cursor.execute("""
            INSERT INTO feedback_data (feedback_text, sentiment_label, sentiment_score, processed_text)
            VALUES (?, ?, ?, ?)
        """, (
            item['feedback_text'],
            item['sentiment_label'],
            item['sentiment_score'],
            item.get('processed_text', '')
        ))
    
    conn.commit()
    conn.close()


def record_upload(filename: str, rows_processed: int):
    """Record upload metadata"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO uploads (filename, rows_processed)
        VALUES (?, ?)
    """, (filename, rows_processed))
    
    conn.commit()
    conn.close()


def get_sentiment_summary() -> Dict[str, any]:
    """Get overall sentiment distribution"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT sentiment_label, COUNT(*) as count
        FROM feedback_data
        GROUP BY sentiment_label
    """)
    
    results = cursor.fetchall()
    conn.close()
    
    total = sum(row[1] for row in results)
    summary = {
        'total': total,
        'positive': 0,
        'neutral': 0,
        'negative': 0,
        'positive_percentage': 0,
        'neutral_percentage': 0,
        'negative_percentage': 0
    }
    
    for label, count in results:
        label_lower = label.lower()
        if label_lower == 'positive':
            summary['positive'] = count
            summary['positive_percentage'] = round((count / total * 100), 2) if total > 0 else 0
        elif label_lower == 'neutral':
            summary['neutral'] = count
            summary['neutral_percentage'] = round((count / total * 100), 2) if total > 0 else 0
        elif label_lower == 'negative':
            summary['negative'] = count
            summary['negative_percentage'] = round((count / total * 100), 2) if total > 0 else 0
    
    return summary


def get_negative_keywords(limit: int = 10) -> List[Dict[str, any]]:
    """Extract top keywords from negative feedback"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT processed_text
        FROM feedback_data
        WHERE sentiment_label = 'Negative'
    """)
    
    negative_feedback = cursor.fetchall()
    conn.close()
    
    # Combine all negative feedback text
    all_text = ' '.join([row[0] for row in negative_feedback if row[0]])
    
    # Simple word frequency analysis
    from collections import Counter
    import re
    
    words = re.findall(r'\b[a-z]{3,}\b', all_text.lower())
    # Filter out common words
    stop_words = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'}
    words = [w for w in words if w not in stop_words]
    
    word_freq = Counter(words)
    top_words = word_freq.most_common(limit)
    
    return [{'word': word, 'count': count} for word, count in top_words]


def get_sample_feedback(limit: int = 50) -> List[Dict[str, any]]:
    """Get sample feedback with sentiment labels"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT feedback_text, sentiment_label, sentiment_score, id
        FROM feedback_data
        ORDER BY created_at DESC
        LIMIT ?
    """, (limit,))
    
    results = cursor.fetchall()
    conn.close()
    
    return [
        {
            'id': row[3],
            'feedback_text': row[0],
            'sentiment_label': row[1],
            'sentiment_score': round(row[2], 3)
        }
        for row in results
    ]


def clear_all_data():
    """Clear all data from database (for testing/reset)"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM feedback_data")
    cursor.execute("DELETE FROM uploads")
    
    conn.commit()
    conn.close()
