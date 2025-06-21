# 🌟 Solo Sparks - Personal Growth Quest System

A self-care and reflection tracking app where users log reflections, earn Spark Points, and claim rewards. Built using React, Node.js, PostgreSQL, Docker, and Cloudinary.

---

## ✨ Features

- User registration and login (JWT Auth)
- Submit reflections (text, photo, audio)
- Spark Points system
- Claimable rewards
- Daily quest support

---

## 🚀 Quickstart Guide

### ⚡ Prerequisites

- Node.js (v18+)
- Docker (with Docker Compose)
- Cloudinary API credentials (for file uploads)

---

## ⚙️ 1. Setup

```bash
git clone https://github.com/yourusername/solo-sparks.git
cd solo-sparks
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 🛠️ 2. Environment Variables

### Backend `.env`

```
PORT=5000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Make sure you have a Cloudinary account.

---

## 🚧 3. Start Database via Docker

```bash
docker-compose up -d
```

This creates a PostgreSQL instance at `localhost:5432`, with database `solo_sparks`.

---

## 🔨 4. Create Tables and Seed Data

```bash
cd backend
psql -h localhost -p 5432 -U postgres -d solo_sparks -f db/init.sql
```

Password is defined in `docker-compose.yml` (default: `postgres`).

#### Optional: Seed Example Data

```sql
-- quests\INSERT INTO quests (title, description, tags, frequency) VALUES
('Gratitude Log', 'Write 3 things you are grateful for', ARRAY['Peace'], 'daily');

-- rewards
INSERT INTO rewards (title, description, cost) VALUES
('Meditation Audio', '10-min relaxing track', 10);
```

---

## 🌐 5. Run App

### Backend

```bash
cd backend
npm start
# Runs at http://localhost:5000
```

### Frontend

```bash
cd frontend
npm start
# Runs at http://localhost:3000
```

---

## 📆 API Summary

| Route                   | Method | Description          |
| ----------------------- | ------ | -------------------- |
| /api/auth/register      | POST   | Register new user    |
| /api/auth/login         | POST   | Login and get JWT    |
| /api/quests/daily       | GET    | Get today's quest    |
| /api/reflections/submit | POST   | Submit a reflection  |
| /api/reflections/me     | GET    | Get user reflections |
| /api/points/me          | GET    | View earned points   |
| /api/rewards            | GET    | List all rewards     |
| /api/rewards/claim      | POST   | Claim a reward       |

---

## 🧳 Reset Database (optional)

```bash
psql -h localhost -p 5432 -U postgres -d solo_sparks
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q
psql -h localhost -p 5432 -U postgres -d solo_sparks -f db/init.sql
```

---

## 🎓 Created By

**Saurav Wankhade** – 2025

