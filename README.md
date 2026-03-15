# 🌍 WanderLust

A full-stack rental platform built with **React**, **Node.js**, **Express**, and **MongoDB** — inspired by Airbnb.

## ✨ Features

- 🔐 User Authentication (JWT)
- 🏡 Full Listing CRUD with Cloudinary Image Upload
- ⭐ Reviews & Ratings
- ❤️ Wishlist (persisted in localStorage)
- 🌙 Dark Mode
- 🗺️ Map View (react-map-gl)
- 🌤️ Weather Widget per listing
- 🔍 Search & Category Filtering
- 📄 Pagination
- 🧊 40 Demo Listings (shown when DB is empty)

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, React Router v6 |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Storage | Cloudinary |
| Auth | JWT + bcryptjs |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in your credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_URL
npm run dev
```

## 📁 Project Structure
```
WanderLust/
├── backend/
│   ├── config/        # Cloudinary & DB config
│   ├── middleware/    # Auth middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── server.js
└── frontend/
    └── src/
        ├── api/       # Axios instance
        ├── components/
        ├── context/   # Auth, DarkMode, Wishlist
        └── pages/
```

## 🌐 Live Demo
- Frontend: [Vercel link here]
- Backend API: [Render link here]

## 📸 Screenshots
*Add screenshots here after deployment*

---
Made with ❤️ in India
