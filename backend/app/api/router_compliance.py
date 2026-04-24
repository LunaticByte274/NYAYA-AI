import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Literal, Optional

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_compliance_core")

router = APIRouter(
    prefix="/api/compliance",
    tags=["Governance & Compliance"],
    responses={400: {"description": "Malformed Data Payload"}, 500: {"description": "Internal Engine Error"}}
)

# --- STRICT REQUEST MODELS ---
class ComplianceMapRequest(BaseModel):
    disparate_impact_ratio: float = Field(
        ..., 
        ge=0.0, 
        le=5.0, 
        description="Calculated DIR score. Standard parity sits at 1.0."
    )
    domain: Literal["hiring", "finance", "policy", "general"] = Field(
        ..., 
        description="Target industry domain triggering specific regulatory thresholds."
    )

# --- STRICT RESPONSE MODELS ---
class FrameworkStatus(BaseModel):
    name: str
    status: Literal["COMPLIANT", "WARNING", "CRITICAL RISK", "PENDING"]
    severity: Literal["low", "medium", "high"]
    requirement: str
    penalty_risk: str
    action_required: str

class ComplianceMapResponse(BaseModel):
    overall_status: str
    timestamp: str
    dir_score: float
    frameworks: List[FrameworkStatus]

@router.post(
    "/map-regulations", 
    response_model=ComplianceMapResponse,
    status_code=status.HTTP_200_OK,
    summary="Map DIR metrics to global regulatory frameworks",
    description="Evaluates algorithmic parity against NYC Local Law 144, the EU AI Act (Article 10), and UN SDG 10.3."
)
async def map_regulations(req: ComplianceMapRequest):
    try:
        dir_score = req.disparate_impact_ratio
        
        # EEOC Four-Fifths Rule Math Logic (0.8 to 1.25)
        is_compliant = 0.8 <= dir_score <= 1.25
        is_critical = dir_score < 0.6 or dir_score > 1.5
        is_reverse_bias = dir_score > 1.25

        logger.info(f"Processing Compliance Audit - Domain: {req.domain.upper()} | DIR: {dir_score}")

        # Constructing rich, dynamic framework profiles based on exact mathematical vectors
        frameworks = [
            FrameworkStatus(
                name="NYC Local Law 144 (AEDT)",
                status="COMPLIANT" if is_compliant else ("CRITICAL RISK" if is_critical else "WARNING"),
                severity="low" if is_compliant else ("high" if is_critical else "medium"),
                requirement="Annual independent bias audit for automated employment tools.",
                penalty_risk="Up to $1,500 per day/violation" if not is_compliant else "Minimal - Certified",
                action_required="Maintain immutable logs" if is_compliant else "Immediate algorithmic remediation required"
            ),
            FrameworkStatus(
                name="EU AI Act (Article 10)",
                status="COMPLIANT" if is_compliant else "CRITICAL RISK",
                severity="high" if req.domain in ["hiring", "finance"] and not is_compliant else "low",
                requirement="Data governance enforcing prevention of discrimination in High-Risk AI.",
                penalty_risk="Up to €35M or 7% of global turnover" if not is_compliant else "None",
                action_required="Conformity Assessment Required" if req.domain in ["hiring", "finance"] else "Continuous Monitoring"
            ),
            FrameworkStatus(
                name="UN SDG 10.3 Impact",
                status="COMPLIANT" if is_compliant else "WARNING",
                severity="low" if is_compliant else "medium",
                requirement="Ensure equal opportunity and reduce inequalities of outcome.",
                penalty_risk="Reputational / ESG Score Degradation",
                action_required="Direct positive alignment confirmed" if is_compliant else "Systemic restructuring recommended"
            )
        ]

        overall = "CERTIFIED" if is_compliant else "NON-COMPLIANT"

        return ComplianceMapResponse(
            overall_status=overall,
            timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z"),
            dir_score=round(dir_score, 3),
            frameworks=frameworks
        )

    except Exception as e:
        logger.error(f"Compliance Core Failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Forensic engine encountered a structural failure mapping regulatory frameworks."
        )