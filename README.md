# 🔐 Secure Student Management System

A full-stack secure CRUD application built using React and Node.js, implementing OAuth 2.0 authentication and Hybrid Encryption (RSA + AES-256-GCM) for protected data communication.

---

## 🚀 Project Overview

This application allows secure management of student records (Create, Read, Update, Delete).

All sensitive data (CREATE & UPDATE requests) is encrypted on the frontend using AES-256-GCM and securely transmitted by encrypting the AES key with RSA-OAEP.

The backend validates OAuth JWT tokens and decrypts payloads before storing them in MongoDB.

---

## 🏗 Architecture

### 🔹 Frontend (React + Vite)

- Authenticates using OAuth Client Credentials
- Fetches RSA Public Key from backend
- Encrypts payload using:
  - AES-256-GCM (data encryption)
  - RSA-OAEP (AES key encryption)
- Uses Axios interceptors to attach JWT automatically
- Modular component-based structure

### 🔹 Backend (Node.js + Express)

- `/token` endpoint for OAuth client credentials flow
- `/public-key` endpoint to expose RSA public key
- JWT Authentication Middleware
- Decryption Middleware (Hybrid encryption handling)
- MongoDB (Atlas) for data persistence
- Persistent RSA keys stored in `/keys`
- Environment-based configuration using `.env`

### 🔐 Security Flow

1. Frontend requests JWT via `/token`
2. Backend verifies client credentials and returns JWT
3. Frontend fetches RSA public key
4. Student data encrypted using AES-256-GCM
5. AES key encrypted using RSA-OAEP
6. Backend:
   - Verifies JWT
   - Decrypts AES key
   - Decrypts student data
   - Stores validated data in MongoDB

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Axios
- Web Crypto API

### Backend
- Node.js
- Express
- MongoDB (Atlas)
- JWT (jsonwebtoken)
- Crypto (RSA + AES-GCM)
- dotenv

---

## 📂 Project Structure

```bash

Student-Management-System/
│
├── backend/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── keys/
│ ├── server.js
│ └── .env (not committed)
│
├── frontend/
│ ├── components/
│ ├── api/
│ ├── utils/
│ └── App.jsx
│
└── README.md

```
---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/Student-Management-System.git
cd Student-Management-System

2️⃣ Backend Setup
cd backend
npm install


Create .env file inside backend:

CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
PORT=5000


Generate RSA keys (if not already generated):

node generateKeys.js


Start backend:

node server.js

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

```
---

✅ Features

Secure OAuth 2.0 Authentication

Hybrid Encryption (RSA + AES-256-GCM)

Persistent RSA Key Management

Encrypted CREATE & UPDATE operations

Unique Student ID validation

Proper error handling (duplicate detection)

Modular frontend architecture

Environment-based configuration

---

👨‍💻 Author

Kuldeep Yadav
Secure Full-Stack Developer
