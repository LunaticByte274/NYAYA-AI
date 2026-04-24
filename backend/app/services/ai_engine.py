import os
import json
import re
import logging
import asyncio
from typing import List, Dict, Any

# Enterprise Resilience Libraries
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from google import genai
from google.genai import types
from google.genai.errors import APIError
from pydantic import BaseModel, Field, ValidationError

# Initialize Enterprise Logger for production monitoring
logger = logging.getLogger("nyaya.ai_engine")

# Initialize Gemini Enterprise Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.critical("GEMINI_API_KEY missing. Forensic Engine is offline.")
    
client = genai.Client(api_key=api_key)

# --- ENTERPRISE SCHEMA VALIDATION (Pydantic) ---
class ReasoningTree(BaseModel):
    type: str = Field(..., description="The classification of the bias.")
    cause: str = Field(..., description="The structural or historical root cause.")
    impact: str = Field(..., description="The predicted societal or enterprise risk.")
    proof: str = Field(..., description="XAI Evidence: Detailed sociological/mathematical justification.")

class ForensicFinding(BaseModel):
    quote: str
    startIndex: int = 0
    endIndex: int = 0
    category: str
    severity: str
    is_proxy: bool
    reasoning_tree: ReasoningTree
    recommendation: str
    policy_improvement: str
    sdg: str = "SDG 10: Reduced Inequalities"

class ForensicResponse(BaseModel):
    overall_fairness_score: int
    confidence_score: float
    locale_detected: str
    findings: List[ForensicFinding]

# --- RESILIENCE WRAPPER ---
# Automatically retries on Google API transient failures (Rate limits, server timeouts)
@retry(
    stop=stop_after_attempt(3), 
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(APIError),
    before_sleep=lambda retry_state: logger.warning(f"Gemini API hiccup. Retrying attempt {retry_state.attempt_number}...")
)
async def _generate_content_with_retry(prompt: str) -> types.GenerateContentResponse:
    """Internal wrapper to protect the Gemini call with exponential backoff."""
    return await client.aio.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ForensicResponse, # Enforces strict architectural compliance
            temperature=0.1, # Low temperature ensures forensic reproducibility
        ),
    )

# --- CORE FORENSIC ENGINE ---

async def analyze_text_forensics(raw_text: str, domain: str = "general", locale: str = "en-US") -> Dict[str, Any]:
    """
    Advanced Forensic AI Engine with Multi-Language Cultural Intelligence.
    Executes Deep Chain-of-Thought (CoT), calculates AI confidence, 
    and maps exact regex boundaries for perfect UI highlighting.
    """
    
    # 1. Forensic Guardrails
    if not raw_text or len(raw_text.strip()) < 5:
        logger.warning("Audit aborted: Insufficient input text.")
        return {"error": "Insufficient text for forensic analysis.", "findings": []}

    # 2. Strategic Prompt Engineering
    prompt = f"""
    ROLE: You are the Chief Cultural & AI Fairness Auditor for Nyaya Systems.
    CONTEXT: Perform a forensic audit on the text below within the [{domain.upper()}] domain.
    LOCALE: The target region/language is [{locale}].

    AUDIT OBJECTIVE: 
    Identify structural bias, gender/age coding, proxy variables, and intersectional discrimination.
    
    CULTURAL NUANCE INSTRUCTIONS:
    Identify locale-specific proxy variables for [{locale}]:
    - If 'hi-IN' (Hindi): Identify caste-coded surnames, regional dialects, or traditional occupations acting as proxies for socioeconomic status.
    - If 'en-US': Identify Zip Codes, 'urban' vs 'suburban' coding, and historically race-coded colloquialisms.
    - If 'en-GB': Identify class-based linguistic markers and 'posh' vs 'working-class' terminology.

    CRITICAL RULE: The "quote" field MUST be an exact, word-for-word substring from the provided text.

    TEXT TO AUDIT:
    {raw_text}
    """

    try:
        # 3. Non-Blocking Async Inference with Retry Protection
        response = await _generate_content_with_retry(prompt)

        if not response.text:
            raise ValueError("Engine returned an empty tensor.")
        
        # 4. Extract Guaranteed Structured Data
        ai_data = json.loads(response.text)

        # 5. High-Performance Smart-Boundary Mapping
        processed_findings = []
        raw_findings = ai_data.get("findings", [])
        used_indices = set()

        for item in raw_findings:
            quote = item.get("quote", "").strip()
            if not quote: 
                continue
                
            # Safely escape punctuation to prevent Regex crashes
            escaped_quote = re.escape(quote)
            
            # SMART BOUNDARIES: \b ensures we only match whole words
            try:
                pattern = re.compile(rf"\b{escaped_quote}\b", re.IGNORECASE)
                matches = [m for m in pattern.finditer(raw_text)]
                if not matches:
                    raise ValueError("No word-boundary match, falling back to pure substring.")
            except:
                pattern = re.compile(escaped_quote, re.IGNORECASE)
                matches = [m for m in pattern.finditer(raw_text)]
            
            found_idx = -1
            for m in matches:
                if m.start() not in used_indices:
                    found_idx = m.start()
                    # Block out the entire range so overlapping quotes don't glitch the UI
                    for i in range(m.start(), m.end()):
                        used_indices.add(i)
                    break

            if found_idx != -1:
                # Severity Normalization
                severity = str(item.get("severity", "medium")).lower()
                if severity not in ["high", "medium", "low", "critical"]: severity = "medium"

                item["startIndex"] = found_idx
                item["endIndex"] = found_idx + len(quote)
                item["severity"] = severity
                
                # Fill missing schema fields if the AI skipped them
                if "reasoning_tree" not in item:
                    item["reasoning_tree"] = {"type": "Undetermined", "cause": "N/A", "impact": "N/A", "proof": "No proof provided."}
                
                processed_findings.append(item)

        # 6. Lock Final Payload Data
        ai_data["findings"] = processed_findings
        ai_data["locale_detected"] = locale

        # Pydantic validation: Final integrity check before sending to frontend
        ForensicResponse.model_validate(ai_data)
        
        logger.info(f"Audit Success [{locale}]: Score {ai_data.get('overall_fairness_score')} | {len(processed_findings)} issues identified.")
        return ai_data

    except (json.JSONDecodeError, ValidationError) as e:
        logger.error(f"Schema Integrity Failure: {e}")
        return {"error": "AI Audit Response was malformed. Re-run suggested.", "findings": []}
    except Exception as e:
        logger.error(f"Critical Engine Failure: {e}")
        return {"error": f"Internal Forensic Failure: {str(e)}", "findings": []}