# WanderLust

A property listing and booking web app built with React and Node.js. Think Airbnb, but for learning full-stack development.

---

## What this project does

Users can browse property listings, filter by category (beach, mountains, city etc.), view listing details with a map and weather info, write reviews, and hosts can add/edit/delete their own listings.

## Tech used

- **Frontend**: React (Vite), React Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Images**: Cloudinary
- **Auth**: JWT tokens stored in localStorage
- **Map**: react-map-gl (Mapbox)

## Running locally

You need Node.js 18+ and accounts on MongoDB Atlas and Cloudinary.

**Backend:**
```
cd backend
npm install
cp .env.example .env
# fill in your MongoDB URI, Cloudinary keys, JWT secret
npm run dev
```

**Frontend:**
```
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL=http://localhost:5000/api
npm run dev
```

The frontend runs on port 5173, backend on 5000.

## Seeding the database

```
cd backend
node seed.js
```

This adds some sample listings so the home page doesn't look empty.

## Project layout

```
WanderLust/
  backend/
    config/       - db and cloudinary setup
    middleware/   - JWT auth check
    models/       - mongoose schemas
    routes/       - express routes
    server.js
    seed.js
  frontend/
    src/
      api/        - axios setup
      components/ - Navbar, PropertyCard etc
      context/    - auth, dark mode, wishlist
      pages/      - Home, Login, ListingDetail etc
```

## Known issues / limitations

- Booking is not implemented yet (reserve button shows a "coming soon" toast)
- No email verification on signup
- Map won't work without a Mapbox token in the env file
- Weather widget uses OpenWeatherMap, also needs an API key

## Environment variables

Backend `.env`:
```
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
PORT=5000
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=
VITE_WEATHER_API_KEY=
```

## Deployment

- Frontend: Vercel (vercel.json is already set up)
- Backend: Render (render.yaml is already set up)
