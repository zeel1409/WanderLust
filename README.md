# WanderLust

WanderLust is a full-stack property listing app inspired by Airbnb.  
The goal of this project is simple: build a clean, modern travel listing platform while practicing real-world full-stack workflows.

Users can explore listings, filter by category, open a listing with map and weather details, and post reviews. Hosts can create, edit, and delete their own listings.

## Stack

- Frontend: React (Vite), React Router, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Image hosting: Cloudinary
- Auth: JWT (stored in localStorage)
- Maps: Mapbox (`react-map-gl`)

## Features

- Browse all listings on the home page
- Filter listings by category (beach, mountains, city, etc.)
- View listing details with map and weather info
- User authentication (signup/login)
- Review system
- Host dashboard actions (create/update/delete own listings)

## Local setup

### 1) Prerequisites

Make sure you have:

- Node.js 18 or higher
- A MongoDB Atlas database
- A Cloudinary account
- (Optional) Mapbox token for maps
- (Optional) OpenWeather API key for weather widget

### 2) Clone and install

```bash
git clone <your-repo-url>
cd WanderLust
```

### 3) Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Start backend:

```bash
npm run dev
```

### 4) Frontend setup

In a new terminal:

```bash
cd frontend
npm install

Start frontend:

```bash
npm run dev
```

App URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Seed sample data

To prefill the database with demo listings:

```bash
cd backend
node seed.js
```

## Project structure

```text
WanderLust/
  backend/
    config/       # DB and Cloudinary config
    middleware/   # Auth middleware
    models/       # Mongoose schemas
    routes/       # Express routes
    server.js
    seed.js
  frontend/
    src/
      api/        # API client setup
      components/ # Shared UI components
      context/    # App contexts (auth, theme, wishlist, etc.)
      pages/      # Route pages
```

## Deployment

This repo is prepared for split deployment:

- Frontend -> Vercel
- Backend -> Render

Basic flow:

1. Deploy backend on Render and set backend environment variables.
2. Copy backend URL and set it as `VITE_API_URL` in frontend environment settings on Vercel.
3. Add your frontend URL to backend `CLIENT_URL` and CORS settings.
4. Redeploy both services.

## Known limitations

- Booking flow is not implemented yet (reserve button is placeholder)
- Signup does not include email verification
- Map requires a valid Mapbox token
- Weather widget requires a valid OpenWeather API key

## Contributing

Contributions are welcome.  
If you plan to make larger changes, open an issue first so we can align on scope before implementation.
