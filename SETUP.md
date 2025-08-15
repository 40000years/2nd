# 🚀 2nd E-commerce System Setup Guide

## 📋 Prerequisites

- Docker และ Docker Compose
- Node.js 18+ (สำหรับ development)
- PostgreSQL (ถ้าไม่ใช้ Docker)

## 🏗️ Quick Start

### 1. เริ่มต้นระบบด้วย Docker (แนะนำ)

```bash
# ให้สิทธิ์การรัน script
chmod +x start-system.sh

# เริ่มต้นระบบ
./start-system.sh
```

### 2. เริ่มต้นด้วย Docker Compose แบบปกติ

```bash
# Build และ start services
docker-compose up --build -d

# ดู logs
docker-compose logs -f

# หยุดระบบ
docker-compose down
```

## 🔧 Manual Setup

### Backend Setup

```bash
cd backend

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env จาก env.local
cp env.local .env

# แก้ไข .env ตามความต้องการ
# โดยเฉพาะ database connection

# รัน development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env.local
cp env.local .env.local

# รัน development server
npm run dev
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Database**: localhost:5432

## 🗄️ Database

ระบบใช้ PostgreSQL โดยมีตารางหลัก:

- **Users**: ข้อมูลผู้ใช้ (buyer, seller, admin)
- **Products**: ข้อมูลสินค้า
- **Orders**: ข้อมูลการสั่งซื้อ

## 🔐 Authentication

ระบบใช้ JWT tokens สำหรับ authentication:

1. **Register**: `/api/auth/register`
2. **Login**: `/api/auth/login`
3. **Profile**: `/api/auth/profile` (protected)

## 📦 API Endpoints

### Products
- `GET /api/products` - ดูสินค้าทั้งหมด
- `GET /api/products/:id` - ดูสินค้าเฉพาะ
- `POST /api/products` - เพิ่มสินค้า (seller only)
- `PUT /api/products/:id` - แก้ไขสินค้า (seller only)
- `DELETE /api/products/:id` - ลบสินค้า (seller only)

### Admin
- `GET /api/admin/users` - ดูผู้ใช้ทั้งหมด
- `GET /api/admin/products` - ดูสินค้าทั้งหมด
- `GET /api/admin/stats` - ดูสถิติระบบ

## 🐛 Troubleshooting

### Backend Error 500
1. ตรวจสอบ database connection
2. ตรวจสอบไฟล์ .env
3. ดู logs: `docker-compose logs backend`

### Frontend Connection Error
1. ตรวจสอบ API URL ใน .env.local
2. ตรวจสอบว่า backend กำลังรันอยู่
3. ตรวจสอบ CORS settings

### Database Connection Error
1. ตรวจสอบ PostgreSQL service
2. ตรวจสอบ credentials ใน .env
3. รัน `docker-compose logs postgres`

## 📝 Development

### Backend Development
```bash
cd backend
npm run dev  # nodemon with hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Next.js development server
```

### Database Changes
```bash
# Sync models
# ระบบจะ auto-sync เมื่อ start server
# หรือแก้ไขใน database.js
```

## 🚀 Production Deployment

1. แก้ไข environment variables
2. เปลี่ยน JWT_SECRET
3. ตั้งค่า CORS_ORIGIN
4. ใช้ production database
5. ตั้งค่า SSL/TLS

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ logs
2. ตรวจสอบ environment variables
3. ตรวจสอบ database connection
4. ตรวจสอบ network ports
