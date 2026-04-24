import logging
from datetime import datetime, timezone
from typing import Literal, Dict
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, model_validator

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_drift_monitor")

router = APIRouter(
    prefix="/api/monitor",
    tags=["Live Production Telemetry (Drift)"],
    responses={
        400: {"description": "Mathematically Impossible Payload"},
        500: {"description": "Telemetry Processing Failure"}
    }
)

# --- STRICT REQUEST MODELS ---
class LiveTrafficData(BaseModel):
    model_version: str = Field(
        default="v2.5.0-LTS", 
        description="The production model identifier generating these inferences."
    )
    privileged_requests: int = Field(..., ge=0, description="Total inferences requested by the privileged group.")
    privileged_approvals: int = Field(..., ge=0, description="Total positive outcomes granted to the privileged group.")
    unprivileged_requests: int = Field(..., ge=0, description="Total inferences requested by the unprivileged group.")
    unprivileged_approvals: int = Field(..., ge=0, description="Total positive outcomes granted to the unprivileged group.")

    @model_validator(mode='after')
    def validate_mathematical_bounds(self) -> 'LiveTrafficData':
        if self.privileged_approvals > self.privileged_requests:
            raise ValueError("Data anomaly: Privileged approvals exceed total privileged requests.")
        if self.unprivileged_approvals > self.unprivileged_requests:
            raise ValueError("Data anomaly: Unprivileged approvals exceed total unprivileged requests.")
        return self

# --- STRICT RESPONSE MODELS ---
class DriftResponse(BaseModel):
    timestamp: str = Field(..., description="Cryptographically precise UTC timestamp of the telemetry reading.")
    live_dir: float = Field(..., description="Real-time Disparate Impact Ratio.")
    status: Literal["STABLE", "WARNING", "CRITICAL_DRIFT"]
    alert: str = Field(..., description="Actionable system alert based on current drift status.")
    metrics: Dict[str, float] = Field(..., description="Raw selection rates for deep dashboard analytics.")

@router.post(
    "/check-drift",
    response_model=DriftResponse,
    status_code=status.HTTP_200_OK,
    summary="Monitor Live Traffic for Bias Drift"
)
async def check_bias_drift(data: LiveTrafficData):
    """
    Ingests live inference traffic data and calculates real-time systemic bias drift.
    Prevents ZeroDivision errors and strictly enforces EEOC boundaries.
    """
    try:
        # Safe Division to calculate Selection Rates (SR)
        sr_priv = data.privileged_approvals / data.privileged_requests if data.privileged_requests > 0 else 0.0
        sr_unpriv = data.unprivileged_approvals / data.unprivileged_requests if data.unprivileged_requests > 0 else 0.0
        
        # Safe Division for Disparate Impact Ratio (DIR)
        dir_score = sr_unpriv / sr_priv if sr_priv > 0 else 1.0

        # EEOC Four-Fifths Rule Boundary Logic
        is_compliant = 0.80 <= dir_score <= 1.25
        is_critical = dir_score < 0.60 or dir_score > 1.50

        if is_compliant:
            system_status = "STABLE"
            alert_msg = "Parity maintained. Live inference traffic aligns with SDG 10.3 safety thresholds."
            logger.info(f"[{data.model_version}] Telemetry Stable. Live DIR: {dir_score:.3f}")
        elif is_critical:
            system_status = "CRITICAL_DRIFT"
            alert_msg = "IMMEDIATE INTERVENTION REQUIRED: Model inference trajectory has critically breached parity limits in production."
            logger.warning(f"[{data.model_version}] CRITICAL DRIFT DETECTED. Live DIR: {dir_score:.3f}")
        else:
            system_status = "WARNING"
            alert_msg = "Drift detected. Model is trending toward structural bias. Queue retraining sequence."
            logger.info(f"[{data.model_version}] Drift Warning. Live DIR: {dir_score:.3f}")

        return DriftResponse(
            timestamp=datetime.now(timezone.utc).isoformat(),
            live_dir=round(dir_score, 3),
            status=system_status,
            alert=alert_msg,
            metrics={
                "selection_rate_privileged": round(sr_priv, 3),
                "selection_rate_unprivileged": round(sr_unpriv, 3)
            }
        )

    except Exception as e:
        logger.error(f"Live Telemetry Core Failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Systemic failure compiling live bias telemetry."
        )