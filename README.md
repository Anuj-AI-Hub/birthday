# Email Spam Prediction App

This project is a full-stack email spam prediction system with:
- A Node.js backend API that trains a Naive Bayes text model
- A React frontend for submitting email subject/body and viewing predictions
- Admin login to view stored submission history
- A simple JSON store for saving prediction requests

## Project structure

- `backend/`: Express API, authentication, prediction model, submission storage
- `frontend/`: Vite + React UI

## Setup

### 1. Backend

```powershell
cd backend
npm install
copy .env.example .env
# optionally update ADMIN_USER, ADMIN_PASS, JWT_SECRET
npm run dev
```

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

### 3. Use the app

- Open the frontend URL shown by Vite (usually `http://localhost:3000`)
- Use the prediction form to classify email text as spam or ham
- Login as admin using credentials from `backend/.env` to access the admin panel

## Default admin credentials

- Username: `admin`
- Password: `password123`

> Change these values in `backend/.env` before deploying.

## Deploying to Vercel (fix NOT_FOUND error)

If you deploy the repo as a monorepo, Vercel may not detect the `frontend` build root automatically, causing a `404 NOT_FOUND` page. This repo includes `vercel.json` configured to build the frontend package and serve SPA routes.

Steps to deploy correctly on Vercel:

1. In the Vercel project settings, set the Git repository to this repo.
2. Ensure the Root Directory is left empty (we use `vercel.json`), or set it to `/`.
3. Vercel will run the build defined in `vercel.json` which points to `frontend/package.json` and runs `npm run build`.
4. After deployment, the frontend will be served as a static SPA and rewrite unknown routes to `index.html`.

If you host the backend separately (recommended for the Express server), update `frontend/src/App.jsx` `API_URL` to point to your backend deployment URL.

