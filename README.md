# BidVault - Live Auction Web Application

A full-stack real-time live auction platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, Socket.io for real-time bidding, and a modern, premium UI.

![BidVault](https://via.placeholder.com/1200x600/1e293b/6366f1?text=BidVault+Live+Auction)

## 🚀 Features

### Core Features
- ✅ User Registration & Login with JWT authentication
- ✅ Forgot Password functionality (email token-based reset)
- ✅ Role-based access control (Admin & User)
- ✅ Create Auction (Admin only)
- ✅ Live Bidding system with real-time updates
- ✅ Auction Timer countdown (auto-close when time ends)
- ✅ Automatic Winner Selection
- ✅ Winner Notification system
- ✅ User Dashboard (My bids, Wins, Joined auctions)
- ✅ Admin Dashboard (Manage users, auctions, bids)

### Technical Features
- Real-time bidding with Socket.io
- RESTful API design
- JWT Authentication
- MongoDB with Mongoose ORM
- Input validation
- Error handling middleware

## 📋 Requirements

### Minimum 7 APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auctions` - Get all auctions
- `POST /api/auctions` - Create auction
- `POST /api/bids` - Place a bid
- `GET /api/users/profile` - Get user profile
- `GET /api/admin/dashboard` - Admin dashboard

### Minimum 6 NPM Packages (Backend)
- express
- mongoose
- jsonwebtoken
- bcryptjs
- socket.io
- nodemailer
- cors
- dotenv
- express-validator

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Nodemailer

### Frontend
- React.js with Vite
- Tailwind CSS
- Framer Motion (animations)
- Socket.io Client
- React Router v6
- Axios
- React Hot Toast

## 📁 Project Structure

```
live-auction-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── services/    # API & Socket services
│   │   └── index.css    # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js Backend
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utilities
│   ├── seeds/           # Seed data
│   ├── server.js        # Entry point
│   └── package.json
├── README.md
└── SPEC.md              # Technical specification
```

## ⚡ Quick Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```
bash
git clone <repository-url>
cd live-auction-app
```

2. **Install Backend Dependencies**
```
bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```
bash
cd ../client
npm install
```

4. **Configure Environment Variables**

Create `server/.env`:
```
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bidvault
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=24h
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@bidvault.com
CLIENT_URL=http://localhost:5173
```

5. **Run MongoDB**
```
bash
# Local MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env with your Atlas connection string
```

6. **Seed Database (Optional)**
```
bash
cd server
npm run seed
```

7. **Start Development Servers**

Terminal 1 (Backend):
```
bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```
bash
cd client
npm run dev
```

8. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Demo Credentials

After running the seed script:
- **Admin**: admin@bidvault.com / admin123
- **User**: john@bidvault.com / john123

## 🎨 UI Features

- Dark modern gradient theme
- Glassmorphism cards
- Smooth animations (Framer Motion)
- Live bid highlight effect
- Animated countdown timer
- Beautiful responsive navbar
- Hero section with auction banner
- Attractive login/register pages
- Toast notifications for bids and winner alerts
- Fully responsive for mobile and desktop

## 🔒 Security

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Role-based access control
- Input validation
- Environment variables for secrets
- CORS configuration

## 📱 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password | Reset password |

### Auctions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/auctions | Get all auctions |
| GET | /api/auctions/:id | Get single auction |
| POST | /api/auctions | Create auction (Admin) |
| PUT | /api/auctions/:id | Update auction (Admin) |
| DELETE | /api/auctions/:id | Delete auction (Admin) |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bids | Place a bid |
| GET | /api/bids/auction/:id | Get auction bids |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/profile | Get user profile |
| GET | /api/users/my-bids | Get user's bids |
| GET | /api/users/my-wins | Get user's wins |
| GET | /api/users/joined-auctions | Get joined auctions |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/users | Get all users |
| PUT | /api/admin/users/:id/role | Update user role |

## 🌐 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Build the React app: `cd client && npm run build`
2. Deploy the `dist` folder

## 📄 License

MIT License

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- React.js
- Node.js
- MongoDB
- Socket.io
- Framer Motion
- Tailwind CSS
