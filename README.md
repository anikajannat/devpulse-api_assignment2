# DevPulse API

DevPulse is an internal tech issue and feature tracker backend. Team members can register, log in, create issues, view issues, and maintainers can update, delete, change status, and view system metrics.

## Live URL

Replace this after deployment:

```txt
https://your-devpulse-api-url.onrender.com
```

## Features

- User signup and login
- Password hashing with bcrypt
- JWT authentication
- Contributor and maintainer role-based authorization
- Create, read, update, delete issues
- Optional issue filtering by type and status
- Optional sorting by newest or oldest
- Maintainer-only status update
- Maintainer-only system metrics
- PostgreSQL with native `pg` driver
- Raw SQL using `pool.query()` only
- No ORM, no query builder, no SQL JOIN

## Tech Stack

- Node.js 24+
- TypeScript
- Express.js
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken
- http-status-codes
- cors
- dotenv

## Project Structure

```txt
src/
  config/
    db.ts
    env.ts
    initDb.ts
    schema.sql
  middleware/
    auth.ts
    errorHandler.ts
  modules/
    auth/
    issues/
    metrics/
  types/
  utils/
  app.ts
  server.ts
```

## Database Schema Summary

### users

| Field | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Required |
| email | VARCHAR(150) | Required, unique |
| password | TEXT | Hashed password, never returned |
| role | VARCHAR(20) | contributor or maintainer, default contributor |
| created_at | TIMESTAMPTZ | Auto generated |
| updated_at | TIMESTAMPTZ | Updated on edit |

### issues

| Field | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Required, max 150 chars |
| description | TEXT | Required, min 20 chars |
| type | VARCHAR(20) | bug or feature_request |
| status | VARCHAR(20) | open, in_progress, resolved |
| reporter_id | INTEGER | User id validated in app logic |
| created_at | TIMESTAMPTZ | Auto generated |
| updated_at | TIMESTAMPTZ | Updated on edit |

## Setup Steps for Beginners

### 1. Install Node.js

Install Node.js version 24 or higher.

Check version:

```bash
node -v
npm -v
```

### 2. Create PostgreSQL Database

Use NeonDB, Supabase, Railway PostgreSQL, or local PostgreSQL.

Copy your PostgreSQL connection string. It looks like this:

```txt
postgresql://username:password@host:5432/database?sslmode=require
```

### 3. Install Packages

```bash
npm install
```

### 4. Create `.env` File

Copy `.env.example` and rename it to `.env`.

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
copy .env.example .env
```

Then edit `.env`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

### 5. Run Project

```bash
npm run dev
```

Open browser:

```txt
http://localhost:5000
```

You should see:

```json
{
  "success": true,
  "message": "DevPulse API is running"
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |

### Issues

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/issues` | Authenticated contributor or maintainer |
| GET | `/api/issues?sort=newest&type=bug&status=open` | Public |
| GET | `/api/issues/:id` | Public |
| PATCH | `/api/issues/:id` | Maintainer any issue OR contributor own open issue |
| PATCH | `/api/issues/:id/status` | Maintainer only |
| DELETE | `/api/issues/:id` | Maintainer only |

### Metrics

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/metrics` | Maintainer only |

## Request Examples

### Signup

```http
POST /api/auth/signup
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

### Login

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

### Create Issue

Header:

```txt
Authorization: JWT_TOKEN_HERE
```

Body:

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

## Deployment Guide: Render + NeonDB

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/yourusername/devpulse.git
git push -u origin main
```

Try to make at least 10 meaningful commits while working.

### Step 2: Create NeonDB Database

1. Go to NeonDB.
2. Create a new project.
3. Copy the connection string.
4. Use it as `DATABASE_URL` in Render.

### Step 3: Deploy on Render

1. Create a new Web Service.
2. Connect your GitHub repo.
3. Set build command:

```bash
npm install && npm run build
```

4. Set start command:

```bash
npm start
```

5. Add environment variables:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_long_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
NODE_ENV=production
```

6. Deploy.

## Interview Video Suggestions

You need to answer any 2 questions in English. Easy topics:

1. What is `next()` in Express middleware?
2. What is database connection pooling in PostgreSQL?

Speak naturally for 3 to 5 minutes per answer. Do not read word-for-word.

## Final Submission Checklist

- Public GitHub repo link
- Public live backend URL
- Public interview video link
- Check all API endpoints in Postman
- Make sure `.env` is not uploaded to GitHub
