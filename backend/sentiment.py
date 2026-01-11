"""
Sentiment analysis module using VADER
Performs sentiment analysis on customer feedback
"""
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from preprocess import clean_text, preprocess_for_keywords


# Initialize VADER analyzer
analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of a text using VADER
    
    Args:
        text: Feedback text to analyze
        
    Returns:
        Dictionary with sentiment_label and sentiment_score
    """
    if not text or not isinstance(text, str):
        return {
            'sentiment_label': 'Neutral',
            'sentiment_score': 0.0,
            'processed_text': ''
        }
    
    # Clean text for analysis (keep punctuation for VADER)
    cleaned_text = clean_text(text)
    
    # Get sentiment scores
    scores = analyzer.polarity_scores(cleaned_text)
    compound_score = scores['compound']
    
    # Classify sentiment based on compound score
    # VADER compound score ranges from -1 (most negative) to +1 (most positive)
    if compound_score >= 0.05:
        sentiment_label = 'Positive'
    elif compound_score <= -0.05:
        sentiment_label = 'Negative'
    else:
        sentiment_label = 'Neutral'
    
    # Preprocess for keywords (more aggressive cleaning)
    processed_text = preprocess_for_keywords(text)
    
    return {
        'sentiment_label': sentiment_label,
        'sentiment_score': compound_score,
        'processed_text': processed_text
    }


def analyze_batch(feedback_list: list) -> list:
    """
    Analyze sentiment for multiple feedback entries
    
    Args:
        feedback_list: List of feedback text strings
        
    Returns:
        List of dictionaries with sentiment analysis results
    """
    results = []
    
    for feedback_text in feedback_list:
        analysis = analyze_sentiment(feedback_text)
        analysis['feedback_text'] = feedback_text
        results.append(analysis)
    
    return results
