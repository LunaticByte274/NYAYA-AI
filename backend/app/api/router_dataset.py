import io
import logging
import pandas as pd
import asyncio
from typing import Annotated
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel, Field

# Assuming this imports your mathematical logic correctly
from app.services.math_utils import calculate_disparate_impact

# 🚨 No prefix here! main.py handles the /api/data prefix to prevent 404 errors.
router = APIRouter(tags=["Dataset Pipeline Engine"])

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

# --- LINTER FIX: Extracted to module level to drastically reduce cognitive complexity ---
def process_dataframe(
    data_bytes: bytes, 
    protected_col: str, 
    privileged_class: str, 
    decision_col: str, 
    positive_outcome: str
) -> dict:
    try:
        # Decode bytes to string, ignoring weird hidden characters
        raw_text = data_bytes.decode('utf-8', errors='ignore')
        
        # The Mac "Rich Text" Trap Check
        if raw_text.startswith(r"{\rtf"):
            raise ValueError("File is saved as Rich Text (RTF) instead of a pure CSV. Please open it, copy the text, and save as plain text (.csv).")
        
        # Load into Pandas
        df = pd.read_csv(io.StringIO(raw_text), low_memory=False)
    except pd.errors.EmptyDataError:
        raise ValueError("The provided CSV contains no structural data columns.")
    except Exception as e:
        raise ValueError(f"CSV parsing failed: {str(e)}")

    # --- 🚨 THE MAGIC ARMOR: AUTO-NORMALIZATION 🚨 ---
    # Strip invisible spaces and force uppercase on CSV headers
    df.columns = df.columns.str.strip().str.upper()
    
    # Strip invisible spaces and force uppercase on Frontend requests
    p_col = protected_col.strip().upper()
    d_col = decision_col.strip().upper()
    p_class = str(privileged_class).strip().upper()
    p_out = str(positive_outcome).strip().upper()

    # Validation: Ensure requested vectors exist in the DataFrame
    missing_cols = [col for col in [p_col, d_col] if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Tensor mismatch: Missing required columns: {', '.join(missing_cols)}. The CSV actually contains these columns: {list(df.columns)}")
        
    # Clean the data inside the cells to ensure exact matching
    df[p_col] = df[p_col].astype(str).str.strip().str.upper()
    df[d_col] = df[d_col].astype(str).str.strip().str.upper()

    # Validation: Ensure user-defined classes actually exist in the data
    if p_class not in df[p_col].values:
        raise ValueError(f"Class '{p_class}' not found in protected column '{p_col}'. Found: {df[p_col].unique()}")
    if p_out not in df[d_col].values:
        raise ValueError(f"Outcome '{p_out}' not found in decision column '{d_col}'. Found: {df[d_col].unique()}")

    # Mathematical Core Execution
    try:
        # Pass the sanitized variables to the math engine
        dir_score = calculate_disparate_impact(
            df, p_col, p_class, d_col, p_out
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
            "protected_attribute": p_col,
            "privileged_class": p_class,
            "decision_column": d_col
        }
    }

@router.post(
    "/audit-csv",
    response_model=DatasetAuditResponse,
    status_code=status.HTTP_200_OK,
    summary="Mathematical Dataset Bias Audit",
    description="Ingests tabular data, automatically sanitizes headers, and calculates DIR."
)
async def audit_dataset(
    # LINTER FIX: Upgraded all FastAPI dependencies to use the modern 'Annotated' type hint standard
    file: Annotated[UploadFile, File(...)],
    protected_col: Annotated[str, Form(...)],
    privileged_class: Annotated[str, Form(...)],
    decision_col: Annotated[str, Form(...)],
    positive_outcome: Annotated[str, Form(...)]
):
    # 1. Broadened Security Validation (Catches CSVs mislabeled by browsers)
    valid_mimes = ["text/csv", "application/vnd.ms-excel", "application/csv", "text/x-csv", "application/octet-stream"]
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
    try:
        # Pass the extracted parameters into the threaded worker
        result = await asyncio.to_thread(
            process_dataframe, 
            contents, 
            protected_col, 
            privileged_class, 
            decision_col, 
            positive_outcome
        )
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