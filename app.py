from flask import Flask, render_template, request, jsonify
from twilio.rest import Client
import pymysql
import requests

app = Flask(__name__)

# Twilio and Google Maps API keys from config.py
from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE, GOOGLE_MAPS_API_KEY, DB_CONFIG

# Database connection
def connect_db():
    return pymysql.connect(**DB_CONFIG)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect_heart_attack', methods=['POST'])
def detect_heart_attack():
    try:
        data = request.json
        user_id = data.get("user_id")
        heart_rate = data.get("heart_rate")

        if not user_id or not heart_rate:
            return jsonify({"error": "user_id and heart_rate are required"}), 400

        if heart_rate > 120:  # Hypothetical threshold for heart attack
            db = connect_db()
            cursor = db.cursor()
            
            # Fetch guardian details
            cursor.execute("SELECT guardian_phone, guardian_name FROM users WHERE id = %s", (user_id,))
            guardian = cursor.fetchone()
            
            # Fetch nearest hospital
            cursor.execute("SELECT name, address FROM hospitals LIMIT 1")  # Replace with dynamic query for real use
            hospital = cursor.fetchone()
            db.close()

            if guardian and hospital:
                # Send SOS message
                client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                message_body = f"Heart attack detected! Guardian: {guardian[1]}, please rush to {hospital[1]} ({hospital[0]})."
                client.messages.create(
                    body=message_body,
                    from_=TWILIO_PHONE,
                    to=guardian[0]
                )

                return jsonify({
                    "status": "emergency",
                    "hospital": {"name": hospital[0], "address": hospital[1]},
                    "message_sent": True
                })

            return jsonify({"error": "Guardian or hospital information missing"}), 404

        return jsonify({"status": "normal"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_nearest_hospital', methods=['POST'])
def get_nearest_hospital():
    try:
        data = request.json
        latitude, longitude = data.get('latitude'), data.get('longitude')

        if not latitude or not longitude:
            return jsonify({"error": "latitude and longitude are required"}), 400

        # Use Google Maps API to find nearby hospitals
        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=hospital&key={GOOGLE_MAPS_API_KEY}"
        response = requests.get(url)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from Google Maps API"}), response.status_code

        results = response.json().get('results', [])
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5002, debug=True)
