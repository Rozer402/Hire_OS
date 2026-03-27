# HireOS - AI-Powered Professional Hiring Platform

HireOS is a comprehensive full-stack application designed to streamline the recruitment process. It leverages AI to parse resumes, conduct automated interviews, and provide bias-free candidate scoring.

## 🚀 Features

### For Recruiters
- **Smart Dashboard**: High-level overview of hiring metrics and top talent.
- **AI Resume Parsing**: Instant extraction of skills and experience from uploaded PDFs.
- **Automated Interviewing**: Generate and conduct AI-driven contextual interviews.
- **Bias-Free Scoring**: Rank candidates based on holistic skill matching rather than just keywords.
- **Candidate Management**: Track applications through customizable hiring stages.
- **Direct Messaging**: Bidirectional chat system with candidates.

### For Candidates
- **Job Discovery**: Professional job board with advanced search and filtering.
- **Seamless Application**: Interactive resume upload and AI-assisted profiles.
- **Async Interviews**: Flexible interview format responding to AI-generated prompts.
- **Real-time Status**: Track application progress and receive instant feedback.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, TanStack Query, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **AI Integration**: Google Gemini AI (Resume parsing & scoring).
- **Communication**: Nodemailer (Email notifications), Custom Chat System.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hireos
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   cp .env.example .env # Fill in VITE_API_URL
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd ../server
   npm install
   cp .env.example .env # Fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
   npm run dev
   ```

## 🌐 Environment Variables

### Frontend (`client/.env`)
- `VITE_API_URL`: Base URL for the backend API (e.g., `http://localhost:5000/api`).

### Backend (`server/.env`)
- `PORT`: Server port (default: 5000).
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: Random string for secure token generation.
- `GEMINI_API_KEY`: API key from Google AI Studio.
- `EMAIL_USER` / `EMAIL_PASS`: Gmail App Password for notifications.
- `FRONTEND_URL`: URL of your frontend for CORS (e.g., `http://localhost:5173`).

## 🛡️ Best Practices
- **Security**: JWT-based authentication and role-based access control (RBAC).
- **Stability**: Global error boundaries and centralized API services.
- **Performance**: Optimized data fetching with TanStack Query.
- **Scalability**: Clean MVC architecture on the backend.

---
Built with ❤️ by the HireOS Team.
