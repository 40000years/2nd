# 2nd - เว็บไซต์ขายของมือสอง

เว็บไซต์ e-commerce สำหรับขายของมือสองที่ครบครัน พร้อมระบบหลังบ้านที่แข็งแกร่ง

## 🏗️ **สถาปัตยกรรมระบบ**

```
2nd/
├── frontend/          # Next.js Frontend
├── backend/           # Node.js + Express API
├── database/          # Database scripts
└── docker-compose.yml # Docker configuration
```

## ✨ **คุณสมบัติหลัก**

### 🔐 **ระบบ Authentication**
- ✅ ระบบสมัครสมาชิก/ล็อกอิน
- ✅ JWT Token Authentication
- ✅ Role-based Authorization (Buyer/Seller/Admin)
- ✅ Password encryption ด้วย bcrypt

### 🛍️ **ระบบ E-commerce**
- ✅ จัดการสินค้า (CRUD)
- ✅ อัปโหลดรูปภาพหลายรูป
- ✅ ระบบค้นหาและกรองสินค้า
- ✅ ระบบตะกร้าสินค้า
- ✅ ระบบสั่งซื้อ
- ✅ ระบบรีวิวและคะแนน

### 🗄️ **ฐานข้อมูล**
- ✅ PostgreSQL Database
- ✅ Sequelize ORM
- ✅ Database relationships
- ✅ Data validation

### 🐳 **Docker Support**
- ✅ Containerized application
- ✅ Easy deployment
- ✅ Development environment

## 🛠️ **เทคโนโลยีที่ใช้**

### **Frontend**
- Next.js 14 + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

### **Backend**
- Node.js + Express
- PostgreSQL + Sequelize
- JWT Authentication
- Multer (File upload)
- bcryptjs (Password hashing)

### **DevOps**
- Docker + Docker Compose
- Environment variables
- CORS configuration

## 🚀 **การติดตั้งและรัน**

### **วิธีที่ 1: ใช้ Docker (แนะนำ)**

1. **Clone โปรเจค**
```bash
git clone <repository-url>
cd 2nd
```

2. **สร้างไฟล์ .env**
```bash
# Backend
cp backend/env.example backend/.env

# Frontend
cp frontend/env.example frontend/.env
```

3. **รันด้วย Docker Compose**
```bash
docker-compose up -d
```

4. **เข้าถึงแอปพลิเคชัน**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### **วิธีที่ 2: รันแยกส่วน**

#### **Backend**
```bash
cd backend
npm install
cp env.example .env
# แก้ไข .env file
npm run dev
```

#### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

#### **Database**
```bash
# ติดตั้ง PostgreSQL
# สร้าง database: second_hand_db
```

## 📁 **โครงสร้างโปรเจค**

### **Backend Structure**
```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   └── productController.js # Product management
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── upload.js        # File upload handling
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Product.js       # Product model
│   │   ├── Order.js         # Order model
│   │   └── index.js         # Model relationships
│   ├── routes/
│   │   ├── auth.js          # Auth routes
│   │   └── products.js      # Product routes
│   └── server.js            # Main server file
├── uploads/                 # Uploaded files
├── package.json
└── Dockerfile
```

### **Frontend Structure**
```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── package.json
└── Dockerfile
```

## 🔌 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - ล็อกอิน
- `GET /api/auth/profile` - ดูโปรไฟล์
- `PUT /api/auth/profile` - อัปเดตโปรไฟล์
- `PUT /api/auth/change-password` - เปลี่ยนรหัสผ่าน

### **Products**
- `GET /api/products` - ดูสินค้าทั้งหมด
- `GET /api/products/:id` - ดูสินค้าเดี่ยว
- `POST /api/products` - สร้างสินค้าใหม่
- `PUT /api/products/:id` - อัปเดตสินค้า
- `DELETE /api/products/:id` - ลบสินค้า
- `GET /api/products/user/my-products` - สินค้าของตัวเอง

## 🗄️ **Database Schema**

### **Users Table**
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- firstName, lastName (String)
- phone, location, bio (String)
- role (ENUM: buyer, seller, admin)
- rating, totalSales, totalPurchases (Number)
- isVerified (Boolean)

### **Products Table**
- id (UUID, Primary Key)
- name, description (String)
- price, originalPrice (Decimal)
- images (Array of Strings)
- category, condition (String/ENUM)
- tags (Array of Strings)
- sellerId (UUID, Foreign Key)
- isAvailable, views, likes (Boolean/Number)

### **Orders Table**
- id (UUID, Primary Key)
- orderNumber (String, Unique)
- buyerId, sellerId, productId (UUID, Foreign Keys)
- quantity, unitPrice, totalAmount (Number)
- status, paymentStatus (ENUM)
- shippingAddress (JSON)
- buyerRating, sellerRating (Number)

## 🔧 **การพัฒนา**

### **การเพิ่มฟีเจอร์ใหม่**
1. สร้าง Model ใน `backend/src/models/`
2. สร้าง Controller ใน `backend/src/controllers/`
3. สร้าง Routes ใน `backend/src/routes/`
4. อัปเดต `backend/src/server.js`

### **การทดสอบ API**
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","firstName":"Test","lastName":"User"}'
```

## 🐳 **Docker Commands**

```bash
# รันทั้งหมด
docker-compose up -d

# ดู logs
docker-compose logs -f

# หยุดการทำงาน
docker-compose down

# รีสตาร์ท
docker-compose restart

# ลบ volumes
docker-compose down -v
```

## 📱 **Responsive Design**

เว็บไซต์รองรับการแสดงผลบน:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔒 **Security Features**

- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ File upload restrictions
- ✅ Role-based access control

## 🚀 **การ Deploy**

### **Production Environment**
1. อัปเดต environment variables
2. Build Docker images
3. Deploy to cloud platform

### **Environment Variables**
```env
# Backend
NODE_ENV=production
JWT_SECRET=your-production-secret
DB_HOST=your-db-host
DB_PASSWORD=your-db-password

# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 🤝 **การมีส่วนร่วม**

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push ไปยัง branch
5. เปิด Pull Request

## 📄 **License**

MIT License - ดูไฟล์ [LICENSE](LICENSE) สำหรับรายละเอียด

## 📞 **ติดต่อ**

- **Email**: support@2nd.com
- **Phone**: 02-123-4567
- **Address**: กรุงเทพมหานคร, ประเทศไทย

---

สร้างด้วย ❤️ โดยทีม 2nd 