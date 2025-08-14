import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'อิเล็กทรอนิกส์',
    icon: '📱',
    description: 'มือถือ คอมพิวเตอร์ อุปกรณ์อิเล็กทรอนิกส์',
    productCount: 156
  },
  {
    id: '2',
    name: 'เสื้อผ้า',
    icon: '👕',
    description: 'เสื้อ กางเกง รองเท้า กระเป๋า',
    productCount: 234
  },
  {
    id: '3',
    name: 'เฟอร์นิเจอร์',
    icon: '🪑',
    description: 'โต๊ะ เก้าอี้ ตู้ เตียง',
    productCount: 89
  },
  {
    id: '4',
    name: 'หนังสือ',
    icon: '📚',
    description: 'หนังสือเรียน นวนิยาย หนังสือมือสอง',
    productCount: 67
  },
  {
    id: '5',
    name: 'กีฬา',
    icon: '⚽',
    description: 'อุปกรณ์กีฬา อุปกรณ์ออกกำลังกาย',
    productCount: 45
  },
  {
    id: '6',
    name: 'ของเล่น',
    icon: '🧸',
    description: 'ของเล่นเด็ก ของสะสม',
    productCount: 78
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro Max 256GB',
    description: 'มือถือ iPhone 13 Pro Max สี Sierra Blue 256GB ใช้งานมา 1 ปี สภาพดีมาก ยังมีกล่องและอุปกรณ์ครบ',
    price: 25000,
    originalPrice: 45000,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
    ],
    category: 'อิเล็กทรอนิกส์',
    condition: 'excellent',
    seller: {
      id: '1',
      name: 'สมชาย ใจดี',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    location: 'กรุงเทพมหานคร',
    createdAt: new Date('2024-01-15'),
    tags: ['iPhone', 'มือถือ', 'Apple', '256GB'],
    isAvailable: true
  },
  {
    id: '2',
    name: 'MacBook Air M1 13"',
    description: 'MacBook Air M1 13" สี Space Gray 256GB ใช้งานมา 2 ปี สภาพดี ยังใช้งานได้ปกติ',
    price: 35000,
    originalPrice: 55000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
    ],
    category: 'อิเล็กทรอนิกส์',
    condition: 'good',
    seller: {
      id: '2',
      name: 'สมหญิง รักดี',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
    },
    location: 'เชียงใหม่',
    createdAt: new Date('2024-01-10'),
    tags: ['MacBook', 'Apple', 'M1', 'Laptop'],
    isAvailable: true
  },
  {
    id: '3',
    name: 'เสื้อแจ็คเก็ต Denim',
    description: 'เสื้อแจ็คเก็ต Denim สีน้ำเงิน ขนาด M สภาพดี ใส่ไม่เกิน 10 ครั้ง',
    price: 800,
    originalPrice: 2500,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500'
    ],
    category: 'เสื้อผ้า',
    condition: 'excellent',
    seller: {
      id: '3',
      name: 'สมปอง ใจเย็น',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    location: 'ภูเก็ต',
    createdAt: new Date('2024-01-12'),
    tags: ['เสื้อแจ็คเก็ต', 'Denim', 'เสื้อผ้า', 'M'],
    isAvailable: true
  },
  {
    id: '4',
    name: 'โต๊ะทำงานไม้',
    description: 'โต๊ะทำงานไม้สวย ขนาด 120x60cm สูง 75cm สภาพดี ใช้งานมา 3 ปี',
    price: 2500,
    originalPrice: 8000,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
    ],
    category: 'เฟอร์นิเจอร์',
    condition: 'good',
    seller: {
      id: '4',
      name: 'สมศรี รักบ้าน',
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    },
    location: 'นนทบุรี',
    createdAt: new Date('2024-01-08'),
    tags: ['โต๊ะทำงาน', 'เฟอร์นิเจอร์', 'ไม้'],
    isAvailable: true
  },
  {
    id: '5',
    name: 'หนังสือ Harry Potter ชุดครบ',
    description: 'หนังสือ Harry Potter ภาษาไทย ชุดครบ 7 เล่ม สภาพดี อ่านแล้ว เก็บรักษาดี',
    price: 1200,
    originalPrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
    ],
    category: 'หนังสือ',
    condition: 'good',
    seller: {
      id: '5',
      name: 'สมศักดิ์ รักอ่าน',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    location: 'ขอนแก่น',
    createdAt: new Date('2024-01-05'),
    tags: ['Harry Potter', 'หนังสือ', 'นวนิยาย', 'ชุดครบ'],
    isAvailable: true
  },
  {
    id: '6',
    name: 'รองเท้าผ้าใบ Nike Air Max',
    description: 'รองเท้าผ้าใบ Nike Air Max สีขาว-ดำ ขนาด 42 สภาพดี ใส่ไม่เกิน 5 ครั้ง',
    price: 1500,
    originalPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ],
    category: 'เสื้อผ้า',
    condition: 'excellent',
    seller: {
      id: '6',
      name: 'สมใจ รักกีฬา',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    location: 'สงขลา',
    createdAt: new Date('2024-01-14'),
    tags: ['Nike', 'รองเท้า', 'Air Max', '42'],
    isAvailable: true
  }
]; 