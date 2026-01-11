"""
Text preprocessing module
Handles cleaning and normalization of feedback text
"""
import re
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

# Get stopwords
try:
    STOP_WORDS = set(stopwords.words('english'))
except LookupError:
    STOP_WORDS = set()


def clean_text(text: str) -> str:
    """
    Clean and preprocess text for analysis
    
    Args:
        text: Raw feedback text
        
    Returns:
        Cleaned text string
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www.\S+', '', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters but keep basic punctuation for sentiment analysis
    # VADER works better with punctuation, so we'll keep it for sentiment
    # but clean it for keyword extraction
    
    return text.strip()


def preprocess_for_keywords(text: str) -> str:
    """
    Preprocess text for keyword extraction
    More aggressive cleaning - removes punctuation and stopwords
    
    Args:
        text: Raw feedback text
        
    Returns:
        Preprocessed text for keyword extraction
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Clean text first
    text = clean_text(text)
    
    # Tokenize
    try:
        tokens = word_tokenize(text)
    except:
        # Fallback to simple split if tokenization fails
        tokens = text.split()
    
    # Remove punctuation and stopwords
    tokens = [
        token for token in tokens
        if token not in string.punctuation
        and token.lower() not in STOP_WORDS
        and len(token) > 2
    ]
    
    return ' '.join(tokens)
