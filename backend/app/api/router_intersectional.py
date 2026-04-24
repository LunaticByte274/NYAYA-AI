import os
import json
import logging
from typing import Dict, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_intersectional_core")

router = APIRouter(
    prefix="/api/intersectional",
    tags=["Intersectional Bias Matrix"],
    responses={
        400: {"description": "Payload Validation Error"},
        503: {"description": "AI Engine Unavailable / Missing API Key"}
    }
)

# --- SYSTEM INITIALIZATION ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.critical("GEMINI_API_KEY is missing from environment variables. AI endpoints will fail.")

# Instantiate the new Google GenAI client
client = genai.Client(api_key=api_key)

# --- STRICT REQUEST MODELS ---
class IntersectionalRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length=20, 
        max_length=25000, 
        description="The raw intelligence payload to be analyzed for intersectional overlaps."
    )
    domain: Optional[str] = Field(
        default="general", 
        description="The contextual industry domain (e.g., hiring, lending, healthcare)."
    )

# --- STRICT RESPONSE MODELS (Used for both FastAPI and Gemini Generation) ---
class IntersectionalResponse(BaseModel):
    matrix: Dict[str, int] = Field(
        ..., 
        description="Dictionary mapping intersectional demographic pairs (e.g., 'Gender_Age') to a bias risk score (0-100)."
    )
    critical_vector: str = Field(
        ..., 
        description="The specific intersectional demographic pair facing the highest systemic risk."
    )
    deep_insight: str = Field(
        ..., 
        description="Forensic, explainable AI (XAI) analysis detailing exactly how these demographics overlap to compound discrimination."
    )

@router.post(
    "/matrix",
    response_model=IntersectionalResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Intersectional Bias Matrix"
)
async def analyze_intersectional_bias(req: IntersectionalRequest):
    """
    Forensic Intersectional Matrix Engine.
    Maps compounding systemic bias across overlapping demographic dimensions (Gender, Race, Age, Ability, Socioeconomic).
    Uses Gemini 2.5 Flash with strict JSON schema enforcement via native Async I/O.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Neural Engine Offline: GEMINI_API_KEY is not configured on the server."
        )

    logger.info(f"Executing Intersectional Analysis. Payload length: {len(req.text)} chars.")

    # High-density forensic prompt design
    prompt = f"""
    You are an expert AI Fairness Auditor. Perform a deep intersectional bias analysis on the provided text.
    
    Context Domain: {req.domain.upper()}
    
    INSTRUCTIONS:
    1. Analyze how different demographic identities (Gender, Race, Age, Ability, Class/Socioeconomic) overlap and compound bias in this text.
    2. Calculate a 0-100 severity risk score for various intersectional pairs (e.g., "Gender_Age", "Race_Class"). 0 = Neutral/Safe, 100 = Critical Bias.
    3. Identify the single most marginalized intersectional group ("critical_vector").
    4. Provide a "deep_insight" paragraph explaining the systemic mechanics of this specific overlap.

    TEXT TO ANALYZE:
    "{req.text}"
    """
    
    try:
        # EXECUTE NATIVE ASYNC CALL (Prevents event-loop blocking)
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                # Force Gemini to strictly adhere to our Pydantic model
                response_schema=IntersectionalResponse,
                temperature=0.1, # Low temperature for deterministic, analytical outputs
            )
        )
        
        if not response.text:
            raise ValueError("AI Engine returned an empty tensor.")

        # Parse the guaranteed-schema JSON string into a Python dict
        result_dict = json.loads(response.text)
        
        logger.info(f"Intersectional Matrix Compiled. Critical Vector: {result_dict.get('critical_vector')}")
        
        return result_dict

    except json.JSONDecodeError as je:
        logger.error(f"Schema Enforcement Failure: {str(je)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail="AI Engine failed to align with strict intersectional JSON schema."
        )
    except Exception as e:
        logger.error(f"Intersectional Core Failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Systemic failure in the Gemini multimodal pipeline."
        )