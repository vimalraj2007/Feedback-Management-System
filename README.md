# Feedback Management System

A production-grade, full-stack Feedback Management System built with React (Vite), Node.js (Express), and SQLite. Designed with modern UX principles to easily gather, track, and analyze user feedback.

## Features

- **Dynamic Forms**: Fully flexible question management (Ratings, Free-form Text, Multiple Choice) that renders seamlessly for users.
- **Admin Dashboard**: Gain insights via comprehensive charts (Trend, Distribution, mocked Sentiment Analysis) powered by Recharts.
- **Security First**: JWT-based authentication, bcrypt hashed passwords, and robust middleware stack (Helmet, rate limiting).
- **Responsive UI**: Built with Tailwind CSS v3 using beautiful color tokens and accessible design patterns.

## Prerequisites
- Node.js 18+
- npm

## Getting Started

1. **Setup up the application**:
   Installs all dependencies across the monorepo and builds the frontend if needed.
   ```bash
   npm run setup
   ```

2. **Seed the database**:
   This will initialize the `database.sqlite` and create default schemas, an admin user, sample questions, and 10 fake feedback submissions.
   ```bash
   npm run seed
   ```

3. **Start the Development Server**:
   Starts both the React Vite frontend (port 5173) and Express backend (port 3000) simultaneously.
   ```bash
   npm run dev
   ```

## Admin Credentials
After running the seed script, you can log in with:
**Email:** `admin@example.com`
**Password:** `Admin123!`

(For a regular user account, use `user@example.com` / `User123!`)

## API Reference

### Auth
- `POST /api/auth/register`: Create a new user
- `POST /api/auth/login`: Authenticate for a JWT
- `GET /api/auth/me`: Get current user payload

### Feedback
- `POST /api/feedback/`: Submit new feedback
- `GET /api/feedback/my`: Retrieve current user's history
- `GET /api/feedback/`: (Admin) Get paginated feedback
- `GET /api/feedback/:id`: (Admin) Specific feedback w/ sentiment tag
- `DELETE /api/feedback/:id`: (Admin) Delete feedback

### Questions
- `GET /api/questions/active`: User view of sorted questions
- `GET /api/questions/`: (Admin) View all questions
- `POST /api/questions/`: (Admin) Create
- `PUT /api/questions/:id`: (Admin) Edit
- `PATCH /api/questions/reorder`: (Admin) Bulk edit order index
- `DELETE /api/questions/:id`: (Admin) Deactivate question

### Analytics
- `GET /api/analytics/summary`: KPI summary metrics
- `GET /api/analytics/trend`: 14/30 day rolling timeseries
- `GET /api/analytics/distribution`: Rating aggregation for donut chart
- `GET /api/analytics/sentiment`: Tagging groupings by question

### Export
- `GET /api/export/csv`: Export raw tabular payload (CSV format)
- `GET /api/export/pdf`: Export summary PDF abstraction (Simple txt for now)

## Project Architecture & Tech Stack

- `npm` workspaces connecting `client` + `server` + `shared` logic.
- **Client**: React context for state, React Router v6, Axios interceptors, Zod validators.
- **Server**: Express router, better-sqlite3 for zero-config persistence, custom middleware for auth/validation/errors.
