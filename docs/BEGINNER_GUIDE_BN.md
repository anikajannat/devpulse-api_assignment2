# Beginner Guide: DevPulse Assignment kivabe run korba

## Step 1: ZIP unzip koro

ZIP file unzip kore folder open koro:

```txt
devpulse
```

VS Code diye ei folder open koro.

## Step 2: Terminal open koro

VS Code er top menu theke:

```txt
Terminal → New Terminal
```

## Step 3: Package install koro

Terminal e likho:

```bash
npm install
```

## Step 4: Database create koro

Easy way: NeonDB use koro.

1. NeonDB website e account koro.
2. New Project create koro.
3. PostgreSQL connection string copy koro.
4. Connection string ta `.env` file e bosate hobe.

## Step 5: `.env` file create koro

Project folder e `.env.example` file ache.
Eta copy kore `.env` name dao.

Windows PowerShell command:

```powershell
copy .env.example .env
```

Then `.env` file open kore ei value gula set koro:

```env
PORT=5000
DATABASE_URL=tomar_neondb_connection_string
JWT_SECRET=amar_secret_key_123456789
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

## Step 6: Project run koro

```bash
npm run dev
```

Browser e open koro:

```txt
http://localhost:5000
```

Output dekhabe:

```json
{
  "success": true,
  "message": "DevPulse API is running"
}
```

## Step 7: Postman diye test koro

### Signup

Method: POST

URL:

```txt
http://localhost:5000/api/auth/signup
```

Body → raw → JSON:

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

### Maintainer signup

```json
{
  "name": "Admin User",
  "email": "admin@devpulse.com",
  "password": "securePassword123",
  "role": "maintainer"
}
```

### Login

URL:

```txt
http://localhost:5000/api/auth/login
```

Body:

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

Login korle token paba. Token copy koro.

### Create issue

URL:

```txt
http://localhost:5000/api/issues
```

Headers:

```txt
Authorization: paste_token_here
```

Body:

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

### Get all issues

```txt
GET http://localhost:5000/api/issues?sort=newest
```

### Get single issue

```txt
GET http://localhost:5000/api/issues/1
```

### Update issue

```txt
PATCH http://localhost:5000/api/issues/1
```

Headers:

```txt
Authorization: paste_token_here
```

Body:

```json
{
  "title": "Updated: Database pool exhaustion fix needed",
  "description": "Updated description with reproduction steps...",
  "type": "bug"
}
```

### Change status: maintainer only

```txt
PATCH http://localhost:5000/api/issues/1/status
```

Headers:

```txt
Authorization: maintainer_token_here
```

Body:

```json
{
  "status": "in_progress"
}
```

### Delete issue: maintainer only

```txt
DELETE http://localhost:5000/api/issues/1
```

Headers:

```txt
Authorization: maintainer_token_here
```

## GitHub upload

```bash
git init
git add .
git commit -m "setup devpulse project"
git branch -M main
git remote add origin https://github.com/yourusername/devpulse.git
git push -u origin main
```

## Render deploy

1. Render e jao.
2. New Web Service select koro.
3. GitHub repo connect koro.
4. Build command:

```bash
npm install && npm run build
```

5. Start command:

```bash
npm start
```

6. Environment variables add koro.
7. Deploy click koro.
