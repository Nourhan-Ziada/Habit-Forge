# Habit-Forge

A full-stack habit tracking application built with **Node.js/Express/Drizzle ORM/SQLite** (backend) and **React/Vite/Tailwind CSS** (frontend).

---

## Features

- User authentication (JWT, HTTP-only cookies)
- Create, edit, archive, and view habits
- Habit categories and daily completion tracking
- Habit analytics: streaks, completion %, charts
- Responsive, modern UI with reusable components

---

## Project Structure

```
Habit-Forge/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── .env
│   ├── drizzle.config.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── .env
│   ├── vite.config.js
│   └── package.json
```

---

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Configure environment variables:**  
   Copy`.env` and fill in your settings.

3. **Run migrations and seed data:**
   ```sh
   npm run migrate
   npm run seed
   ```

4. **Start the backend server:**
   ```sh
   npm run dev
   ```
   The API will be available at `http://localhost:3000/api`.

---

### Frontend

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Configure environment variables:**  
   Copy `.env` and set your backend API URL.

3. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## API Overview

- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/habits` — List habits
- `POST /api/habits` — Create habit
- `PUT /api/habits/:habitId` — Update habit
- `DELETE /api/habits/:habitId` — Archive habit
- `GET /api/habits/:habitId/stats` — Habit stats (date range)
- `POST /api/habits/entries` — Add/update daily entry

---

## Development Notes

- **Backend:** Uses Drizzle ORM for migrations and queries. See `src/database/seed.js` for sample data.
- **Frontend:** Uses React, Vite, Tailwind CSS, and shadcn/ui for components.
- **Authentication:** JWT in HTTP-only cookies.
- **Charts:** Uses Recharts for analytics visualizations.

---

## Acknowledgements

- [Drizzle ORM](https://orm.drizzle.team/)
- [Express](https://expressjs.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
