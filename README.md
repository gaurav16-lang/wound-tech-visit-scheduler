# WoudTech Visit Tracking System

A full-stack monorepo application for scheduling and tracking clinician visits to patients.

## Tech Stack
* **Frontend**: React, Vite, Material UI (MUI), React Big Calendar, Axios
* **Backend**: NestJS, SQLite, Prisma ORM, Passport (JWT), bcrypt
* **Language**: TypeScript

## Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (comes with Node.js)

---

## Getting Started

### 1. Install Dependencies

From the **project root**, install dependencies for both frontend and backend (npm workspaces):

```bash
npm install
```

### 2. Database Setup

The app uses **SQLite** with Prisma. The database file is created in `backend/` as `dev.db`.

**From the project root:**

```bash
cd backend
npx prisma generate
npx prisma db push
```

- **`prisma generate`** – generates the Prisma Client used by the backend.
- **`prisma db push`** – creates/updates the SQLite database and tables from `prisma/schema.prisma`. No migration files are created; this is enough for local development.

You do **not** need `prisma migrate` when using `db push`. If you prefer versioned migrations (e.g. for production or team workflows), you can run `npx prisma migrate dev` once to create an initial migration and use that instead of `db push`.

*(Optional)* To inspect data in a UI, run from `backend/`:

```bash
npx prisma studio
```

### 3. Backend Environment (Optional)

The backend reads config from `backend/.env`. A sample file is provided:

```bash
cd backend
cp .env.example .env
```

Edit `.env` if you need to change `JWT_SECRET`, `JWT_EXPIRES_IN`, or `PORT`. Defaults work for local development.

### 4. Start the Backend

Use **two terminals**: one for the API, one for the frontend.

**Option A – from project root:**
```bash
npm run dev:backend
```

**Option B – from backend folder:**
```bash
cd backend
npm run start:dev
```

The API runs at **http://localhost:3000**.

### 5. Start the Frontend

**Option A – from project root:**
```bash
npm run dev:frontend
```

**Option B – from frontend folder:**
```bash
cd frontend
npm run dev
```

The app runs at **http://localhost:5173** (Vite default). Open this URL in your browser.

---

**Quick reference**

| Service   | Command (from root)   | URL                  |
|----------|------------------------|----------------------|
| Backend  | `npm run dev:backend`  | http://localhost:3000 |
| Frontend | `npm run dev:frontend` | http://localhost:5173 |

---

## Default Accounts & Testing Flow

1. **Register a User:** Open the frontend app and register a new user account. Choose your role (e.g., ADMIN).
2. **Dashboard:** Once logged in, you'll be redirected to the Dashboard.
3. **Register Entities:** Use the sidebar to navigate to:
   * **Patient Registration**: Register at least one patient.
   * **Clinician Registration**: Register at least one clinician.
4. **Schedule Visits:** Navigate to **Visits & Appointments** in the sidebar.
   * Click the **New Visit** button or click directly on the calendar to schedule an appointment.
   * You can filter the calendar using the dropdowns: **Clinician**, **Patient**, or **Status** (Scheduled, Completed, Cancelled).
5. **Dashboard Overview:** Return to the Dashboard to see an overview table of all your patients and clinicians. You can click the arrow next to their name to expand and view their individual appointment histories.

## Features

* **JWT Authentication:** Secure user registration and login with role-based access.
* **Patient & Clinician Management:** CRUD operations for core entities.
* **Interactive Calendar:** Full-featured scheduling using `react-big-calendar`.
* **Dark Theme:** Custom Material UI dark mode integration with purple accents.
* **Dashboard Analytics:** Live statistics and expandable appointment history tables.
