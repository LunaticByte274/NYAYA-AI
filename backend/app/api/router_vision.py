import os
import json
import logging
from typing import List, Literal
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_vision_core")

router = APIRouter(
    prefix="/api/vision",
    tags=["Multimodal Vision Forensics"],
    responses={
        400: {"description": "Invalid Visual Payload format"},
        413: {"description": "Image Exceeds Enterprise Size Limits"},
        502: {"description": "Multimodal Engine Validation Failure"},
        503: {"description": "Neural Engine Offline"}
    }
)

# --- SYSTEM INITIALIZATION ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.critical("GEMINI_API_KEY is missing. Vision endpoints will fail.")

client = genai.Client(api_key=api_key)

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB limit for optimal token processing

# --- STRICT RESPONSE MODELS ---
class VisionFinding(BaseModel):
    issue: str = Field(..., description="The specific bias, stereotyping, or representation issue identified in the image.")
    severity: Literal["low", "medium", "high", "critical"] = Field(..., description="Calculated systemic risk level.")
    recommendation: str = Field(..., description="Actionable art direction or corporate policy fix to resolve the bias.")

class VisionAuditResponse(BaseModel):
    representation_score: int = Field(..., ge=0, le=100, description="0-100 index representing demographic balance and equity.")
    summary: str = Field(..., description="High-level forensic summary of the image's composition and implicit messaging.")
    findings: List[VisionFinding] = Field(..., description="Array of specific bias vectors detected in the visual hierarchy.")


@router.post(
    "/analyze-image",
    response_model=VisionAuditResponse,
    status_code=status.HTTP_200_OK,
    summary="Zero-Shot Multimodal Bias Audit"
)
async def analyze_multimodal_bias(file: UploadFile = File(...)):
    """
    Multimodal Bias Engine.
    Scans corporate imagery, marketing assets, and stock photography for implicit representation bias, affinity bias, and stereotyping using Gemini 2.5 Vision.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Neural Engine Offline: GEMINI_API_KEY is not configured."
        )

    # 1. MIME Type & Binary Validation
    valid_mimes = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in valid_mimes:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, 
            detail=f"Invalid format ({file.content_type}). Only JPEG, PNG, and WEBP payloads are permitted."
        )
        
    image_bytes = await file.read()
    payload_size_mb = len(image_bytes) / (1024 * 1024)
    
    if len(image_bytes) > MAX_IMAGE_SIZE:
        logger.warning(f"Rejected payload. Size: {payload_size_mb:.2f}MB")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, 
            detail=f"Visual payload too large ({payload_size_mb:.2f}MB). Maximum permitted size is 5MB."
        )
        
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Image payload is structurally empty."
        )

    logger.info(f"Initiating Multimodal Tensor Scan. Payload: {payload_size_mb:.2f}MB")

    # 2. High-Density Forensic Vision Prompt
    prompt = """
    You are an elite Corporate Diversity, Equity, and Inclusion (DEI) AI Auditor.
    Analyze this visual asset (likely marketing material, stock photography, or a team page).
    
    FORENSIC INSTRUCTIONS:
    1. Identify implicit representation biases, affinity bias, or stereotyping across gender, race, age, and physical ability.
    2. Look for hierarchical positioning (e.g., are minority demographics relegated to the background while privileged demographics are in authoritative focus?).
    3. Calculate an overall 0-100 Representation Index (100 = perfectly equitable and diverse, 0 = highly exclusionary/biased).
    """

    try:
        # 3. Mount Binary Payload for Gemini
        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=file.content_type
        )
        
        # 4. Asynchronous Vision Execution with Strict Schema Enforcement
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, image_part],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=VisionAuditResponse,
                temperature=0.2, # Low variance for objective auditing
            ),
        )
        
        if not response.text:
            raise ValueError("Vision model returned an empty tensor.")

        # 5. Schema Compilation
        result_dict = json.loads(response.text)
        logger.info(f"Vision Audit Complete. Representation Index: {result_dict.get('representation_score')}")
        
        return result_dict
        
    except json.JSONDecodeError as je:
        logger.error(f"Multimodal Schema Enforcement Failure: {str(je)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail="AI Engine failed to align visual analysis with strict JSON schema."
        )
    except Exception as e:
        logger.error(f"Critical Vision Engine Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Systemic failure processing multimodal image tensor."
        )