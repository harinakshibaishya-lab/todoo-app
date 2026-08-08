# TodooApp — Full Stack Todo Application

A production-style full-stack todo app with secure JWT authentication, built with React, Node.js, Express, and MySQL.

## Features
- 🔐 JWT-based authentication (register/login)
- ✅ Full CRUD for todos (create, read, update, delete)
- 🔒 Password hashing with bcrypt
- 🛡️ Protected API routes & frontend routes
- 🎨 Modern glassmorphism UI with Tailwind CSS + Framer Motion animations
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔔 Toast notifications for user feedback
- ⚡ Real-time password strength indicator
- 📊 Live stats dashboard (pending / completed / urgent)
- ✔️ One-click complete/incomplete toggle

## Tech Stack
**Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios, Framer Motion, Lucide Icons, React Hot Toast
**Backend:** Node.js, Express.js, JWT, bcrypt
**Database:** MySQL

## Architecture
- RESTful API design (routes → middleware → controllers → models)
- Parameterized SQL queries (SQL injection prevention)
- Stateless JWT authentication with Bearer tokens
- Soft-delete pattern for data safety
- Centralized Axios API service layer with auto-attached auth headers
- Protected frontend routes (redirect if unauthenticated)

## Getting Started

### Backend
\`\`\`bash
cd backend
npm install
# create a .env file (see .env.example for required variables)
npm run dev
\`\`\`
Runs on http://localhost:5000

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Runs on http://localhost:5173

## Environment Variables
See \`backend/.env.example\` for required variables (DB credentials, JWT secret, port).

## API Endpoints
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login, returns JWT | No |
| GET | /api/todos | Get all user's todos | Yes |
| POST | /api/todos | Create a todo | Yes |
| PUT | /api/todos/:id | Update a todo | Yes |
| DELETE | /api/todos/:id | Soft-delete a todo | Yes |

## Author
Harinakshi Baishya