# HireOS

HireOS is a comprehensive applicant tracking and recruitment platform that streamlines candidate management, interview scheduling, and bidirectional direct messaging between recruiters and candidates.

## Features

- **Role-Based Workflows**: Strictly scoped dashboards for Candidates and Recruiters isolating pipelines efficiently.
- **Application Tracking**: Real-time status movements across hiring stages (Applied → In-Review → Shortlisted → Interviewing → Offered).
- **In-App Messaging**: Secure, context-aware web sockets providing a fully functional Glassmorphism-styled chat interface directly over active applications.
- **Async AI Interview Parsing**: Robust AI analysis handling resume text evaluations via direct integrations dynamically.
- **Secure Authentication**: Native `jsonwebtoken` encryption over BCrypt hashing, featuring a complete Nodemailer secure password-reset pipeline removing hard SMTP bypass risks.
- **Production-Ready Builds**: Vite-powered decoupled React frontends serving cleanly parallel to Express backends.

## Prerequisites

- **Node.js**: v18 or later.
- **MongoDB**: Active Mongoose cluster connection.
- **SMTP Server**: Valid Email credentials to safely issue Token updates.

## Setup Instructions

1. **Clone the Source**:
   ```bash
   git clone https://github.com/your-repo/hireos.git
   cd hireos
   ```

2. **Install Dependencies**:
   ```bash
   # Install Server dependencies
   cd server
   npm install

   # Install Client dependencies
   cd ../client
   npm install
   ```

3. **Configure Environments**:
   Copy the provided `.env.example` and place it natively at your root or `server/` directory, updating the keys appropriately. 
   On the frontend, setup `client/.env.production` alongside a local `client/.env` pointing `VITE_API_URL` locally at `http://localhost:5000/api`.

4. **Launch Application**:
   ```bash
   # Terminal 1 - Boot the Express Backend
   cd server
   npm run dev

   # Terminal 2 - Bind the React Client
   cd client
   npm run dev
   ```

## Environment Variables

Your `.env` file should include the following core keys (refer to `.env.example`):
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
MONGO_URI=mongodb+srv://...
JWT_SECRET=super_secret_jwt_key
VITE_API_URL=http://localhost:5000/api
```
