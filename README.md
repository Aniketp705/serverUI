# ⚡ Home Server Dashboard UI (ServerUI)

A modern, high-performance web dashboard for monitoring and managing your home server. Built with a **React (Vite)** frontend and a **Flask** backend.

---

## 📁 Project Structure

```text
serverUI/
├── backend/
│   ├── app.py             # Flask REST API (System stats, services & storage endpoints)
│   └── requirements.txt   # Python dependencies (Flask, Flask-CORS, psutil)
└── frontend/
    ├── package.json       # React & Vite dependencies
    ├── vite.config.js     # Vite configuration with API proxy to port 5000
    ├── index.html         # Entry HTML with custom Google Fonts
    └── src/
        ├── main.jsx       # React application entry
        ├── App.jsx        # Dashboard layout & live polling logic
        ├── index.css      # Glassmorphism & modern dark theme CSS
        └── components/
            ├── Navbar.jsx          # Header with server status & uptime
            ├── SystemStats.jsx     # Live CPU, RAM & Disk metrics
            ├── ServicesList.jsx    # Hosted services status & links
            └── StorageOverview.jsx # Drives & storage pool health
```

---

## 🚀 Quick Start Instructions

### 1. Start the Flask Backend

Open a terminal in the project root:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*The Flask API will run on `http://localhost:5000`.*

### 2. Start the React Frontend

Open a second terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
*The React UI will run on `http://localhost:3000` (proxying `/api` requests to Flask).*
