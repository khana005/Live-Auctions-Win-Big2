# Live Auction Web Application - Technical Specification

## Project Overview
- **Project Name**: BidVault - Live Auction Platform
- **Type**: Full-stack Real-time Web Application
- **Core Functionality**: Real-time live bidding auction platform with admin management and user dashboards
- **Target Users**: Auction enthusiasts, sellers, and administrators

## Tech Stack
### Frontend
- React.js with Vite
- Tailwind CSS
- Framer Motion (animations)
- Socket.io Client
- React Router v6
- Axios
- React Hot Toast
- React Countdown

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io
- Nodemailer
- Bcryptjs
- Cors
- Dotenv

### Database Schema

#### User Model
```
javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### Auction Model
```javascript
{
  title: String (required),
  description: String (required),
  image: String (required, URL),
  startingPrice: Number (required),
  currentPrice: Number (required),
  endTime: Date (required),
  createdBy: ObjectId (ref: User),
  status: String (enum: ['active', 'ended', 'cancelled'], default: 'active'),
  winner: ObjectId (ref: User, optional),
  bids: [{ type: ObjectId, ref: 'Bid' }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Bid Model
```
javascript
{
  auction: ObjectId (ref: Auction, required),
  user: ObjectId (ref: User, required),
  amount: Number (required),
  timestamp: Date (default: Date.now)
}
```

## API Endpoints (Minimum 7 Required)

### Authentication APIs
1. `POST /api/auth/register` - User registration
2. `POST /api/auth/login` - User login (returns JWT)
3. `POST /api/auth/forgot-password` - Request password reset
4. `POST /api/auth/reset-password` - Reset password with token

### Auction APIs
5. `GET /api/auctions` - Get all active auctions
6. `GET /api/auctions/:id` - Get single auction details
7. `POST /api/auctions` - Create auction (Admin only)
8. `PUT /api/auctions/:id` - Update auction (Admin only)
9. `DELETE /api/auctions/:id` - Delete auction (Admin only)

### Bid APIs
10. `POST /api/bids` - Place a bid
11. `GET /api/bids/auction/:auctionId` - Get bids for auction

### User APIs
12. `GET /api/users/profile` - Get user profile
13. `GET /api/users/my-bids` - Get user's bids
14. `GET /api/users/my-wins` - Get user's winning auctions
15. `GET /api/users/joined-auctions` - Get auctions user joined

### Admin APIs
16. `GET /api/admin/dashboard` - Admin dashboard stats
17. `GET /api/admin/users` - Get all users
18. `PUT /api/admin/users/:id/role` - Update user role

## UI/UX Specification

### Color Palette
- **Primary**: #6366f1 (Indigo-500)
- **Secondary**: #8b5cf6 (Violet-500)
- **Accent**: #f59e0b (Amber-500)
- **Background Dark**: #0f172a (Slate-900)
- **Background Secondary**: #1e293b (Slate-800)
- **Card Background**: rgba(30, 41, 59, 0.7) (Glass effect)
- **Text Primary**: #f8fafc (Slate-50)
- **Text Secondary**: #94a3b8 (Slate-400)
- **Success**: #10b981 (Emerald-500)
- **Error**: #ef4444 (Red-500)
- **Warning**: #f59e0b (Amber-500)

### Typography
- **Primary Font**: "Outfit" (Google Fonts) - Modern geometric sans-serif
- **Secondary Font**: "Space Mono" (Google Fonts) - For numbers/prices

### Layout Structure
1. **Navbar**: Fixed top, glassmorphism, logo + nav links + auth buttons
2. **Hero Section**: Full-width gradient banner with featured auction
3. **Auction Grid**: Responsive grid (1/2/3/4 columns)
4. **Auction Card**: Glassmorphism card with image, timer, current bid
5. **Footer**: Dark with links and social icons

### Pages Required
1. **Landing Page** - Hero + Featured Auctions + How it works
2. **Login Page** - Animated form with glassmorphism
3. **Register Page** - Animated form with glassmorphism
4. **Forgot Password Page** - Email input form
5. **Reset Password Page** - New password form
6. **Auctions Page** - Grid of all active auctions with filters
7. **Auction Detail Page** - Full auction info + bid form + live bids
8. **User Dashboard** - My bids, My wins, Joined auctions
9. **Admin Dashboard** - Stats, Manage users, Manage auctions

### Animations (Framer Motion)
- Page transitions: Fade + slide
- Card hover: Scale + glow
- Bid placed: Pulse animation + highlight
- Timer: Countdown flip animation
- Notifications: Slide in from top-right
- Loading: Skeleton shimmer

## Minimum NPM Packages Required

### Backend Packages
- express ^4.18.2
- mongoose ^8.0.0
- jsonwebtoken ^9.0.2
- bcryptjs ^2.4.3
- socket.io ^4.7.2
- nodemailer ^6.9.7
- cors ^2.8.5
- dotenv ^16.3.1
- express-validator ^7.0.1

### Frontend Packages
- react ^18.2.0
- react-dom ^18.2.0
- react-router-dom ^6.20.0
- axios ^1.6.2
- socket.io-client ^4.7.2
- framer-motion ^10.16.5
- tailwindcss ^3.3.5
- react-hot-toast ^2.4.1
- react-countdown ^2.3.5

## Real-time Features (Socket.io)

### Events
- `connection` - New client connection
- `join_auction` - User joins auction room
- `leave_auction` - User leaves auction room
- `new_bid` - Broadcast new bid to all in room
- `auction_ended` - Broadcast auction end + winner
- `notification` - Send notification to user

## Security Requirements
1. Password hashing with bcrypt (10 rounds)
2. JWT tokens with 24h expiration
3. Protected routes with auth middleware
4. Admin-only routes with role check
5. Environment variables for all secrets
6. Input validation on all endpoints
7. CORS configuration

## Acceptance Criteria
1. ✅ User can register and login
2. ✅ User can reset forgot password via email
3. ✅ Admin can create/edit/delete auctions
4. ✅ Users can view all auctions
5. ✅ Users can place bids in real-time
6. ✅ Bids update live for all viewers
7. ✅ Auction ends automatically when timer expires
8. ✅ Winner is selected automatically
9. ✅ Users receive notifications for wins
10. ✅ Dashboard shows user's bids/wins/joined
11. ✅ Admin dashboard shows full stats
12. ✅ UI is responsive and animated
13. ✅ All 7+ APIs are functional

## Folder Structure
```
/live-auction-app
├── /client (React Frontend)
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── /context
│   │   ├── /hooks
│   │   ├── /services
│   │   └── /utils
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── /server (Node.js Backend)
│   ├── /config
│   ├── /controllers
│   ├── /middleware
│   ├── /models
│   ├── /routes
│   ├── /utils
│   ├── /seeds
│   ├── server.js
│   └── package.json
├── README.md
└── SPEC.md
