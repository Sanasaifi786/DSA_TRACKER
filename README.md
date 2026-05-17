<div align="center">

# 🧩 SkillPath — DSA Tracker

**Track your DSA journey across Striver, Love Babbar & Daily Challenge sheets.**  
Stay consistent. Stay sharp. Land your dream job.

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat&logo=react)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens)

</div>

---

## ✨ Features

- 📋 **3 DSA Sheets** — Striver SDE, Love Babbar 450, Daily Challenge
- ✅ **Progress Tracking** — Mark questions solved, see live stats
- 🔐 **Authentication** — Register, Login, Logout with JWT
- 🌙 **Dark / Light Mode** — Smooth theme toggle, saved in localStorage
- 🤖 **AI Insights** — Gemini-powered weak topic detection
- 📱 **Responsive** — Works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS + CSS Variables |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh Tokens) |
| AI | Google Gemini API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/Sanasaifi786/DSA_TRACKER.git
cd DSA_TRACKER
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Open → **http://localhost:5173**

---

## 📁 Project Structure

```
DSATracker/
├── backend/
│   ├── src/
│   │   ├── controller/     # Auth, Questions, Progress, AI
│   │   ├── model/          # User, Question, Progress schemas
│   │   ├── routes/         # API route definitions
│   │   ├── middlewares/    # JWT auth middleware
│   │   └── db/             # MongoDB connection
│   └── scripts/
│       └── seed.js         # Seed questions to DB
│
└── frontend/
    └── src/
        ├── components/     # Navbar, PageTitle
        ├── pages/          # Home, SignIn, SignUp
        ├── context/        # ThemeContext (dark/light)
        └── App.jsx
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| POST | `/api/v1/auth/logout` | Logout user | 🔒 |
| GET | `/api/v1/questions?sheet=striver` | Get questions by sheet | Public |
| GET | `/api/v1/progress` | Get user progress | 🔒 |
| POST | `/api/v1/progress/toggle` | Mark question solved | 🔒 |

---

## 👩‍💻 Author

**Sana Saifi** — [@Sanasaifi786](https://github.com/Sanasaifi786)
