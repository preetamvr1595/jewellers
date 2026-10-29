# MGS Jewellerys - Project Documentation

## Overview

MGS Jewellerys is a dual-application project consisting of:
- **Public Website**: Static HTML pages showcasing jewellery collections
- **Admin Dashboard**: React-based CMS for managing products, collections, offers, and rates

## Tech Stack

### Frontend (Admin)
- React 18 with React Router
- Vite (build tool)
- Tailwind CSS
- Axios (HTTP client)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer (file uploads)

## Project Structure

```
MGS-Jewellary-themed/
├── frontend/              # Public customer storefront (HTML, CSS, JS, Assets)
│   ├── index.html         # Public home page
│   ├── collections.html   # Public collections page
│   ├── offers.html        # Public offers page
│   ├── heritage.html      # Public heritage page
│   ├── calculator.html    # Public gold calculator
│   ├── global.css         # Global luxury styles
│   ├── index.css          # Homepage styles
│   ├── global.js          # Live rates & navigation logic
│   ├── index.js           # Homepage dynamic showcase logic
│   ├── sw.js              # Service Worker (PWA offline caching)
│   ├── manifest.json      # Web App Manifest
│   └── assets/            # High-res jewelry photography & branding
├── admin/                 # Admin CMS dashboard (React 18 + Vite + Tailwind)
│   ├── src/
│   │   ├── components/    # Reusable UI & modal components
│   │   ├── pages/         # Dashboard pages (Products, Offers, Rates, etc.)
│   │   ├── services/      # Axios API connector
│   │   ├── layouts/       # Dashboard shell & sidebar
│   │   ├── App.jsx        # Route definitions
│   │   └── main.jsx       # React application entry
│   └── dist/              # Production compiled assets
├── backend/               # Express REST API Server
│   ├── src/
│   │   ├── controllers/   # Route controllers (auth, products, offers, rates)
│   │   ├── middleware/    # Auth, security, and logging middleware
│   │   ├── models/        # Mongoose data schemas
│   │   ├── routes/        # Express API endpoints
│   │   └── storage.js     # Unified data store (JSON + MongoDB Atlas sync)
│   ├── scripts/           # verifyDb.js, exportBackup.js, seed scripts
│   ├── uploads/           # Uploaded assets
│   ├── data.json          # Local persistence database
│   └── server.js          # Express server entry point
├── docs/                  # API documentation (OpenAPI 3.0)
└── CLAUDE.md              # Project documentation
```

## Running the Project

### Start Backend Server
```bash
cd backend
npm start          # Production
npm run dev        # Development (with nodemon)
```

### Start Admin Dashboard (Development)
```bash
cd admin
npm run dev        # Runs on http://localhost:5173
```

### Build Admin for Production
```bash
cd admin
npm run build      # Output to admin/dist/
```

### Start Public Storefront Only
```bash
npx http-server frontend -p 8000
```
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Collections
- `GET /api/settings/collections` - List collections
- `POST /api/settings/collections` - Create collection
- `PUT /api/settings/collections/:id` - Update collection

### Offers
- `GET /api/offers` - List active offers
- `POST /api/offers` - Create offer
- `PUT /api/offers/:id` - Update offer

### Rates
- `GET /api/rates` - Get gold/silver rates
- `PUT /api/rates` - Update rates

### Upload
- `POST /api/upload` - Upload image file

## Models

### Product
- name, description, price, category, images, inStock

### Collection
- name, description, image, products[]

### Offer
- title, description, discount, validUntil, active

### User
- username, password (hashed)

### Setting
- key, value (for site settings)