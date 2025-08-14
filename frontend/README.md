# 2nd - เว็บไซต์ขายของมือสอง

เว็บไซต์ e-commerce สำหรับขายของมือสองที่สร้างด้วย Next.js, Tailwind CSS และ Framer Motion

## ✨ คุณสมบัติ

- 🛍️ **ระบบ E-commerce** - ซื้อขายของมือสองออนไลน์
- 🎨 **UI/UX ที่สวยงาม** - ใช้ Tailwind CSS และ Framer Motion
- 📱 **Responsive Design** - รองรับทุกขนาดหน้าจอ
- 🔍 **ระบบค้นหา** - ค้นหาสินค้าได้อย่างรวดเร็ว
- 🏷️ **หมวดหมู่สินค้า** - จัดหมวดหมู่สินค้าอย่างเป็นระบบ
- ⭐ **ระบบรีวิว** - ให้คะแนนและรีวิวผู้ขาย
- 💳 **ระบบชำระเงิน** - รองรับการชำระเงินหลายรูปแบบ
- 🔒 **ระบบความปลอดภัย** - ตรวจสอบผู้ขายและสินค้า

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Headless UI

## 🚀 การติดตั้ง

1. Clone โปรเจค
```bash
git clone <repository-url>
cd 2nd
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. รันโปรเจค
```bash
npm run dev
```

4. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจค

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── HeroSection.tsx # Hero section
│   ├── ProductCard.tsx # Product display card
│   └── CategoryCard.tsx # Category display card
├── lib/               # Utility functions
│   └── data.ts        # Sample data
└── types/             # TypeScript types
    └── index.ts       # Type definitions
```

## 🎯 ฟีเจอร์หลัก

### หน้าแรก
- Hero section พร้อม search bar
- แสดงหมวดหมู่สินค้า
- สินค้าแนะนำ
- ข้อดีของแพลตฟอร์ม

### ระบบสินค้า
- แสดงรายการสินค้า
- ข้อมูลสินค้า (ราคา, สภาพ, ผู้ขาย)
- ระบบค้นหาและกรอง
- รายละเอียดสินค้า

### ระบบผู้ใช้
- หน้าโปรไฟล์
- ประวัติการซื้อขาย
- ระบบรีวิวและคะแนน

## 🔧 การพัฒนา

### การเพิ่มสินค้าใหม่
1. แก้ไขไฟล์ `src/lib/data.ts`
2. เพิ่มข้อมูลสินค้าใน array `products`
3. อัปเดตหมวดหมู่ใน `categories` หากจำเป็น

### การปรับแต่ง UI
- แก้ไขไฟล์ `src/app/globals.css` สำหรับ global styles
- ใช้ Tailwind CSS classes ในคอมโพเนนต์
- เพิ่ม Framer Motion animations ตามต้องการ

## 📱 Responsive Design

เว็บไซต์รองรับการแสดงผลบน:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🎨 Design System

### สีหลัก
- **Primary**: Blue (#2563eb)
- **Secondary**: Gray (#6b7280)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter
- **Weights**: 400, 500, 600, 700

## 🚀 การ Deploy

### Vercel (แนะนำ)
1. Push โค้ดไปยัง GitHub
2. เชื่อมต่อกับ Vercel
3. Deploy อัตโนมัติ

### Netlify
1. Build โปรเจค: `npm run build`
2. Deploy ไฟล์ใน `out/` directory

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📄 License

โปรเจคนี้อยู่ภายใต้ MIT License - ดูไฟล์ [LICENSE](LICENSE) สำหรับรายละเอียด

## 📞 ติดต่อ

- **Email**: support@2nd.com
- **Phone**: 02-123-4567
- **Address**: กรุงเทพมหานคร, ประเทศไทย

---

สร้างด้วย ❤️ โดยทีม 2nd
