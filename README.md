# Hevents Platform

Hevents is a full-stack event listing and management platform. It allows users to browse events, sign up, and add them to their calendars. Staff members can create, update, and delete events via a dedicated admin dashboard.

---

## Test Account Access

**Email:** `test@hevents.com`
**Password:** `test1234`
**role:** `staff`

Use this account to:

* Browse and sign up for events (as a regular user)
* Access the admin dashboard (`/admin`) if the account has the staff role

---

## Features 🚀

### For Users:

* View all events and filter by category
* Search for events by title or location
* Sign up for events
* Add events to Google Calendar

### For Staff:

* Login via email/password
* Create, edit, and delete events
* Responsive admin interface with expandable event management form

---

## Local Setup Instructions ⚙️

### Prerequisites:

* Node.js & npm
* Supabase account

### 1. Clone the Repositories

```
# Frontend
https://github.com/sdmlr/hevents-frontend

# Backend
https://github.com/sdmlr/hevents-backend
```

### 2. Install Dependencies

```bash
# In each repo
npm install
```

### 3. Environment Variables

Create a `.env` file in both frontend and backend:

#### Frontend

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend

```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Locally

```bash
# Frontend
npm run dev

# Backend
npm run dev
```

---

## Tech Stack

* Frontend: React + Tailwind CSS + React Router + Vite
* Backend: Express + Supabase
* Deployment: Vercel (frontend), Render (backend)

---

## File Structure 📂

Both repos follow conventional structures:

#### Frontend

* `src/pages` – route pages (Home, Calendar, Browse, Admin, etc.)
* `src/components` – shared UI components (e.g., Spinner, TopNav)
* `src/api.ts` – Axios base configuration
* `src/supabase.tsx` – Supabase client setup

#### Backend

* `src/routes` – route definitions for `/events`, `/admin`, `/signups`
* `src/index.ts` – main server file
* `src/supabase.ts` – Supabase client

---

## API Documentation 📘

See `API.md` in the backend repo for all endpoint descriptions, request/response formats, and authentication requirements.

---

## Access Control

* User roles are managed in Supabase (`users` table)
* Protected endpoints for staff only (create/update/delete events)

---

> Made with ❤️ for the Hevents Project
