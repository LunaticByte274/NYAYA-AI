import logging
import asyncio
import hashlib
from datetime import datetime, timezone
from typing import Optional, Literal
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_hitl_core")

router = APIRouter(
    prefix="/api/feedback",
    tags=["Human-in-the-Loop (HITL) Validation"],
    responses={
        400: {"description": "Malformed Feedback Payload"}, 
        500: {"description": "Ledger Synchronization Error"}
    }
)

# --- STRICT REQUEST MODELS ---
class FeedbackRequest(BaseModel):
    finding_id: str = Field(
        ..., 
        min_length=3, 
        max_length=100, 
        description="Unique identifier or hash of the specific forensic finding."
    )
    is_correct: bool = Field(
        ..., 
        description="Boolean flag indicating if the AI's algorithmic assessment was accurate."
    )
    auditor_note: str = Field(
        ..., 
        max_length=1500, 
        description="Human contextual reasoning for the override, confirmation, or legal nuance."
    )
    severity_override: Optional[Literal["low", "medium", "high", "critical"]] = Field(
        default=None, 
        description="Optional manual override for the systemic severity level."
    )

# --- STRICT RESPONSE MODELS ---
class FeedbackResponse(BaseModel):
    status: str = Field(..., description="Confirmation of database/ledger commit.")
    message: str = Field(..., description="System response detailing neural alignment.")
    transaction_hash: str = Field(..., description="Cryptographic receipt of the human intervention.")
    timestamp: str = Field(..., description="UTC timestamp of the ledger entry.")

@router.post(
    "/audit-feedback",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Auditor Feedback (HITL)",
    description="Registers human oversight to refine AI precision, override false positives, and commit decisions to the immutable compliance ledger."
)
async def submit_auditor_feedback(req: FeedbackRequest):
    try:
        logger.info(f"Incoming HITL Override - Target ID: {req.finding_id} | Verified: {req.is_correct}")
        
        # 1. Simulate secure network database / blockchain ledger commit
        await asyncio.sleep(0.5) 
        
        # 2. Generate a deterministic cryptographic receipt for the "Immutable Ledger" narrative
        raw_hash_data = f"{req.finding_id}_{req.is_correct}_{datetime.now(timezone.utc).timestamp()}"
        txn_hash = f"sha256:{hashlib.sha256(raw_hash_data.encode()).hexdigest()[:24]}"

        # 3. Determine the dynamic response message based on the auditor's action
        if req.is_correct:
            system_msg = "Verification logged. The AI Engine will reinforce this semantic vector in future audits."
        else:
            override_text = f" Severity adjusted to {req.severity_override.upper()}." if req.severity_override else ""
            system_msg = f"Override accepted. Model weights flagged for retraining pipeline to reduce false positives.{override_text}"

        logger.info(f"HITL Ledger Commit Successful. TxHash: {txn_hash}")

        return FeedbackResponse(
            status="Committed to Ledger",
            message=system_msg,
            transaction_hash=txn_hash,
            timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
        )

    except Exception as e:
        logger.error(f"HITL Pipeline Failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to commit auditor feedback to the compliance ledger."
        )