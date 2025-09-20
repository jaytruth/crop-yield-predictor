# data_loader.py
import pandas as pd

# Load dataset once at startup
DATA_PATH = "Final_Dataset_2.csv"
df = pd.read_csv(DATA_PATH)

# Clean columns if needed (strip spaces, lowercasing col names)
df.columns = [c.strip() for c in df.columns]

def get_crop_data(district=None, crop=None, year=None, month=None):
    """
    Filter dataset by district, crop, year, month.
    Returns a subset dataframe (can be empty if no match).
    """
    data = df.copy()

    if district:
        data = data[data["district"].str.lower() == district.lower()]
    if crop and "crop" in data.columns:
        data = data[data["crop"].str.lower() == crop.lower()]
    if year and "year" in data.columns:
        data = data[data["year"] == int(year)]
    if month and "month" in data.columns:
        data = data[data["month"] == int(month)]

    return data

def get_latest_value(district, column):
    """
    Get the most recent value for a given column in a district.
    """
    data = get_crop_data(district=district)
    if data.empty or column not in data.columns:
        return None
    return data.iloc[-1][column]

def get_average(district, column):
    """
    Get average value for a column in a district.
    """
    data = get_crop_data(district=district)
    if data.empty or column not in data.columns:
        return None
    return round(data[column].astype(float).mean(), 2)
