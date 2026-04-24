import os
import json
import logging
import asyncio
import numpy as np
import pandas as pd
from typing import Tuple
from google import genai
from google.genai import types

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_math_engine")

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

def calculate_disparate_impact(
    df: pd.DataFrame, 
    protected_col: str, 
    privileged_class: str, 
    decision_col: str, 
    positive_outcome: str
) -> float:
    """
    Vectorized, high-performance calculation of the EEOC 4/5ths Rule.
    Safe against division-by-zero and null-vector anomalies.
    """
    try:
        # 1. Isolate demographic masks
        priv_mask = (df[protected_col].astype(str) == str(privileged_class))
        unpriv_mask = (df[protected_col].astype(str) != str(privileged_class))
        pos_mask = (df[decision_col].astype(str) == str(positive_outcome))

        # 2. Calculate Base Populations
        priv_total = priv_mask.sum()
        unpriv_total = unpriv_mask.sum()

        if priv_total == 0:
            logger.warning("Mathematical Anomaly: Zero privileged records found.")
            return 0.0

        if unpriv_total == 0:
            logger.warning("Mathematical Anomaly: Zero unprivileged records found.")
            return 1.0 # Technically perfect parity if no unprivileged exist to be discriminated against

        # 3. Calculate Selection Rates (SR)
        priv_rate = (priv_mask & pos_mask).sum() / priv_total
        unpriv_rate = (unpriv_mask & pos_mask).sum() / unpriv_total

        if priv_rate == 0:
            return 0.0

        # 4. Return Disparate Impact Ratio (DIR)
        return round(unpriv_rate / priv_rate, 4)

    except Exception as e:
        logger.error(f"Mathematical Tensor Error: {str(e)}")
        raise ValueError(f"Failed to calculate disparate impact: {str(e)}")


async def remediate_dataset(
    df: pd.DataFrame, 
    protected_col: str, 
    privileged_class: str, 
    decision_col: str, 
    positive_outcome: str
) -> Tuple[pd.DataFrame, str]:
    """
    Enterprise Remediation Engine.
    Uses a Hybrid LLM-SMOTE approach to synthesize minority records, ensuring mathematical parity without breaching LLM token limits.
    """
    current_dir = calculate_disparate_impact(df, protected_col, privileged_class, decision_col, positive_outcome)
    
    # EEOC Safe Harbor Threshold
    if 0.80 <= current_dir <= 1.25:
        return df, f"Dataset is already structurally fair (DIR: {current_dir:.2f}). No remediation required."

    logger.info(f"Initiating Remediation Sequence. Current DIR: {current_dir:.2f}")

    # 1. Calculate the exact mathematical gap to reach DIR 1.0 (Perfect Parity)
    priv_mask = (df[protected_col].astype(str) == str(privileged_class))
    pos_mask = (df[decision_col].astype(str) == str(positive_outcome))
    
    priv_rate = (priv_mask & pos_mask).sum() / priv_mask.sum()
    
    unpriv_mask = ~priv_mask
    current_unpriv_pos = (unpriv_mask & pos_mask).sum()
    
    # Required positive outcomes for unprivileged group to match privileged selection rate
    required_unpriv_pos = int(priv_rate * unpriv_mask.sum())
    gap = required_unpriv_pos - current_unpriv_pos
    
    if gap <= 0:
        return df, "Mathematical constraints indicate remediation would destabilize current parity."

    # 2. Extract context seeds for the LLM
    # We take a small sample of existing successful minority records so the AI understands the schema and domain
    successful_unpriv_df = df[unpriv_mask & pos_mask]
    seeds = successful_unpriv_df.head(5).to_dict(orient='records')
    columns = list(df.columns)

    synthetic_df = None
    use_fallback = False

    # 3. Try LLM Archetype Generation (If client is online)
    if client and seeds:
        prompt = f"""
        You are an Enterprise Synthetic Data Engineer. We are performing targeted SMOTE (Synthetic Minority Over-sampling).
        Study these sample records of successful candidates: {seeds}
        
        Generate exactly 5 NEW, highly realistic, distinct records that follow this exact schema.
        
        CRITICAL RULES:
        - Schema must match these columns exactly: {columns}
        - Column '{protected_col}' MUST NOT be '{privileged_class}'. Use diverse minority values.
        - Column '{decision_col}' MUST exactly be '{positive_outcome}'.
        
        Return ONLY a JSON object in this format:
        {{"synthetic_rows": [{{...}}, {{...}}]}}
        """

        try:
            logger.info("Requesting Synthetic Archetypes from Gemini...")
            response = await client.aio.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4, # Slight variance to create distinct synthetic identities
                )
            )
            
            result_data = json.loads(response.text)
            archetype_rows = result_data.get("synthetic_rows", [])
            
            if archetype_rows:
                archetype_df = pd.DataFrame(archetype_rows)
                # Align columns and drop hallucinations
                archetype_df = archetype_df.reindex(columns=df.columns) 
                
                # Hybrid Bootstrapping: Scale the 5 LLM archetypes + original seeds to fill the massive gap
                combined_pool = pd.concat([successful_unpriv_df, archetype_df], ignore_index=True)
                synthetic_df = combined_pool.sample(n=gap, replace=True).reset_index(drop=True)
                logger.info(f"Successfully bootstrapped {gap} records via Hybrid LLM-SMOTE.")

        except Exception as e:
            logger.warning(f"LLM Synthesis failed ({str(e)}). Engaging classical statistical fallback.")
            use_fallback = True
    else:
        use_fallback = True

    # 4. Classical Statistical Fallback (Zero-Downtime Guarantee)
    if use_fallback or synthetic_df is None:
        if successful_unpriv_df.empty:
            # Absolute edge case: zero existing successes to sample from.
            return df, "Remediation failed: No baseline minority successes exist to anchor synthetic generation."
        
        logger.info(f"Executing classical Pandas Bootstrapping for {gap} records.")
        # Pure statistical oversampling
        synthetic_df = successful_unpriv_df.sample(n=gap, replace=True).reset_index(drop=True)

    # 5. Merge and Finalize
    def merge_dataframes(original: pd.DataFrame, synthetic: pd.DataFrame) -> pd.DataFrame:
        # Shuffle the newly balanced dataset so synthetic rows aren't all at the bottom
        merged = pd.concat([original, synthetic], ignore_index=True)
        return merged.sample(frac=1).reset_index(drop=True)

    # Threading the final Pandas merge to protect the event loop
    balanced_df = await asyncio.to_thread(merge_dataframes, df, synthetic_df)
    
    new_dir = calculate_disparate_impact(balanced_df, protected_col, privileged_class, decision_col, positive_outcome)

    return balanced_df, f"Systemic healing complete. Synthesized {gap} minority records. New Institutional Parity (DIR): {new_dir:.2f}."