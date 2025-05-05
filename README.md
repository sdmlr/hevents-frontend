# Hevents Platform

Hevents is a full-stack event listing and management platform. It allows users to browse events, sign up, and add them to their calendars. Staff members can create, update, and delete events via a dedicated admin dashboard.

---

## Test Account Access

**Email:** `test@hevents.com`
**Password:** `test1234`
**role:** `staff`

Use this account to:

* Browse and sign up for events
* Access the admin dashboard (`/admin`) ass a staff

---

## Features 🚀

### For Users:

* View all events 
* Filter by category
* Search for events by title or location
* Sign up for events
* Add events to Google Calendar
* Browse in a mobile-friendly interface

### For Staff:

* Login via email/password
* Create, edit, and delete events
* Responsive admin interface with Event management form

---

## Local Setup Instructions ⚙️

### Prerequisites:

* Node.js & npm
* Supabase account

### 1. Clone the Repo

```
# Frontend
git clone https://github.com/sdmlr/hevents-frontend
cd hevents-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in both frontend and backend:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

---

## Tech Stack

* React + TypeScript
* Tailwind CSS
* Vite
* React Router
* Supabase (auth + DB)

---

## File Structure 📂

Both repos follow conventional structures:

#### Frontend

* `src/pages` – route pages (Home, Calendar, Browse, Admin, etc.)
* `src/components` – shared UI components (e.g., Spinner, TopNav)
* `src/api.ts` – Axios base configuration
* `src/supabase.tsx` – Supabase client setup

---

> Made with ❤️ for the Hevents Project
