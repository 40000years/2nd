#!/bin/bash

# 🏪 Script สร้างบัญชี User สำหรับทดสอบระบบ
# สร้างบัญชีคนขาย, คนซื้อ, และ admin

echo "🏪 เริ่มต้นสร้างบัญชี User สำหรับทดสอบระบบ..."
echo "=============================================="

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
echo "👥 สร้างบัญชี User ต่างๆ..."

# 1. สร้างบัญชี Admin
echo "1. สร้างบัญชี Admin..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@2nd.com",
    "password": "admin123",
    "firstName": "แอดมิน",
    "lastName": "ระบบ",
    "role": "admin"
  }')

if [[ $ADMIN_RESPONSE == *"success"* ]]; then
    echo "   ✅ สร้างบัญชี Admin สำเร็จ"
    ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$ADMIN_TOKEN" ]]; then
        echo "   🔑 Admin Token: ${ADMIN_TOKEN:0:20}..."
    fi
else
    echo "   ❌ สร้างบัญชี Admin ล้มเหลว: $ADMIN_RESPONSE"
    echo "   อาจเป็นเพราะบัญชีนี้มีอยู่แล้ว"
fi

# 2. สร้างบัญชี Seller 1
echo "2. สร้างบัญชี Seller 1..."
SELLER1_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@2nd.com",
    "password": "seller123",
    "firstName": "คนขาย",
    "lastName": "คนที่1",
    "role": "seller"
  }')

if [[ $SELLER1_RESPONSE == *"success"* ]]; then
    echo "   ✅ สร้างบัญชี Seller 1 สำเร็จ"
    SELLER1_TOKEN=$(echo $SELLER1_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$SELLER1_TOKEN" ]]; then
        echo "   🔑 Seller 1 Token: ${SELLER1_TOKEN:0:20}..."
    fi
else
    echo "   ❌ สร้างบัญชี Seller 1 ล้มเหลว: $SELLER1_RESPONSE"
    echo "   อาจเป็นเพราะบัญชีนี้มีอยู่แล้ว"
fi

# 3. สร้างบัญชี Seller 2
echo "3. สร้างบัญชี Seller 2..."
SELLER2_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller2@2nd.com",
    "password": "seller123",
    "firstName": "คนขาย",
    "lastName": "คนที่2",
    "role": "seller"
  }')

if [[ $SELLER2_RESPONSE == *"success"* ]]; then
    echo "   ✅ สร้างบัญชี Seller 2 สำเร็จ"
    SELLER2_TOKEN=$(echo $SELLER2_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$SELLER2_TOKEN" ]]; then
        echo "   🔑 Seller 2 Token: ${SELLER2_TOKEN:0:20}..."
    fi
else
    echo "   ❌ สร้างบัญชี Seller 2 ล้มเหลว: $SELLER2_RESPONSE"
    echo "   อาจเป็นเพราะบัญชีนี้มีอยู่แล้ว"
fi

# 4. สร้างบัญชี Buyer 1
echo "4. สร้างบัญชี Buyer 1..."
BUYER1_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer1@2nd.com",
    "password": "buyer123",
    "firstName": "คนซื้อ",
    "lastName": "คนที่1",
    "role": "buyer"
  }')

if [[ $BUYER1_RESPONSE == *"success"* ]]; then
    echo "   ✅ สร้างบัญชี Buyer 1 สำเร็จ"
    BUYER1_TOKEN=$(echo $BUYER1_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$BUYER1_TOKEN" ]]; then
        echo "   🔑 Buyer 1 Token: ${BUYER1_TOKEN:0:20}..."
    fi
else
    echo "   ❌ สร้างบัญชี Buyer 1 ล้มเหลว: $BUYER1_RESPONSE"
    echo "   อาจเป็นเพราะบัญชีนี้มีอยู่แล้ว"
fi

# 5. สร้างบัญชี Buyer 2
echo "5. สร้างบัญชี Buyer 2..."
BUYER2_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer2@2nd.com",
    "password": "buyer123",
    "firstName": "คนซื้อ",
    "lastName": "คนที่2",
    "role": "buyer"
  }')

if [[ $BUYER2_RESPONSE == *"success"* ]]; then
    echo "   ✅ สร้างบัญชี Buyer 2 สำเร็จ"
    BUYER2_TOKEN=$(echo $BUYER2_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [[ -n "$BUYER2_TOKEN" ]]; then
        echo "   🔑 Buyer 2 Token: ${BUYER2_TOKEN:0:20}..."
    fi
else
    echo "   ❌ สร้างบัญชี Buyer 2 ล้มเหลว: $BUYER2_RESPONSE"
    echo "   อาจเป็นเพราะบัญชีนี้มีอยู่แล้ว"
fi

echo ""
echo "🔑 ทดสอบการ Login เพื่อรับ Token..."

# ทดสอบ Login สำหรับแต่ละบัญชี
echo "6. ทดสอบ Login Admin..."
ADMIN_LOGIN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@2nd.com",
    "password": "admin123"
  }')

if [[ $ADMIN_LOGIN == *"success"* ]]; then
    echo "   ✅ Admin Login สำเร็จ"
    ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo "   ❌ Admin Login ล้มเหลว"
fi

echo "7. ทดสอบ Login Seller 1..."
SELLER1_LOGIN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@2nd.com",
    "password": "seller123"
  }')

if [[ $SELLER1_LOGIN == *"success"* ]]; then
    echo "   ✅ Seller 1 Login สำเร็จ"
    SELLER1_TOKEN=$(echo $SELLER1_LOGIN | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo "   ❌ Seller 1 Login ล้มเหลว"
fi

echo "8. ทดสอบ Login Buyer 1..."
BUYER1_LOGIN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer1@2nd.com",
    "password": "buyer123"
  }')

if [[ $BUYER1_LOGIN == *"success"* ]]; then
    echo "   ✅ Buyer 1 Login สำเร็จ"
    BUYER1_TOKEN=$(echo $BUYER1_LOGIN | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo "   ❌ Buyer 1 Login ล้มเหลว"
fi

echo ""
echo "📋 สรุปบัญชีที่สร้าง:"
echo "=============================================="

# สร้างไฟล์เก็บข้อมูลบัญชี
cat > user-accounts.txt << EOF
🏪 บัญชี User สำหรับทดสอบระบบ 2nd

📅 สร้างเมื่อ: $(date)

👑 ADMIN ACCOUNTS:
Email: admin@2nd.com
Password: admin123
Role: admin
Token: ${ADMIN_TOKEN:0:50}...

🏪 SELLER ACCOUNTS:
Email: seller1@2nd.com
Password: seller123
Role: seller
Token: ${SELLER1_TOKEN:0:50}...

Email: seller2@2nd.com
Password: seller123
Role: seller

🛒 BUYER ACCOUNTS:
Email: buyer1@2nd.com
Password: buyer123
Role: buyer
Token: ${BUYER1_TOKEN:0:50}...

Email: buyer2@2nd.com
Password: buyer123
Role: buyer

🔑 วิธีการใช้งาน:
1. ใช้ Admin account สำหรับจัดการระบบ
2. ใช้ Seller account สำหรับเพิ่มสินค้า
3. ใช้ Buyer account สำหรับสั่งซื้อสินค้า

📝 หมายเหตุ:
- รหัสผ่านทั้งหมดเป็นรหัสทดสอบ
- ควรเปลี่ยนรหัสผ่านในระบบจริง
- Token มีอายุ 7 วัน
EOF

echo "📄 ข้อมูลบัญชีถูกบันทึกในไฟล์: user-accounts.txt"
echo ""
echo "🔍 ทดสอบการเข้าถึง API ด้วย Admin Token..."

# ทดสอบ Admin API
if [[ -n "$ADMIN_TOKEN" ]]; then
    echo "9. ทดสอบ Admin API - ดูรายการ Users..."
    ADMIN_USERS_RESPONSE=$(curl -s -X GET http://localhost:5001/api/admin/users \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if [[ $ADMIN_USERS_RESPONSE == *"success"* ]]; then
        echo "   ✅ Admin สามารถดูรายการ Users ได้"
        USER_COUNT=$(echo $ADMIN_USERS_RESPONSE | grep -o '"totalUsers":[0-9]*' | cut -d':' -f2)
        if [[ -n "$USER_COUNT" ]]; then
            echo "   👥 จำนวน Users ทั้งหมด: $USER_COUNT คน"
        fi
    else
        echo "   ❌ Admin ไม่สามารถดูรายการ Users ได้: $ADMIN_USERS_RESPONSE"
    fi
fi

echo ""
echo "🔍 ทดสอบการเข้าถึง API ด้วย Seller Token..."

# ทดสอบ Seller API
if [[ -n "$SELLER1_TOKEN" ]]; then
    echo "10. ทดสอบ Seller API - ดูรายการสินค้าของตัวเอง..."
    SELLER_PRODUCTS_RESPONSE=$(curl -s -X GET http://localhost:5001/api/products/user/my-products \
      -H "Authorization: Bearer $SELLER1_TOKEN")
    
    if [[ $SELLER_PRODUCTS_RESPONSE == *"success"* ]]; then
        echo "   ✅ Seller สามารถดูรายการสินค้าของตัวเองได้"
    else
        echo "   ❌ Seller ไม่สามารถดูรายการสินค้าได้: $SELLER_PRODUCTS_RESPONSE"
    fi
fi

echo ""
echo "🔍 ทดสอบการเข้าถึง API ด้วย Buyer Token..."

# ทดสอบ Buyer API
if [[ -n "$BUYER1_TOKEN" ]]; then
    echo "11. ทดสอบ Buyer API - ดูรายการสินค้าทั้งหมด..."
    BUYER_PRODUCTS_RESPONSE=$(curl -s -X GET http://localhost:5001/api/products \
      -H "Authorization: Bearer $BUYER1_TOKEN")
    
    if [[ $BUYER_PRODUCTS_RESPONSE == *"success"* ]] || [[ $BUYER_PRODUCTS_RESPONSE == *"data"* ]]; then
        echo "   ✅ Buyer สามารถดูรายการสินค้าได้"
    else
        echo "   ❌ Buyer ไม่สามารถดูรายการสินค้าได้: $BUYER_PRODUCTS_RESPONSE"
    fi
fi

echo ""
echo "=============================================="
echo "✅ การสร้างบัญชี User เสร็จสิ้น!"
echo ""
echo "📋 สรุปผลการสร้าง:"
echo "   - Admin: 1 บัญชี"
echo "   - Seller: 2 บัญชี"
echo "   - Buyer: 2 บัญชี"
echo ""
echo "💡 คำแนะนำ:"
echo "   - ใช้ Admin account สำหรับจัดการระบบ"
echo "   - ใช้ Seller account สำหรับเพิ่มสินค้า"
echo "   - ใช้ Buyer account สำหรับสั่งซื้อสินค้า"
echo "   - ข้อมูลบัญชีถูกบันทึกใน user-accounts.txt"
echo ""
echo "🔗 URLs ที่สำคัญ:"
echo "   - เซิร์ฟเวอร์: http://localhost:5001"
echo "   - Health Check: http://localhost:5001/health"
echo "   - Admin API: http://localhost:5001/api/admin/users"
echo "   - Products API: http://localhost:5001/api/products"
echo ""
echo "🧪 ทดสอบระบบอัปโหลดรูปภาพ:"
echo "   - ใช้ Seller account เพื่อเพิ่มสินค้า"
echo "   - ใช้ Admin account เพื่อจัดการสินค้า"
echo "   - ใช้ Buyer account เพื่อดูสินค้า"
