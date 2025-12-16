# 🏫 Novum Labs - Institute Management System (IMS)

A full-stack, responsive Institute Management System built to manage students, teachers, fees, and attendance securely and efficiently.

## 🚀 Tech Stack

### Frontend (Client)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** JWT & Bcrypt

---

## 📂 Project Structure

```bash
novum-labs/
│
├── client/         # React Frontend Application
│   ├── src/
│   │   ├── pages/  # UI Pages (Login, Dashboard)
│   │   └── services/ # API Connection
│
└── server/         # Node.js Backend API
    ├── src/
    │   ├── controllers/ # Business Logic
    │   └── routes/      # API Endpoints
    └── prisma/     # Database Schema

