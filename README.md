# ShopEase - E-Commerce Web Application

A modern, user-friendly full-stack e-commerce platform built with Next.js, Express, and MongoDB.

## Features

- **Customer Features:**
  - Browse and search products
  - Filter by category, price, and rating
  - Add to cart with persistent storage
  - Simple checkout flow
  - Order tracking
  - Product reviews and ratings

- **Admin Features:**
  - Dashboard with analytics
  - Add/Edit/Delete products
  - Manage inventory
  - View and update order status

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Edit with your MongoDB URI
   npm run seed          # Seed database with sample data
   npm run dev           # Start backend server
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev           # Start frontend development server
   ```

4. **Open browser:** http://localhost:3000

### Demo Accounts

- **User:** john@example.com / user123
- **Admin:** admin@shop.com / admin123

## Project Structure

```
E-Commerce Website/
├── backend/
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Database & seed utilities
│   │   └── server.js       # Express server entry
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/            # Next.js pages
    │   │   ├── (auth)/     # Login & Register
    │   │   ├── products/   # Product listing & details
    │   │   ├── cart/       # Shopping cart
    │   │   ├── checkout/   # Checkout flow
    │   │   ├── orders/     # Order history
    │   │   └── admin/      # Admin dashboard
    │   ├── components/     # Reusable components
    │   ├── context/        # React contexts (Auth, Cart, Theme)
    │   └── lib/            # API client
    └── package.json
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Render/Railway)
```bash
# Set environment variables in your hosting platform
# Deploy the backend folder
```

## License

MIT
