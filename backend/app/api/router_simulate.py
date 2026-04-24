import os
import re
import json
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_simulation_core")

router = APIRouter(
    prefix="/api/sandbox",
    tags=["Counterfactual Simulation"],
    responses={
        400: {"description": "Validation or Sanitization Failure"},
        503: {"description": "Neural Engine Offline"}
    }
)

# --- SYSTEM INITIALIZATION ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.critical("GEMINI_API_KEY is missing. Counterfactual endpoints will fail.")

client = genai.Client(api_key=api_key)

# --- STRICT REQUEST MODELS ---
class SimulationRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length=10, 
        max_length=15000,
        description="The original structural text to be perturbed."
    )
    variables_to_flip: List[str] = Field(
        ..., 
        min_items=1,
        description="Protected variables to alter (e.g., ['Gender', 'Age', 'Socioeconomic'])."
    )

# --- STRICT RESPONSE MODELS ---
class SimulationResponse(BaseModel):
    simulated_text: str = Field(
        ..., 
        description="The newly generated text with demographic variables inverted."
    )
    applied_changes: List[str] = Field(
        ..., 
        description="A list of specific semantic changes made by the AI (e.g., 'Swapped masculine pronouns for feminine')."
    )

def sanitize_input(text: str) -> str:
    """Security guardrail to strip out potential HTML/script injections."""
    return re.sub(r'<[^>]+>', '', text).strip()

@router.post(
    "/simulate",
    response_model=SimulationResponse,
    status_code=status.HTTP_200_OK,
    summary="Run Intersectional Counterfactual"
)
async def run_simulation(req: SimulationRequest):
    """
    Counterfactual Simulation Engine.
    Rewrites structural intelligence payloads by isolating and inverting multiple requested demographic variables simultaneously, while enforcing strict JSON output via Gemini 2.5.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Neural Engine Offline: GEMINI_API_KEY is not configured."
        )

    clean_text = sanitize_input(req.text)
    
    if len(clean_text) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Sanitized payload is too short for meaningful simulation."
        )

    target_vars = ', '.join(req.variables_to_flip)
    logger.info(f"Executing Counterfactual Simulation. Targets: [{target_vars}]")

    prompt = f"""
    You are an elite AI fairness counterfactual simulator. 
    Rewrite the following text by altering the context specifically regarding these intersectional variables: {target_vars}.
    
    SIMULATION RULES:
    - GENDER: Aggressively swap pronouns, gendered job titles, and masculine/feminine coding.
    - AGE: Alter terms indicating youth/seniority (e.g., 'digital native' vs 'experienced veteran').
    - EDUCATION/CLASS: Swap prestige markers (e.g., 'Ivy league' vs 'State University' or 'Self-taught').
    - NAME/RACE: Swap ethnically identifiable names with alternatives.
    
    CRITICAL CONSTRAINT: Make the new text sound completely natural. Preserve the exact original length, tone, and structural intent, changing ONLY the demographic indicators.

    ORIGINAL TEXT:
    "{clean_text}"
    """

    try:
        # EXECUTE NATIVE ASYNC CALL WITH STRUCTURED OUTPUT
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SimulationResponse,
                temperature=0.3, # Slight variance allowed for natural language rewriting
            )
        )
        
        if not response.text:
            raise ValueError("AI Engine returned an empty tensor.")

        result_dict = json.loads(response.text)
        logger.info("Counterfactual Simulation Complete.")
        
        return result_dict
        
    except json.JSONDecodeError as je:
        logger.error(f"Schema Enforcement Failure: {str(je)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail="AI Engine failed to align with strict simulation JSON schema."
        )
    except Exception as e:
        logger.error(f"Simulation Core Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="The counterfactual engine failed to generate a structural response."
        )