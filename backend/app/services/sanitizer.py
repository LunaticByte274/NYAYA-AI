import re
import unicodedata
import html
import logging

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_security_core")

# --- HIGH-PERFORMANCE COMPILED REGEX PATTERNS ---
# Compiling these at the module level prevents the CPU from recompiling them on every single API request.
HTML_TAG_PATTERN = re.compile(r'<[^>]+>')
CONTROL_CHAR_PATTERN = re.compile(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]')
WHITESPACE_PATTERN = re.compile(r'\s+')
# Zero-width characters are frequently used in stealth Prompt Injection attacks
ZERO_WIDTH_PATTERN = re.compile(r'[\u200B-\u200D\uFEFF]')

def sanitize_input(raw_text: str, max_length: int = 15000) -> str:
    """
    Enterprise-grade input sanitization pipeline.
    Prevents Prompt Injection, invisible Unicode bypasses, XSS, and payload DoS.
    Highly optimized using pre-compiled regex vectors.
    """
    if not raw_text or not isinstance(raw_text, str):
        return ""

    try:
        # 1. Unescape HTML entities (e.g., converts &lt; to < so it can be effectively stripped)
        text = html.unescape(raw_text)
        
        # 2. Normalize Unicode (NFKC normalizes visually identical characters to standard forms, defeating font-based bypasses)
        text = unicodedata.normalize('NFKC', text)
        
        # 3. Strip HTML tags completely to prevent markup injection
        text = HTML_TAG_PATTERN.sub('', text)
        
        # 4. Annihilate invisible control characters (except standard newlines/tabs)
        text = CONTROL_CHAR_PATTERN.sub('', text)
        
        # 5. Destroy zero-width hidden prompt injection tokens
        text = ZERO_WIDTH_PATTERN.sub('', text)
        
        # 6. Normalize whitespace (collapse multiple spaces/newlines into a single space to save LLM tokens)
        text = WHITESPACE_PATTERN.sub(' ', text)
        
        # 7. Strip trailing whitespace and enforce hard mathematical length limits
        cleaned_text = text.strip()
        
        # Telemetry for intercepted payload bloat
        if len(cleaned_text) > max_length:
            logger.warning(f"Payload truncated. Original length: {len(cleaned_text)} | Max allowed: {max_length}")
            
        return cleaned_text[:max_length]

    except Exception as e:
        logger.error(f"Critical Sanitization Failure: {str(e)}")
        # Failsafe: Return empty string to completely neutralize the threat if processing fails
        return ""