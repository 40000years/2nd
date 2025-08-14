# 2nd Backend API

Backend API สำหรับเว็บไซต์ขายของมือสอง "2nd" ที่สร้างด้วย Node.js, Express, และ PostgreSQL

## 🚀 Features

- **User Authentication**: ระบบสมัครสมาชิกและล็อกอิน
- **Product Management**: จัดการสินค้า (สร้าง, อ่าน, อัปเดต, ลบ)
- **Database**: PostgreSQL กับ Sequelize ORM
- **Security**: JWT authentication, password hashing
- **File Upload**: รองรับการอัปโหลดรูปภาพ
- **Docker**: Containerized application

## 🛠️ Technologies

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── productController.js  # Product management logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── upload.js            # File upload middleware
│   ├── models/
│   │   ├── index.js             # Model associations
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   └── Order.js             # Order model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── products.js          # Product routes
│   └── server.js                # Main server file
├── uploads/                      # File upload directory
├── Dockerfile                    # Docker configuration
├── package.json                  # Dependencies
└── .env                         # Environment variables
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 2nd/backend
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   docker compose up -d
   ```

4. **Access the API**
   - API Base URL: `http://localhost:5001`
   - Health Check: `http://localhost:5001/health`

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - ล็อกอิน
- `GET /api/auth/profile` - ดูข้อมูลโปรไฟล์ (ต้องมี token)

### Products

- `GET /api/products` - ดึงสินค้าทั้งหมด
- `GET /api/products/:id` - ดึงสินค้าตาม ID
- `POST /api/products` - สร้างสินค้าใหม่ (ต้องมี token)
- `GET /api/products/user/my-products` - ดึงสินค้าของผู้ใช้ (ต้องมี token)

### Health Check

- `GET /health` - ตรวจสอบสถานะเซิร์ฟเวอร์

## 🔐 Authentication

ระบบใช้ JWT (JSON Web Tokens) สำหรับการยืนยันตัวตน

### Request Headers
```
Authorization: Bearer <jwt_token>
```

### Token Payload
```json
{
  "userId": "user-uuid",
  "email": "user@example.com",
  "role": "buyer|seller|admin"
}
```

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `role` (Enum: buyer, seller, admin)
- `rating` (Decimal)
- `location` (String)
- `createdAt`, `updatedAt` (Timestamps)

### Products Table
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `price` (Decimal)
- `category` (String)
- `condition` (Enum: excellent, good, fair, poor)
- `location` (String)
- `sellerId` (UUID, Foreign Key to Users)
- `images` (Array of Strings)
- `views`, `likes` (Integer)
- `createdAt`, `updatedAt` (Timestamps)

### Orders Table
- `id` (UUID, Primary Key)
- `orderNumber` (String, Unique)
- `buyerId` (UUID, Foreign Key to Users)
- `sellerId` (UUID, Foreign Key to Users)
- `productId` (UUID, Foreign Key to Products)
- `quantity` (Integer)
- `status` (Enum: pending, confirmed, shipped, delivered, cancelled)
- `totalAmount` (Decimal)
- `shippingAddress` (Text)
- `createdAt`, `updatedAt` (Timestamps)

## 🔧 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=second_hand_db
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild and restart
docker compose up -d --build

# Access PostgreSQL
docker compose exec postgres psql -U postgres -d second_hand_db
```

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Product Creation
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 12 Pro",
    "description": "iPhone 12 Pro สภาพดี",
    "price": 15000,
    "category": "electronics",
    "condition": "good",
    "location": "กรุงเทพมหานคร"
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:5001 | xargs kill -9
   ```

2. **Database connection failed**
   - ตรวจสอบว่า PostgreSQL container ทำงานอยู่
   - ตรวจสอบ environment variables

3. **JWT token invalid**
   - ตรวจสอบ JWT_SECRET ใน .env
   - ตรวจสอบ token expiration

4. **File upload failed**
   - ตรวจสอบ uploads directory permissions
   - ตรวจสอบ MAX_FILE_SIZE configuration

## 📝 Development Guidelines

- ใช้ async/await สำหรับ database operations
- ใช้ try-catch สำหรับ error handling
- ตรวจสอบ input validation
- ใช้ proper HTTP status codes
- เขียน logs สำหรับ debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 