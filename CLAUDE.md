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
├── index.html              # Public home page
├── collections.html        # Public collections page
├── offers.html             # Public offers page
├── heritage.html           # Public heritage page
├── calculator.html         # Public gold calculator
├── client/                 # Admin dashboard (React)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── layouts/        # Layout components
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   └── dist/               # Built admin (served by server)
├── server/                 # Express API server
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── uploads/           # Uploaded files
│   └── index.js           # Server entry
├── assets/                # Public site images
└── CLAUDE.md              # This file
```

## Running the Project

### Start Backend Server
```bash
cd server
npm start          # Production
npm run dev        # Development (with nodemon)
```

### Start Admin Dashboard (Development)
```bash
cd client
npm run dev        # Runs on http://localhost:5173
```

### Build Admin for Production
```bash
cd client
npm run build      # Output to client/dist/
```

### Start Public Site Server
```bash
npm run dev        # Serves static HTML on port 8000
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