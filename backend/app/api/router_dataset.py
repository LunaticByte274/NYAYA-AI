import io
import logging
import pandas as pd
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel, Field

# Assuming this imports your mathematical logic correctly
from app.services.math_utils import calculate_disparate_impact

router = APIRouter(
    prefix="/api/data",
    tags=["Dataset Pipeline Engine"],
)

# Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_dataset_core")

# Upgraded to 50MB to handle realistic enterprise CSV payloads safely
MAX_FILE_SIZE = 50 * 1024 * 1024  

# --- STRICT RESPONSE MODELS ---
class AuditMetadata(BaseModel):
    total_records: int = Field(..., description="Total rows parsed in the dataset.")
    protected_attribute: str = Field(..., description="The column audited for demographic bias.")
    privileged_class: str = Field(..., description="The class acting as the baseline control.")
    decision_column: str = Field(..., description="The target variable column.")

class DatasetAuditResponse(BaseModel):
    disparate_impact_ratio: float = Field(..., description="The calculated DIR score.")
    status: str = Field(..., description="Categorical outcome: 'Fair', 'Biased', or 'Critical Bias'.")
    message: str = Field(..., description="Forensic explanation of the mathematical result.")
    metadata: AuditMetadata

@router.post(
    "/audit-csv",
    response_model=DatasetAuditResponse,
    status_code=status.HTTP_200_OK,
    summary="Mathematical Dataset Bias Audit",
    description="Ingests tabular data, isolates protected vectors, and calculates the Disparate Impact Ratio (DIR)."
)
async def audit_dataset(
    file: UploadFile = File(...),
    protected_col: str = Form(...),
    privileged_class: str = Form(...),
    decision_col: str = Form(...),
    positive_outcome: str = Form(...)
):
    # 1. Security & Payload Validation
    valid_mimes = ["text/csv", "application/vnd.ms-excel"]
    if not file.filename.endswith('.csv') and file.content_type not in valid_mimes:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, 
            detail="Security Exception: Invalid payload. Only CSV file streams are permitted."
        )
    
    # 2. Memory-Safe Ingestion
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, 
            detail=f"Payload exceeds {MAX_FILE_SIZE // (1024*1024)}MB enterprise limit."
        )
        
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data payload is structurally empty."
        )

    # 3. Offloaded Tensor Processing (Threaded to protect the Async Event Loop)
    def process_dataframe(data_bytes: bytes) -> dict:
        try:
            # Optimized C-engine for faster CSV parsing
            df = pd.read_csv(io.BytesIO(data_bytes), engine="c", low_memory=False)
        except pd.errors.EmptyDataError:
            raise ValueError("The provided CSV contains no structural data columns.")
        except pd.errors.ParserError:
            raise ValueError("CSV parsing failed. Ensure the file is valid UTF-8 and correctly delimited.")

        # Validation: Ensure requested vectors exist in the DataFrame
        missing_cols = [col for col in [protected_col, decision_col] if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Tensor mismatch: Dataset is missing required columns: {', '.join(missing_cols)}")
            
        # Validation: Ensure user-defined classes actually exist in the data to prevent divide-by-zero errors
        if privileged_class not in df[protected_col].astype(str).values:
            raise ValueError(f"Class '{privileged_class}' not found in protected column '{protected_col}'.")
        if positive_outcome not in df[decision_col].astype(str).values:
            raise ValueError(f"Outcome '{positive_outcome}' not found in decision column '{decision_col}'.")

        # Mathematical Core Execution
        try:
            dir_score = calculate_disparate_impact(
                df, protected_col, privileged_class, decision_col, positive_outcome
            )
        except Exception as math_err:
            logger.error(f"Math Engine Failure: {str(math_err)}")
            raise ValueError("Failed to calculate selection rates. Ensure the decision column contains variance.")

        # Deep insights mapping based on EEOC Four-Fifths logic
        is_fair = 0.80 <= dir_score <= 1.25
        
        # Exact status mapping for Frontend UI triggers
        if is_fair:
            status_label = "Fair"
            message = f"Mathematical parity achieved. DIR ({dir_score:.2f}) satisfies the EEOC Four-Fifths threshold."
        elif dir_score < 0.5 or dir_score > 2.0:
            status_label = "Critical Bias"
            message = f"Severe algorithmic disparity detected (DIR: {dir_score:.2f}). Immediate remediation via SMOTE or reweighing required."
        else:
            status_label = "Biased"
            message = f"Structural bias identified. DIR ({dir_score:.2f}) falls outside the 0.80 - 1.25 legal safety buffer."

        return {
            "disparate_impact_ratio": round(dir_score, 4),
            "status": status_label,
            "message": message,
            "metadata": {
                "total_records": len(df),
                "protected_attribute": protected_col,
                "privileged_class": privileged_class,
                "decision_column": decision_col
            }
        }

    # 4. Await the threaded execution and return validated schema
    try:
        result = await asyncio.to_thread(process_dataframe, contents)
        return DatasetAuditResponse(**result)
    except ValueError as ve:
        logger.warning(f"Data Validation Warning: {str(ve)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Critical Pipeline Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Systemic failure in the tabular mathematical pipeline."
        )