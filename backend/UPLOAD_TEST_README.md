# 🧪 คู่มือทดสอบระบบอัปโหลดรูปภาพ

## 📋 สิ่งที่ต้องทำก่อนทดสอบ

### 1. ตรวจสอบ Environment Variables
ตรวจสอบว่าไฟล์ `env.local` มีค่าต่างๆ ครบถ้วน:

```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=2nd_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cloudinary Configuration (ถ้าใช้)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. เริ่มต้นฐานข้อมูล
```bash
# เริ่ม PostgreSQL ด้วย Docker
docker-compose up -d

# หรือเริ่ม PostgreSQL แบบปกติ
# ตรวจสอบว่า PostgreSQL กำลังทำงานอยู่
```

### 3. ติดตั้ง Dependencies
```bash
cd backend
npm install
```

## 🚀 วิธีการทดสอบ

### ขั้นตอนที่ 1: เริ่มต้นเซิร์ฟเวอร์
```bash
cd backend
npm start
# หรือ
node src/server.js
```

เซิร์ฟเวอร์จะเริ่มทำงานที่ port 5001

### ขั้นตอนที่ 2: ทดสอบ API Endpoints

#### ทดสอบ Health Check
```bash
curl http://localhost:5001/health
```

#### ทดสอบ Products Route
```bash
curl http://localhost:5001/api/products/test
```

### ขั้นตอนที่ 3: ทดสอบการอัปโหลดรูปภาพ

#### วิธีที่ 1: ใช้ไฟล์ HTML Test
1. เปิดไฟล์ `test-upload.html` ในเบราว์เซอร์
2. กรอกข้อมูลสินค้า
3. เลือกรูปภาพ
4. กดปุ่ม "สร้างสินค้า"

**หมายเหตุ:** คุณต้องมี JWT token ที่ถูกต้องก่อน

#### วิธีที่ 2: ใช้ cURL
```bash
# สร้างสินค้าพร้อมรูปภาพ
curl -X POST http://localhost:5001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=สินค้าทดสอบ" \
  -F "description=รายละเอียดสินค้าทดสอบ" \
  -F "price=100.00" \
  -F "category=electronics" \
  -F "condition=good" \
  -F "image=@/path/to/your/image.jpg"
```

#### วิธีที่ 3: ใช้ Postman
1. สร้าง POST request ไปที่ `http://localhost:5001/api/products`
2. เพิ่ม Header: `Authorization: Bearer YOUR_JWT_TOKEN`
3. ใช้ form-data และเพิ่ม fields:
   - name: ชื่อสินค้า
   - description: รายละเอียด
   - price: ราคา
   - category: หมวดหมู่
   - condition: สภาพสินค้า
   - image: เลือกไฟล์รูปภาพ

## 🔑 การสร้าง JWT Token

### 1. สร้าง User ใหม่
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "ทดสอบ",
    "lastName": "ระบบ",
    "role": "seller"
  }'
```

### 2. Login เพื่อรับ Token
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

คัดลอก token จาก response และใช้ใน Authorization header

## 📁 โครงสร้างไฟล์รูปภาพ

รูปภาพจะถูกบันทึกในโฟลเดอร์ `uploads/` และสามารถเข้าถึงได้ผ่าน URL:
```
http://localhost:5001/uploads/filename.jpg
```

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. "No token provided"
- ตรวจสอบว่าได้ส่ง Authorization header
- ตรวจสอบว่า token ยังไม่หมดอายุ

#### 2. "Access denied. Seller role required"
- ตรวจสอบว่า user มี role เป็น "seller"
- ใช้ admin account หรือเปลี่ยน role ของ user

#### 3. "File too large"
- รูปภาพต้องมีขนาดไม่เกิน 5MB
- ตรวจสอบค่า `MAX_FILE_SIZE` ใน environment

#### 4. "Only image files are allowed"
- ตรวจสอบว่าไฟล์เป็นรูปภาพ (jpg, png, gif, webp)
- ตรวจสอบ MIME type ของไฟล์

#### 5. "Cannot connect to server"
- ตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงานที่ port 5001
- ตรวจสอบ firewall หรือ antivirus

### การ Debug

#### 1. ตรวจสอบ Logs
```bash
# ดู logs ของเซิร์ฟเวอร์
npm start

# หรือดู logs แบบ real-time
tail -f logs/server.log
```

#### 2. ตรวจสอบ Database
```bash
# เชื่อมต่อ PostgreSQL
psql -h localhost -U postgres -d 2nd_db

# ดูตาราง Products
SELECT * FROM "Products" ORDER BY "createdAt" DESC LIMIT 5;
```

#### 3. ตรวจสอบโฟลเดอร์ Uploads
```bash
# ดูไฟล์ในโฟลเดอร์ uploads
ls -la uploads/

# ตรวจสอบสิทธิ์การเขียน
ls -la uploads/ | head -5
```

## ✅ การทดสอบที่สมบูรณ์

ระบบจะทำงานได้สมบูรณ์เมื่อ:

1. ✅ เซิร์ฟเวอร์เริ่มต้นได้ที่ port 5001
2. ✅ เชื่อมต่อฐานข้อมูลได้
3. ✅ สามารถสร้าง user และ login ได้
4. ✅ สามารถอัปโหลดรูปภาพได้
5. ✅ รูปภาพถูกบันทึกในโฟลเดอร์ uploads
6. ✅ ข้อมูลสินค้าถูกบันทึกในฐานข้อมูล
7. ✅ สามารถดูรูปภาพผ่าน URL ได้

## 🔄 การทดสอบต่อเนื่อง

หลังจากแก้ไขปัญหาแล้ว ให้ทดสอบ:

1. อัปโหลดรูปภาพหลายขนาด
2. อัปโหลดรูปภาพหลายรูปแบบ (jpg, png, gif)
3. ทดสอบการสร้างสินค้าหลายชิ้น
4. ทดสอบการดูรายการสินค้า
5. ทดสอบการลบสินค้า

## 📞 การขอความช่วยเหลือ

หากยังมีปัญหา ให้ตรวจสอบ:

1. Logs ของเซิร์ฟเวอร์
2. Network tab ใน Developer Tools
3. Console ในเบราว์เซอร์
4. ตรวจสอบว่า dependencies ทั้งหมดถูกติดตั้งแล้ว
5. ตรวจสอบ environment variables
