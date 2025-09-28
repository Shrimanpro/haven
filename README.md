Haven 
==============

A mindfulness web app that helps users relax, reflect, and gain insights from their daily thoughts.\
Features include guided breathing exercises, journaling, AI-powered summaries, and speech recognition for venting.

Features
----------

-   **Breathing Exercises** \
    Interactive, animated breathing cycles with visual guidance.

-   **Journaling** \
    Write and save entries with timestamps.

-   **AI Summaries** \
    Summarizes your journal to give insights and reflection.

-   **Venting with Speech Recognition** \
    Speak directly instead of typing---voice input gets transcribed and responded to by the AI.

-   **Dynamic UI** \
    Built with Tailwind CSS, animated with Framer Motion, and styled with glassmorphism & gradient effects.

Tech Stack
-------------

### Frontend

-   React

-   React Router

-   Tailwind CSS

-   Framer Motion

-   SpeechRecognition (Web Speech API)

### Backend

-   Python (Flask or FastAPI)

-   Google Generative AI API (Gemini for text, optional Imagen for images)

Getting Started
------------------

### Prerequisites

-   Node.js (>= 16)

-   Python (>= 3.9)

-   A Google Cloud Project with **Generative AI API** enabled

### Installation

1.  Clone the repository
   ```

cd mindful-app
```
2. Install frontend dependencies
```
cd frontend
npm install
```
3. Install backend dependencies
```
cd ../backend
pip install -r requirements.txt
```
4. Add your API keys

Create a .env file in the backend/ folder

Add:
```
GOOGLE_API_KEY=your_api_key_here
```

### Run the App

```
cd backend
python app.py
```

```
cd frontend
npm run dev
```
