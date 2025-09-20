# ml_connector.py
import joblib
import numpy as np
import os

MODEL_PATH = "best_model.joblib"   # adjust path if needed
_model = None

def load_model(path=MODEL_PATH):
    global _model
    if _model is None:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Trained ML model not found at {path}")
        _model = joblib.load(path)
    return _model

def predict_yield(row):
    """
    row: dict from dataset (already normalized keys).
    Returns: float predicted yield (quintals/acre).
    """
    model = load_model()

    # Extract features from row (must match training!)
    # Use order: numeric + categorical columns as used in training
    # Example minimal features (adapt for your dataset):
    features = [
        float(row.get("rainfall", 0) or 0),
        float(row.get("temperature", 25) or 25),
        float(row.get("nitrogen", 0) or 0),
        float(row.get("phosphorous", 0) or 0),
        float(row.get("potassium", 0) or 0),
    ]

    X = np.array([features])  # 2D array
    pred = model.predict(X)[0]
    return round(float(pred), 2)
