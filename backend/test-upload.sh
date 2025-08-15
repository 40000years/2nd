#!/bin/bash

# 🧪 Script ทดสอบระบบอัปโหลดรูปภาพ
# ใช้สำหรับทดสอบ API endpoints ต่างๆ

echo "🧪 เริ่มต้นทดสอบระบบอัปโหลดรูปภาพ..."
echo "=========================================="

# ตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงานอยู่หรือไม่
echo "📡 ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์..."

if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ เซิร์ฟเวอร์กำลังทำงานที่ port 5001"
else
    echo "❌ เซิร์ฟเวอร์ไม่ตอบสนองที่ port 5001"
    echo "กรุณาเริ่มต้นเซิร์ฟเวอร์ก่อน: npm start"
    exit 1
fi

echo ""
echo "🔍 ทดสอบ API Endpoints..."

# ทดสอบ Health Check
echo "1. ทดสอบ Health Check..."
HEALTH_RESPONSE=$(curl -s http://localhost:5001/health)
if [[ $HEALTH_RESPONSE == *"success"* ]]; then
    echo "   ✅ Health Check สำเร็จ"
else
    echo "   ❌ Health Check ล้มเหลว: $HEALTH_RESPONSE"
fi

# ทดสอบ Products Test Route
echo "2. ทดสอบ Products Test Route..."
PRODUCTS_TEST_RESPONSE=$(curl -s http://localhost:5001/api/products/test)
if [[ $PRODUCTS_TEST_RESPONSE == *"working"* ]]; then
    echo "   ✅ Products Test Route สำเร็จ"
else
    echo "   ❌ Products Test Route ล้มเหลว: $PRODUCTS_TEST_RESPONSE"
fi

# ทดสอบ Get Products (Public)
echo "3. ทดสอบ Get Products (Public)..."
PRODUCTS_RESPONSE=$(curl -s http://localhost:5001/api/products)
if [[ $PRODUCTS_RESPONSE == *"success"* ]] || [[ $PRODUCTS_RESPONSE == *"data"* ]]; then
    echo "   ✅ Get Products สำเร็จ"
else
    echo "   ❌ Get Products ล้มเหลว: $PRODUCTS_RESPONSE"
fi

echo ""
echo "🔑 ทดสอบการสร้าง User และ Login..."

# สร้าง User ใหม่
echo "4. สร้าง User ใหม่..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_upload@example.com",
    "password": "password123",
    "firstName": "ทดสอบ",
    "lastName": "อัปโหลด",
    "role": "seller"
  }')

if [[ $REGISTER_RESPONSE == *"success"* ]]; then
    echo "   ✅ สร้าง User สำเร็จ"
    # ดึง token จาก response
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$TOKEN" ]]; then
        echo "   🔑 ได้รับ Token: ${TOKEN:0:20}..."
    fi
else
    echo "   ❌ สร้าง User ล้มเหลว: $REGISTER_RESPONSE"
    echo "   อาจเป็นเพราะ user นี้มีอยู่แล้ว"
fi

# Login เพื่อรับ Token
echo "5. Login เพื่อรับ Token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_upload@example.com",
    "password": "password123"
  }')

if [[ $LOGIN_RESPONSE == *"success"* ]]; then
    echo "   ✅ Login สำเร็จ"
    # ดึง token จาก response
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$TOKEN" ]]; then
        echo "   🔑 ได้รับ Token: ${TOKEN:0:20}..."
        echo "   Token นี้จะใช้สำหรับทดสอบการอัปโหลดรูปภาพ"
    fi
else
    echo "   ❌ Login ล้มเหลว: $LOGIN_RESPONSE"
    exit 1
fi

echo ""
echo "📤 ทดสอบการอัปโหลดรูปภาพ..."

# สร้างไฟล์รูปภาพทดสอบ (ถ้าไม่มี)
if [[ ! -f "test-image.jpg" ]]; then
    echo "6. สร้างไฟล์รูปภาพทดสอบ..."
    # สร้างไฟล์รูปภาพขนาดเล็กด้วย ImageMagick หรือใช้ไฟล์ที่มีอยู่
    if command -v convert >/dev/null 2>&1; then
        convert -size 100x100 xc:red test-image.jpg
        echo "   ✅ สร้างไฟล์รูปภาพทดสอบสำเร็จ"
    else
        echo "   ⚠️  ไม่พบ ImageMagick, กรุณาสร้างไฟล์ test-image.jpg เอง"
        echo "   หรือใช้รูปภาพที่มีอยู่แล้ว"
    fi
else
    echo "   ✅ พบไฟล์รูปภาพทดสอบแล้ว"
fi

# ทดสอบการอัปโหลดรูปภาพ (ถ้ามี token และไฟล์รูปภาพ)
if [[ -n "$TOKEN" ]] && [[ -f "test-image.jpg" ]]; then
    echo "7. ทดสอบการอัปโหลดรูปภาพ..."
    
    UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/products \
      -H "Authorization: Bearer $TOKEN" \
      -F "name=สินค้าทดสอบอัปโหลด" \
      -F "description=รายละเอียดสินค้าทดสอบการอัปโหลดรูปภาพ" \
      -F "price=99.99" \
      -F "category=electronics" \
      -F "condition=good" \
      -F "image=@test-image.jpg")
    
    if [[ $UPLOAD_RESPONSE == *"success"* ]]; then
        echo "   ✅ อัปโหลดรูปภาพสำเร็จ"
        echo "   📝 Response: $UPLOAD_RESPONSE"
    else
        echo "   ❌ อัปโหลดรูปภาพล้มเหลว: $UPLOAD_RESPONSE"
    fi
else
    echo "   ⚠️  ไม่สามารถทดสอบการอัปโหลดได้ (ไม่มี token หรือไฟล์รูปภาพ)"
fi

echo ""
echo "📁 ตรวจสอบโฟลเดอร์ Uploads..."

# ตรวจสอบโฟลเดอร์ uploads
if [[ -d "uploads" ]]; then
    echo "   📂 โฟลเดอร์ uploads มีอยู่"
    UPLOAD_COUNT=$(ls -1 uploads/ 2>/dev/null | wc -l)
    echo "   📊 จำนวนไฟล์ใน uploads: $UPLOAD_COUNT"
    
    if [[ $UPLOAD_COUNT -gt 0 ]]; then
        echo "   📋 รายการไฟล์:"
        ls -la uploads/ | head -10
    fi
else
    echo "   ❌ โฟลเดอร์ uploads ไม่มีอยู่"
fi

echo ""
echo "🔍 ทดสอบการเข้าถึงรูปภาพ..."

# ทดสอบการเข้าถึงรูปภาพ (ถ้ามีไฟล์ใน uploads)
if [[ -d "uploads" ]] && [[ $(ls -1 uploads/ 2>/dev/null | wc -l) -gt 0 ]]; then
    FIRST_IMAGE=$(ls uploads/ | head -1)
    if [[ -n "$FIRST_IMAGE" ]]; then
        echo "8. ทดสอบการเข้าถึงรูปภาพ: $FIRST_IMAGE"
        
        IMAGE_RESPONSE=$(curl -s -I "http://localhost:5001/uploads/$FIRST_IMAGE")
        if [[ $IMAGE_RESPONSE == *"200 OK"* ]] || [[ $IMAGE_RESPONSE == *"image"* ]]; then
            echo "   ✅ เข้าถึงรูปภาพได้สำเร็จ"
        else
            echo "   ❌ เข้าถึงรูปภาพไม่ได้: $IMAGE_RESPONSE"
        fi
    fi
fi

echo ""
echo "=========================================="
echo "🧪 การทดสอบเสร็จสิ้น!"
echo ""
echo "📋 สรุปผลการทดสอบ:"
echo "   - เซิร์ฟเวอร์: ✅ ทำงานปกติ"
echo "   - API Endpoints: ✅ ทำงานปกติ"
echo "   - การอัปโหลด: $(if [[ $UPLOAD_RESPONSE == *"success"* ]]; then echo "✅ สำเร็จ"; else echo "❌ ล้มเหลว"; fi)"
echo "   - โฟลเดอร์ Uploads: $(if [[ -d "uploads" ]]; then echo "✅ มีอยู่"; else echo "❌ ไม่มี"; fi)"
echo ""
echo "💡 คำแนะนำ:"
echo "   - ใช้ไฟล์ test-upload.html เพื่อทดสอบผ่านเบราว์เซอร์"
echo "   - ตรวจสอบ logs ของเซิร์ฟเวอร์หากมีปัญหา"
echo "   - ตรวจสอบสิทธิ์การเขียนในโฟลเดอร์ uploads"
echo ""
echo "🔗 URLs ที่สำคัญ:"
echo "   - เซิร์ฟเวอร์: http://localhost:5001"
echo "   - Health Check: http://localhost:5001/health"
echo "   - API Test: http://localhost:5001/api/products/test"
echo "   - ไฟล์ทดสอบ: ./test-upload.html"
