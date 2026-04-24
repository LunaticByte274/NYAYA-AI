import time
import logging
import asyncio
import httpx
from bs4 import BeautifulSoup
from typing import List, Literal, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, HttpUrl

# Import the core LLM integration service
from app.services.ai_engine import analyze_text_forensics

# Initialize Enterprise Telemetry Logger
logger = logging.getLogger("nyaya_scraper_core")

router = APIRouter(
    prefix="/api/scraper",
    tags=["Live Web Scraping Forensics"],
    responses={
        400: {"description": "Invalid URL or Unreachable Host"},
        403: {"description": "Target Blocked Scraper (WAF/Bot Protection)"},
        500: {"description": "AI Forensic Engine Failure"}
    }
)

# --- STRICT REQUEST MODELS ---
class URLScrapeRequest(BaseModel):
    url: HttpUrl = Field(
        ..., 
        description="Target HTTPS endpoint to extract and audit."
    )
    locale: str = Field(
        default="en-US", 
        description="Target locale context for cultural bias detection."
    )
    domain: str = Field(
        default="general", 
        description="Industry domain to adjust severity thresholds."
    )

@router.post(
    "/scrape-and-scan",
    status_code=status.HTTP_200_OK,
    summary="Live URL Semantic Extraction & Audit"
)
async def scrape_and_scan_url(req: URLScrapeRequest):
    """
    Fetches raw HTML from a live endpoint, strips semantic noise (headers, scripts, navs), 
    and passes the sterilized text through the Forensic Bias Engine.
    """
    target_url = str(req.url)
    logger.info(f"Initiating Live Web Extraction - Target: {target_url}")
    start_time = time.time()

    # 1. Enterprise Anti-Bot Evasion Headers
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    try:
        # 2. Async HTTP Extraction
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(target_url, headers=headers)
            
            if response.status_code in [401, 403]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail="Target endpoint blocked the extraction request (WAF/Firewall intervention)."
                )
            response.raise_for_status()

        html_content = response.content

        # 3. Thread-Isolated DOM Parsing (Protects the Async Event Loop)
        def sterilize_html(raw_html: bytes) -> str:
            soup = BeautifulSoup(raw_html, "html.parser")
            
            # Deep Semantic Noise Reduction
            noise_tags = ["script", "style", "nav", "footer", "header", "aside", "noscript", "iframe", "svg"]
            for element in soup(noise_tags):
                element.decompose()
                
            # Extract text with proper spacing to prevent word-mashing
            text = soup.get_text(separator=' ', strip=True)
            return text

        logger.info("Executing thread-isolated DOM sterilization...")
        raw_text = await asyncio.to_thread(sterilize_html, html_content)

        if len(raw_text) < 50:
            raise ValueError("Insufficient parseable content. Target may be a Single Page Application (SPA) requiring JavaScript rendering.")

        # 4. Token Constraint Check (Preserves Gemini Context Window)
        capped_text = raw_text[:15000] 

        # 5. Execute Core Forensic Engine
        logger.info("Transmitting sterilized payload to AI Core...")
        forensic_data = await asyncio.to_thread(
            analyze_text_forensics, 
            capped_text,
            req.locale,
            req.domain
        )
        
        # Validate AI response
        if "error" in forensic_data:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY, 
                detail=forensic_data["error"]
            )
            
        # Append dynamic metadata for the dashboard
        execution_time = round(time.time() - start_time, 3)
        forensic_data["execution_time_seconds"] = execution_time
        forensic_data["source_url"] = target_url
        forensic_data["target_locale"] = req.locale
        forensic_data["target_domain"] = req.domain
            
        logger.info(f"URL Audit Complete. Execution Time: {execution_time}s")
        return forensic_data

    except httpx.RequestError as e:
        logger.error(f"HTTPX Extraction Failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Network extraction failed. Verify endpoint is live. ({str(e)})"
        )
    except ValueError as ve:
        logger.warning(f"Sterilization Warning: {str(ve)}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Critical Web Scraper Pipeline Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Systemic failure during web extraction and semantic audit."
        )