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
