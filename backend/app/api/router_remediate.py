import io
import logging
import asyncio
import urllib.parse
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import StreamingResponse

# Import your core math logic
from app.services.math_utils import remediate_dataset

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_remediation_core")

router = APIRouter(
    prefix="/api/remediate",
    tags=["Self-Healing Data Pipeline"],
    responses={
        400: {"description": "Invalid Dataset Structure"},
        413: {"description": "Payload Exceeds Limits"},
        500: {"description": "Remediation Engine Failure"}
    }
)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB limit for safe in-memory processing

@router.post(
    "/fix-dataset",
    status_code=status.HTTP_200_OK,
    summary="Algorithmic Remediation Engine",
    description="Analyzes structural bias in a dataset and applies targeted synthetic generation (SMOTE) or reweighing to produce a legally compliant (EEOC 4/5ths) CSV."
)
async def fix_dataset(
    file: UploadFile = File(...),
    protected_col: str = Form(..., description="The demographic vector to balance."),
    privileged_class: str = Form(..., description="The over-represented baseline class."),
    decision_col: str = Form(..., description="The target variable representing the outcome."),
    positive_outcome: str = Form(..., description="The favorable result in the decision column.")
):
    logger.info(f"Initiating Remediation Tensor for {file.filename} | Target: {protected_col}")

    # 1. Security & Payload Validation
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, 
            detail="Security Exception: Invalid payload. Only CSV files are permitted."
        )

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

    try:
        # 2. Thread-Isolated CSV Parsing
        df = await asyncio.to_thread(pd.read_csv, io.BytesIO(contents), engine="c", low_memory=False)
        
        # Validate columns
        missing_cols = [col for col in [protected_col, decision_col] if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Dataset is missing required columns: {', '.join(missing_cols)}")

        # 3. Execute Core Remediation Logic (Assuming it's async in your math_utils)
        balanced_df, message = await remediate_dataset(
            df, protected_col, privileged_class, decision_col, positive_outcome
        )

        # 4. Thread-Isolated CSV Serialization
        def df_to_csv_stream(dataframe: pd.DataFrame) -> io.BytesIO:
            stream = io.BytesIO()
            dataframe.to_csv(stream, index=False, encoding="utf-8")
            stream.seek(0)
            return stream

        output_stream = await asyncio.to_thread(df_to_csv_stream, balanced_df)

        # 5. True Async Chunked Streaming Generator
        async def stream_csv_chunks(stream: io.BytesIO, chunk_size: int = 8192):
            while True:
                chunk = stream.read(chunk_size)
                if not chunk:
                    break
                yield chunk
                # Tiny sleep to yield control back to the event loop during massive file streams
                await asyncio.sleep(0) 

        # 6. Secure HTTP Header Formatting
        # Filenames and custom headers must be ASCII safe to prevent protocol errors
        safe_filename = urllib.parse.quote(f"NYAYA_BALANCED_{file.filename}")
        safe_message = urllib.parse.quote(message)

        # 7. Dispatch Response
        response = StreamingResponse(
            stream_csv_chunks(output_stream),
            media_type="text/csv"
        )
        response.headers["Content-Disposition"] = f"attachment; filename*=UTF-8''{safe_filename}"
        
        # Include the forensic rationale in the headers so the frontend can read why it was changed
        response.headers["X-Remediation-Message"] = safe_message
        
        logger.info(f"Remediation Complete. Streaming {safe_filename} to client.")
        return response

    except ValueError as ve:
        logger.warning(f"Validation Error during remediation: {str(ve)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Critical Remediation Engine Failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to synthesize balanced records. Review mathematical tensor constraints."
        )