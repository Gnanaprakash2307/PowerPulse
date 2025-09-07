from flask import Flask, jsonify
from flask_cors import CORS
import requests
import pandas as pd

# 🔹 Firebase Realtime Database details
FIREBASE_DB_URL = "https://ems-1-6e6b1-default-rtdb.asia-southeast1.firebasedatabase.app/"
FIREBASE_SECRET = "93toZheMgXpV8HyseSzPCmPJUM6C0NkSrIsgPvdtT"

# 🔹 Initialize Flask
app = Flask(__name__)
CORS(app)

# ✅ Home route
@app.route("/")
def home():
    return jsonify({"status": "Backend running with Firebase (Read + Pandas)"}), 200

# ✅ Get all sensor data (cleaned and sorted by timestamp if available)
@app.route("/getSensorData", methods=["GET"])
def get_sensor_data():
    try:
        url = f"{FIREBASE_DB_URL}/SensorData.json?auth={FIREBASE_SECRET}"
        response = requests.get(url, timeout=5)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data", "details": response.text}), 500

        raw_data = response.json()
        if not raw_data:
            return jsonify({"message": "No data found in Firebase."}), 200

        # Only keep valid dictionary entries
        clean_data = [v for v in raw_data.values() if isinstance(v, dict)]

        if not clean_data:
            return jsonify({"message": "No valid sensor records found in Firebase."}), 200

        # Convert to DataFrame for optional cleaning/sorting
        df = pd.DataFrame(clean_data)
        
        # Optional: sort by timestamp if your data has one
        if 'timestamp' in df.columns:
            df = df.sort_values(by='timestamp')

        # Convert back to JSON
        return jsonify(df.to_dict(orient='records')), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Request failed", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
