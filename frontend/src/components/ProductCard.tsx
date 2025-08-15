'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, MapPin, Star, Eye, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const isInUserCart = isInCart(product.id);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getDefaultImage = (category: string) => {
    const categoryImages: { [key: string]: string } = {
      'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      'fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'home-garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'books-media': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      'others': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    };
    
    return categoryImages[category.toLowerCase()] || categoryImages['others'];
  };

  const productImage = product.images && product.images.length > 0 && !imageError 
    ? product.images[0] 
    : getDefaultImage(product.category);

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={productImage}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.condition === 'excellent' ? 'bg-green-100 text-green-800' :
              product.condition === 'good' ? 'bg-blue-100 text-blue-800' :
              product.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.condition === 'excellent' ? 'สภาพดีมาก' :
               product.condition === 'good' ? 'สภาพดี' :
               product.condition === 'fair' ? 'สภาพปานกลาง' : 'สภาพพอใช้'}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <Heart className="w-4 h-4 text-gray-600" />
            </motion.button>
            
            {product.stock > 0 ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-colors ${
                  isInUserCart 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white hover:bg-blue-50 text-gray-600'
                }`}
                title={isInUserCart ? 'อยู่ในตะกร้าแล้ว' : 'เพิ่มลงตะกร้า'}
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-red-600">หมด</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">
                ฿{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{product.views}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Seller Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {product.seller?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {product.seller?.firstName || 'Unknown'} {product.seller?.lastName || 'User'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {product.seller?.rating ? parseFloat(product.seller.rating.toString()).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>

          {/* Location & Stock */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `มี ${product.stock} ชิ้น` : 'หมดแล้ว'}
              </span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
} 