import pytest
import pandas as pd
import sys, os
# Ensure the `backend` package directory is on sys.path so `app` imports resolve during tests
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.services.math_utils import calculate_disparate_impact

class TestFairnessMetrics:
    """
    Enterprise CI/CD Test Suite for Nyaya AI Mathematical Utility Engine.
    Mathematically verifies the Disparate Impact Ratio (DIR) and boundary safety.
    """

    @pytest.mark.parametrize(
        "dataset_dict, expected_score, scenario_name",
        [
            (
                # Scenario 1: Perfect Parity (50% vs 50%)
                {"Gender": ["Male", "Male", "Female", "Female"], "Outcome": ["Yes", "No", "Yes", "No"]},
                1.0, 
                "Perfect Parity"
            ),
            (
                # Scenario 2: Severe Bias (100% vs 25%)
                {"Gender": ["Male", "Male", "Male", "Male", "Female", "Female", "Female", "Female"], 
                 "Outcome": ["Yes", "Yes", "Yes", "Yes", "Yes", "No", "No", "No"]},
                0.25, 
                "Severe Structural Bias"
            ),
            (
                # Scenario 3: Reverse Disparity (50% vs 100%)
                {"Gender": ["Male", "Male", "Female", "Female", "Female", "Female"], 
                 "Outcome": ["Yes", "No", "Yes", "Yes", "Yes", "Yes"]},
                2.0, 
                "Reverse Disparity"
            ),
            (
                # Scenario 4: Safe Zero-Division (Privileged group has 0 successes)
                {"Gender": ["Male", "Male", "Female", "Female"], "Outcome": ["No", "No", "Yes", "No"]},
                0.0, 
                "Zero Privileged Outcomes"
            ),
            (
                # Scenario 5: Edge Case - No Unprivileged Records Exist
                {"Gender": ["Male", "Male", "Male"], "Outcome": ["Yes", "No", "Yes"]},
                1.0, 
                "Missing Unprivileged Demographic"
            ),
            (
                # Scenario 6: Edge Case - No Privileged Records Exist
                {"Gender": ["Female", "Female", "Female"], "Outcome": ["Yes", "No", "Yes"]},
                0.0, 
                "Missing Privileged Demographic"
            )
        ]
    )
    def test_disparate_impact_calculations(self, dataset_dict, expected_score, scenario_name):
        """
        Matrix Testing Core.
        Evaluates the EEOC 4/5ths Rule math engine against multiple highly skewed traffic scenarios.
        """
        df = pd.DataFrame(dataset_dict)
        score = calculate_disparate_impact(
            df=df,
            protected_col="Gender",
            privileged_class="Male",
            decision_col="Outcome",
            positive_outcome="Yes"
        )
        assert score == expected_score, f"Mathematical Failure in '{scenario_name}'. Expected {expected_score}, got {score}"

    def test_missing_column_error_handling(self):
        """Ensures the system gracefully rejects structurally corrupted datasets."""
        df = pd.DataFrame({
            "Gender": ["Male", "Female"], 
            "Outcome": ["Yes", "No"]
        })
        
        # We expect a ValueError specifically containing our custom error prefix
        with pytest.raises(ValueError, match="Failed to calculate disparate impact"):
            calculate_disparate_impact(
                df=df, 
                protected_col="Race", # Injecting a non-existent column
                privileged_class="White", 
                decision_col="Outcome", 
                positive_outcome="Yes"
            )

    def test_empty_dataframe(self):
        """Ensures the mathematical tensor doesn't crash the server on a 0-byte payload."""
        empty_df = pd.DataFrame()
        
        with pytest.raises(ValueError, match="Failed to calculate disparate impact"):
            calculate_disparate_impact(
                df=empty_df, 
                protected_col="Gender", 
                privileged_class="Male", 
                decision_col="Outcome", 
                positive_outcome="Yes"
            )