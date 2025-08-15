'use client';

import { motion } from 'framer-motion';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const handleCategoryClick = () => {
    // Navigate to products page with category filter
    window.location.href = `/products?category=${encodeURIComponent(category.name)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="card p-6 text-center cursor-pointer group"
      onClick={handleCategoryClick}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
        {category.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        {category.description}
      </p>
      <div className="text-xs text-gray-500">
        {category.productCount} สินค้า
      </div>
    </motion.div>
  );
} 