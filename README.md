# WoudTech Visit Tracking System

A full-stack monorepo application for scheduling and tracking clinician visits to patients.

## Tech Stack
* **Frontend**: React, Vite, Material UI (MUI), React Big Calendar, Axios
* **Backend**: NestJS, PostgreSQL/SQLite, Prisma ORM, Passport (JWT), bcrypt
* **Language**: TypeScript

## Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (comes with Node.js)

## Getting Started

Follow these steps to set up and run the application locally.

### 1. Install Dependencies
Run the following command in the **root directory** to install all dependencies for both the frontend and backend using npm workspaces:

```bash
npm install
```

### 2. Database Setup (Backend)
The application is pre-configured to use a local SQLite database (`dev.db`) for easy setup without needing PostgreSQL.

Navigate to the `backend` directory and run the Prisma migrations to create the database tables:

```bash
cd backend
npx prisma db push
```

*Note: If you want to use Prisma Studio to view the database visually, you can run `npx prisma studio`.*

### 3. Start the Application

You will need two separate terminal windows/tabs to run the backend and frontend simultaneously.

**Terminal 1: Start the Backend (NestJS)**
```bash
# from the root directory
cd backend
npm run start:dev
```
The backend API will start on `http://localhost:3000`.

**Terminal 2: Start the Frontend (Vite/React)**
```bash
# from the root directory
cd frontend
npm run dev
```
The Vite development server will start (typically on `http://localhost:5173`).

---

## Default Accounts & Testing Flow

1. **Register a User:** Open the frontend app and register a new user account. Choose your role (e.g., ADMIN).
2. **Dashboard:** Once logged in, you'll be redirected to the Dashboard.
3. **Register Entities:** Use the sidebar to navigate to:
   * **Patient Registration**: Register at least one patient.
   * **Clinician Registration**: Register at least one clinician.
4. **Schedule Visits:** Navigate to **Visits & Appointments** in the sidebar.
   * Click the **New Visit** button or click directly on the calendar to schedule an appointment.
   * You can filter the calendar view using the dropdowns in the top right corner by **Clinician** or by **Status** (Scheduled, Completed, Cancelled).
5. **Dashboard Overview:** Return to the Dashboard to see an overview table of all your patients and clinicians. You can click the arrow next to their name to expand and view their individual appointment histories.

## Features

* **JWT Authentication:** Secure user registration and login with role-based access.
* **Patient & Clinician Management:** CRUD operations for core entities.
* **Interactive Calendar:** Full-featured scheduling using `react-big-calendar`.
* **Dark Theme:** Custom Material UI dark mode integration with purple accents.
* **Dashboard Analytics:** Live statistics and expandable appointment history tables.


<img width="1920" height="1020" alt="Image" src="https://github.com/user-attachments/assets/736ac516-7dde-48f1-b410-fe9cb54e8100" /0
