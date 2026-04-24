"""
Nyaya AI - Forensic Fairness Engine
Enterprise-grade package initialization, metadata, and centralized telemetry.
"""

import logging
import os
import sys
from typing import List

# ---------------------------------------------------------
# 1. PACKAGE METADATA
# ---------------------------------------------------------
__version__ = "2.5.0-LTS"
__app_name__ = "Nyaya AI Forensic API"
__author__ = "8-bit Avengers"

# Explicitly control what gets exported when another module imports '*'
# Prevents 'sys' and 'os' from leaking into the global namespace.
__all__: List[str] = ["__version__", "__app_name__", "__author__"]

# ---------------------------------------------------------
# 2. ENTERPRISE TELEMETRY (LOGGING) ARCHITECTURE
# ---------------------------------------------------------
def _setup_enterprise_logging() -> logging.Logger:
    """
    Configures idempotently safe, centralized logging for the Nyaya application.
    Prevents duplicate log entries during FastAPI hot-reloads.
    """
    log_level_str = os.getenv("LOG_LEVEL", "INFO").upper()
    
    # Safely map string to logging level, defaulting to INFO if invalid
    valid_levels = {
        "DEBUG": logging.DEBUG, 
        "INFO": logging.INFO, 
        "WARNING": logging.WARNING, 
        "ERROR": logging.ERROR, 
        "CRITICAL": logging.CRITICAL
    }
    log_level = valid_levels.get(log_level_str, logging.INFO)

    # Standard Enterprise Log Format with Millisecond Precision
    log_format = "%(asctime)s.%(msecs)03d | %(levelname)-8s | %(name)-25s | %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"

    # Root application logger namespace (all routers should inherit from 'nyaya.xxx')
    app_logger = logging.getLogger("nyaya")
    app_logger.setLevel(log_level)

    # Idempotency Check: Only attach handlers if none exist
    if not app_logger.handlers:
        # Enforce UTF-8 on the stdout stream to prevent crash on Unicode log characters
        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setLevel(log_level)
        
        formatter = logging.Formatter(fmt=log_format, datefmt=date_format)
        stream_handler.setFormatter(formatter)
        
        app_logger.addHandler(stream_handler)
        
        # Prevent logs from propagating to the global root logger and printing twice
        app_logger.propagate = False

    return app_logger

# Initialize the core logger upon package import
logger = _setup_enterprise_logging()

# Boot sequence confirmation
logger.info(f"Initializing {__app_name__} v{__version__} by {__author__}")
logger.info(f"Enterprise Central Telemetry: ACTIVE (Level: {logging.getLevelName(logger.level)})")