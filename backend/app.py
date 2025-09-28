import os
import json
import datetime
import google.generativeai as genait
from google import genai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# --- Configuration ---
# Use environment variables for the API key for security.
# Create a .env file in the backend directory with:
# GEMINI_API_KEY="your_api_key"
from dotenv import load_dotenv
load_dotenv()

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the frontend

# --- Gemini API Setup ---
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genait.configure(api_key=gemini_api_key)
    model = genait.GenerativeModel('gemini-2.5-flash')
    print("Gemini API configured successfully.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

# --- Journaling Setup ---
JOURNAL_DIR = "journals"
if not os.path.exists(JOURNAL_DIR):
    os.makedirs(JOURNAL_DIR)

# --- Mindful Reflection Coach Persona ---
PERSONA = "You are a mindful reflection coach. Your tone is calm, empathetic, and insightful. You listen without judgment and offer gentle guidance. Your goal is to help the user feel heard, understood, and empowered. If you can, offer advice."

# --- API Endpoints ---

@app.route("/api/meditate", methods=["GET"])
def meditate():
    """Provides a short, guided breathing exercise."""
    print("Meditate endpoint called")
    meditations = [
        "Close your eyes and take a deep breath in... and out... Feel the air fill your lungs... and release. Notice the gentle rhythm of your breath.",
        "Bring your attention to your body. Notice any sensations without judgment. Acknowledge them, and let them be. Your body is your anchor to the present moment.",
        "Think of something you are grateful for. Hold that feeling of gratitude in your heart. Let it fill you with warmth and peace."
    ]
    import random
    return jsonify({"response": random.choice(meditations)})

@app.route("/api/vent", methods=["POST"])
def vent():
    """Listens to the user's venting and offers an empathetic reflection."""
    print("Vent endpoint called")
    if not model:
        print("Error: Gemini API not configured")
        return jsonify({"error": "Gemini API not configured"}), 500

    user_message = request.json.get("message")
    if not user_message:
        print("Error: No message provided")
        return jsonify({"error": "No message provided"}), 400

    try:
        prompt = f"{PERSONA} The user is venting and says: '{user_message}'. Listen without judgment when the user vents. Acknowledge their feelings, reflect key emotions back to them, and provide a short, compassionate insight. Avoid toxic positivity—balance empathy with gentle encouragement."
        print(f"Generating content with prompt: {prompt}")
        response = model.generate_content(prompt)
        print(f"Received response from Gemini: {response.text}")
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/journals", methods=["GET"])
def get_journals():
    """Returns a list of all journal entries."""
    all_entries = []
    for filename in sorted(os.listdir(JOURNAL_DIR), reverse=True):
        if filename.endswith(".json"):
            with open(os.path.join(JOURNAL_DIR, filename), "r") as f:
                data = json.load(f)
                all_entries.append(data)
    return jsonify(all_entries)

@app.route("/api/journal", methods=["POST"])
def journal():
    """Saves a journal entry."""
    print("--- Journal Endpoint Called ---")
    try:
        entry_text = request.json.get("entry")
        if not entry_text:
            print("Error: No entry provided")
            return jsonify({"error": "No entry provided"}), 400
        print(f"Received entry: {entry_text}")
        client = genai.Client(api_key=gemini_api_key)

        # Generate an image for it

        result = client.models.generate_images(
            model="models/imagen-4.0-generate-001",
            prompt=f'Make a cartoon image of the following scenerio and make the speaker a young college student from ASU. Make the entire vibe of the picture cheerful. {entry_text}',
            config=dict(
                number_of_images=1,
                output_mime_type="image/jpeg",
                aspect_ratio="1:1",
            ),
        )

        # # Save the entry
        timestamp = datetime.datetime.now().strftime("%Y_%m_%d %H.%M.%S")
        for n, generated_image in enumerate(result.generated_images):
            generated_image.image.save(f"./journals/{timestamp}.jpg")

        entry_path = os.path.join(JOURNAL_DIR, f"{timestamp}.json")
        new_entry = {"timestamp": timestamp, "entry": entry_text}
        print(f"Saving new entry: {new_entry}")
        with open(entry_path, "w") as f:
            json.dump(new_entry, f)
        print("Entry saved successfully.")
        return jsonify(new_entry)

    except Exception as e:
        print(f"An error occurred in /api/journal: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/journal/<timestamp>", methods=["DELETE"])
def delete_journal(timestamp):
    """Deletes a specific journal entry."""
    try:
        entry_path = os.path.join(JOURNAL_DIR, f"{timestamp}.json")
        if os.path.exists(entry_path):
            os.remove(entry_path)
            return jsonify({"message": "Entry deleted successfully"})
        else:
            return jsonify({"error": "Entry not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/summaries", methods=["GET"])
def summaries():
    """Generates a summary of all journal entries."""
    print("Summaries endpoint called")
    if not model:
        print("Error: Gemini API not configured")
        return jsonify({"error": "Gemini API not configured"}), 500

    all_entries = []
    try:
        print(f"Reading journal entries from: {JOURNAL_DIR}")
        for filename in sorted(os.listdir(JOURNAL_DIR)):
            if filename.endswith(".json"):
                with open(os.path.join(JOURNAL_DIR, filename), "r") as f:
                    data = json.load(f)
                    all_entries.append(data["entry"])
        print(f"Found {len(all_entries)} journal entries.")
    except Exception as e:
        print(f"Error reading journal entries: {e}")
        return jsonify({"error": str(e)}), 500

    if not all_entries:
        return jsonify({"response": "No journal entries found to summarize."})

    try:
        prompt = f"{PERSONA} Here are the user's recent journal entries: {' || '.join(all_entries)}. Identify any recurring themes, emotions, or patterns. Offer a gentle, high-level summary in a few sentances of what you're noticing. Use markdown to format your response."
        print(f"Generating content with prompt: {prompt}")
        response = model.generate_content(prompt)
        print(f"Received response from Gemini: {response.text}")
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/<path:path>')
def serve_generated_image(path):
    return send_from_directory('./journals', f'{path}.jpg')

# --- Main Execution ---
if __name__ == "__main__":
    # Instructions to run:
    # 1. Make sure you have a .env file with your GEMINI_API_KEY.
    # 2. Run `pip install -r requirements.txt` to install dependencies.
    # 3. Run `python app.py` to start the server.
    app.run(debug=True, port=5000)
