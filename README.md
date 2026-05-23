# DevPulse API

DevPulse is an internal tech issue and feature tracker backend. Team members can register, log in, create issues, view issues, and maintainers can update, delete, change status, and view system metrics.

## Live URL

https://devpulse-api-assignment2.onrender.com

---

## Features

- User Signup & Login
- JWT Authentication
- Role-based Authorization
- Contributor & Maintainer Roles
- Create, Read, Update, Delete Issues
- Update Issue Status
- PostgreSQL Database
- Metrics API
- Centralized Error Handling
- TypeScript Support

---
---

## Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=devpulse_secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- NeonDB
- JWT
- bcrypt
- Render

---
## API Endpoints

### Auth

- POST `/api/auth/signup`
- POST `/api/auth/login`

### Issues

- POST `/api/issues`
- GET `/api/issues`
- GET `/api/issues/:id`
- PATCH `/api/issues/:id`
- DELETE `/api/issues/:id`

### Metrics

- GET `/api/metrics`

---

## Database Schema

### users

- id
- name
- email
- password
- role
- created_at
- updated_at

### issues

- id
- title
- description
- type
- status
- reporter_id
- created_at
- updated_at
## Setup Instructions

```bash
npm install
npm run dev
