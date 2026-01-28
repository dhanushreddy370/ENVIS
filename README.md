# E.N.V.I.S. 2.0 (Hybrid Architecture)

> Update: An advanced, hybrid desktop assistant combining a high-speed Node.js Web Server with a powerful Python AI Engine.

![React](https://img.shields.io/badge/Front--React_19-blue)
![Node](https://img.shields.io/badge/Back--Node.js-green)
![Python](https://img.shields.io/badge/AI--Engine-Python-yellow)
![CrewAI](https://img.shields.io/badge/Agent--CrewAI-red)

## 🧠 What is different in Envis 2?

Unlike the original ENVIS which was a monolithic Python application, **Envis 2** creates a separation of concerns:
- **Node.js**: Handles the lightweight, fast-paced tasks (APIs, Authentication, WebSockets).
- **Python**: Handles the heavy cognitive load (LLM processing, Computer Vision, Complex Reasoning).

This **"Sidecar" Architecture** allows the UI to remain snappy even while the AI is thinking deeply.

## 🏗️ Technical Stack

- **Frontend**: React 19, Vite, Tailwind v4.
- **Backend API**: Express.js (Node.js).
- **AI Core**: Python 3.12, CrewAI, LangChain.
- **Database**: MongoDB (User Data), Redis (optional for caching).
- **Desktop Wrapper**: Electron (planned).

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- Python 3.10+
- MongoDB

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/dhanushreddy370/ENVIS.git
   cd ENVIS/envis2
   ```

2. **Install Backend (Node + Python)**
   ```bash
   cd backend
   npm install
   # Python Setup
   pip install -r requirements.txt
   ```
   *(Note: Ensure you have a virtual environment active for Python)*

3. **Install Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configuration**
   - Create a `.env` file in `backend/` with your API Keys (OpenAI/Gemini) and MongoDB URI.

### Running the App
The app requires both servers running simultaneously:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173` (or the port shown in terminal) to interact with ENVIS.

## 🤝 Contribution
This project is part of the ENVIS ecosystem. 
