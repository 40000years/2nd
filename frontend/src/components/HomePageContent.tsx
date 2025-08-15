'use client';

import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { Product, apiService } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'อิเล็กทรอนิกส์',
    description: 'มือถือ คอมพิวเตอร์ อุปกรณ์เสริม',
    icon: '📱',
    productCount: 0
  },
  {
    id: 2,
    name: 'แฟชั่น',
    description: 'เสื้อผ้า รองเท้า กระเป๋า',
    icon: '👗',
    productCount: 0
  },
  {
    id: 3,
    name: 'บ้านและสวน',
    description: 'เฟอร์นิเจอร์ ของตกแต่ง',
    icon: '🏠',
    productCount: 0
  },
  {
    id: 4,
    name: 'กีฬาและสันทนาการ',
    description: 'อุปกรณ์กีฬา ของเล่น',
    icon: '⚽',
    productCount: 0
  },
  {
    id: 5,
    name: 'หนังสือและสื่อ',
    description: 'หนังสือ ซีดี ดีวีดี',
    icon: '📚',
    productCount: 0
  },
  {
    id: 6,
    name: 'อื่นๆ',
    description: 'สินค้าอื่นๆ ที่น่าสนใจ',
    icon: '🎁',
    productCount: 0
  }
];

export default function HomePageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await apiService.getProducts({ limit: 8 });
        if (response.success && response.data) {
          setProducts(response.data.products);
          
          // Update category product counts
          categories.forEach(category => {
            const count = response.data.products.filter((product: Product) => 
              product.category.toLowerCase().includes(category.name.toLowerCase())
            ).length;
            category.productCount = count;
          });
        } else {
          setError('ไม่สามารถโหลดสินค้าได้');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <HeroSection />
        
        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">หมวดหมู่สินค้า</h2>
              <p className="text-lg text-gray-600">ค้นหาสินค้าที่คุณต้องการได้ง่ายๆ</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">สินค้าแนะนำ</h2>
              <p className="text-lg text-gray-600">สินค้าคุณภาพดีที่ได้รับความนิยม</p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">ยังไม่มีสินค้าในระบบ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ดูสินค้าทั้งหมด
                </motion.button>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose 2nd Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">ทำไมต้องเลือก 2nd?</h2>
              <p className="text-lg text-gray-600">เราให้บริการที่ดีที่สุดสำหรับคุณ</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ปลอดภัย ไว้ใจได้</h3>
                <p className="text-gray-600">ระบบความปลอดภัยที่ทันสมัย ตรวจสอบผู้ขายทุกคน</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ราคาเป็นมิตร</h3>
                <p className="text-gray-600">สินค้าคุณภาพดี ราคาไม่แพง เหมาะสำหรับทุกคน</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ส่งด่วน ทั่วไทย</h3>
                <p className="text-gray-600">บริการส่งสินค้าที่รวดเร็ว ครอบคลุมทั่วประเทศ</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 