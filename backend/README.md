# Backend for the Mindful Reflection App

This directory contains the Python/Flask backend for the Mindful Reflection App.

## Setup and Running

1.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Set API Key:**
    Create a file named `.env` in this directory and add your Gemini API key:
    ```
    GEMINI_API_KEY="your_api_key"
    ```

3.  **Run the Server:**
    ```bash
    python app.py
    ```
    The server will start on `http://localhost:5000`.
