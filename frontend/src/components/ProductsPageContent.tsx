'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product, apiService } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, Filter, Search, X } from 'lucide-react';

export default function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['electronics', 'fashion', 'home', 'sports', 'books', 'other'];
  const conditions = ['excellent', 'good', 'fair', 'poor'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await apiService.getProducts();
        if (response.success && response.data) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
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

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter(product => product.condition === selectedCondition);
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedCondition, priceRange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCondition('');
    setPriceRange({ min: '', max: '' });
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'อิเล็กทรอนิกส์',
      'fashion': 'แฟชั่น',
      'home': 'บ้านและสวน',
      'sports': 'กีฬาและสันทนาการ',
      'books': 'หนังสือและสื่อ',
      'other': 'อื่นๆ'
    };
    return categoryMap[category] || category;
  };

  const getConditionDisplayName = (condition: string) => {
    const conditionMap: { [key: string]: string } = {
      'excellent': 'สภาพดีมาก',
      'good': 'สภาพดี',
      'fair': 'สภาพปานกลาง',
      'poor': 'สภาพพอใช้'
    };
    return conditionMap[condition] || condition;
  };

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
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">สินค้าทั้งหมด</h1>
            <p className="text-gray-600">ค้นหาสินค้าที่คุณต้องการได้จากสินค้าทั้งหมดของเรา</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>ตัวกรอง</span>
              </button>
              
              {(searchQuery || selectedCategory || selectedCondition || priceRange.min || priceRange.max) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ล้างตัวกรอง
                </button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
              >
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    หมวดหมู่
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ทุกหมวดหมู่</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สภาพสินค้า
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ทุกสภาพ</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>
                        {getConditionDisplayName(condition)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ราคาต่ำสุด
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Max Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ราคาสูงสุด
                  </label>
                  <input
                    type="number"
                    placeholder="ไม่จำกัด"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              แสดงผล {filteredProducts.length} จาก {products.length} สินค้า
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-700 transition-colors"
              >
                ล้างตัวกรอง
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
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
        </div>
      </main>
    </div>
  );
} 