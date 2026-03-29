# 🚀 Feedback Management System

A **production-grade, full-stack Feedback Management System** built using modern web technologies.  
This application enables organizations to efficiently **collect, manage, and analyze user feedback** with a clean UI and powerful admin insights.

---

## ✨ Features

### 📝 Dynamic Feedback Forms
- Supports **Ratings, Text, and Multiple Choice**
- Fully configurable question management
- Seamless user experience

### 📊 Admin Dashboard
- Visual insights using charts:
  - Trends (time-series)
  - Distribution (ratings)
  - Mock sentiment analysis
- Built with **Recharts**

### 🔐 Security First
- JWT-based authentication
- Password hashing with bcrypt
- Middleware protection:
  - Helmet
  - Rate limiting
  - Input validation

### 🎨 Responsive UI
- Built with **Tailwind CSS v3**
- Modern, accessible, mobile-friendly design

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router v6
- Axios
- Zod (validation)
- Tailwind CSS

### Backend
- Node.js
- Express.js
- better-sqlite3 (database)
- JWT Authentication

### Architecture
- Monorepo using **npm workspaces**
- Shared logic between client & server

---

## 📂 Project Structure

Feedback-Management-System/
│
├── client/ # React frontend
├── server/ # Express backend
├── shared/ # Shared logic & validation
├── package.json
└── README.md


---

## ⚙️ Prerequisites

- Node.js (v18+)
- npm

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
npm run setup
