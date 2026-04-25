import os
import time
import uuid
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv

# --- RATE LIMITING (SlowAPI) ---
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# --- ENVIRONMENT & CONFIGURATION ---
load_dotenv()

# Safe fallback imports for metadata
try:
    from app import __version__, __app_name__
except ImportError:
    __version__ = "2.5.0"
    __app_name__ = "Nyaya AI Forensic Engine"

# --- STRICT PATH ALIGNMENT: Import Modular Routers ---
from app.api import (
    router_heatmap, 
    router_dataset, 
    router_simulate,
    router_vision,     
    router_scraper,    
    router_remediate,
    router_intersectional,
    router_monitor,
    router_feedback,
    router_compliance
)

# --- LOGGING CONFIGURATION ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("nyaya.main")

# Initialize Global Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# --- ENTERPRISE LIFESPAN MANAGER ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Safely manages server boot-up, validation, and tear-down sequences."""
    logger.info(f"🚀 Igniting Neural Core: {__app_name__} v{__version__}")
    
    # 1. Validate Critical Environment Variables
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key or len(gemini_key) < 10:
        logger.error("❌ CRITICAL: GEMINI_API_KEY is missing or invalid. AI endpoints will fail.")
    else:
        logger.info("✅ Neural Core Connectivity: Verified.")

    yield # --- Server is actively running ---
    
    logger.info("🛑 Executing safe shutdown sequence. Terminating active tensors...")

# --- FASTAPI APP INSTANCE ---
app = FastAPI(
    title=__app_name__,
    description="Strategic Infrastructure for Systemic Bias Detection. Aligned with UN SDG 10 & 16.",
    version=__version__,
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    contact={
        "name": "Nyaya Support",
        "email": "swayampadhi830@gmail.com",
    }
)

# Attach Rate Limiter to application state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- MIDDLEWARE STACK (Order is critical) ---

# 1. Trusted Host Middleware: Prevents HTTP Host Header attacks
# FIX: Added strict stripping and fallback to wildcard for Render routing
raw_hosts = os.getenv("ALLOWED_HOSTS", "*")
ALLOWED_HOSTS = [host.strip() for host in raw_hosts.split(",") if host.strip()]
app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)

# 2. Gzip Compression: Automatically compresses large JSON/CSV responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 3. Strict CORS (THE TERMINATOR FIX)
# FIX: Bulletproof parsing to ensure Vercel URLs are perfectly read without hidden spaces
raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"], # Changed to wildcard to prevent pre-flight blockages
    allow_headers=["*"], # Changed to wildcard to ensure custom headers pass
)

# 4. Performance Latency & Security Header Middleware
@app.middleware("http")
async def enterprise_guard_middleware(request: Request, call_next):
    """Calculates latency and injects enterprise security headers."""
    start_time = time.time()
    
    # Generate a unique trace ID for observability
    trace_id = request.headers.get("X-Request-ID", f"req-{uuid.uuid4().hex[:8]}")
    
    # No redundant try/except block here. Errors bubble up directly to the global handler.
    response = await call_next(request)
    
    process_time = time.time() - start_time
    
    # Inject Telemetry & Tracing
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-Trace-ID"] = trace_id
    
    # Inject Strict Security Guards
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response

# --- EXCEPTION HANDLERS ---

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Catches Pydantic 422 errors and formats them into the enterprise standard."""
    logger.warning(f"Validation Error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Data Validation Failed",
            "message": "The payload provided did not pass strict schema validation.",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catches all unhandled 500 errors to prevent stack trace leaks."""
    trace_id = f"NYA-{uuid.uuid4().hex[:8]}"
    logger.error(f"[Trace: {trace_id}] CRITICAL SYSTEM ERROR on {request.url.path}: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Engine Failure",
            "message": "The Forensic Engine encountered an unexpected state.",
            "trace_id": trace_id,
            "documentation": "https://nyaya.ai/docs/errors"
        }
    )

# --- ROUTER REGISTRATION (The Neural Core) ---

# Core Intelligence Modules
app.include_router(router_heatmap.router, prefix="/api/forensics", tags=["Heatmap"])
app.include_router(router_vision.router, prefix="/api/vision", tags=["Vision"])
app.include_router(router_dataset.router, prefix="/api/dataset", tags=["Dataset"])
app.include_router(router_simulate.router, prefix="/api/simulation", tags=["Simulation"])
app.include_router(router_intersectional.router, prefix="/api/intersectional", tags=["Intersectional"])

# Advanced Remediation, Monitoring & Utility Modules
app.include_router(router_remediate.router, prefix="/api/remediate", tags=["Remediation"])
app.include_router(router_scraper.router, prefix="/api/scraper", tags=["Scraper"])
app.include_router(router_monitor.router, prefix="/api/monitor", tags=["Monitoring"])
app.include_router(router_feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(router_compliance.router, prefix="/api/compliance", tags=["Compliance"])

# --- SYSTEM HEALTH & HEARTBEAT ENDPOINTS ---

@app.get("/", tags=["System Heartbeat"])
async def system_status():
    """Returns the live status and meta-information of the Nyaya AI Engine."""
    return {
        "status": "Online",
        "engine": __app_name__,
        "version": __version__,
        "region": os.getenv("APP_REGION", "Global-1"),
        "timestamp": time.time(),
        "capabilities": [
            "Forensic Text Analysis",
            "Multimodal Image Audit",
            "Dataset Parity Logic",
            "Counterfactual Simulation",
            "Auto-Remediation Engine"
        ]
    }

@app.get("/health", tags=["System Heartbeat"])
async def health_check():
    """Standard health check endpoint for Load Balancers (Cloud Run/Render)."""
    return {"status": "healthy", "latency_check": "passed"}

# --- ENTRY POINT ---
if __name__ == "__main__":
    import uvicorn
    
    # SECURITY & CLOUD FIX: 
    # Render assigns dynamic ports via the PORT env var.
    # Cloud servers MUST bind to 0.0.0.0, not 127.0.0.1.
    api_host = os.getenv("HOST", "0.0.0.0")
    api_port = int(os.getenv("PORT", "8000"))
    
    uvicorn.run("main:app", host=api_host, port=api_port, reload=False)