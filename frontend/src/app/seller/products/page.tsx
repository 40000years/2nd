'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, Filter, Edit, Trash2, Eye, Plus, AlertTriangle } from 'lucide-react';
import { apiService } from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  isAvailable: boolean;
  isApproved: boolean;
  views: number;
  likes: number;
  createdAt: string;
  images: string[];
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await apiService.getUserProducts();
        if (response.success && response.data) {
          const transformedProducts: Product[] = response.data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            category: product.category,
            condition: product.condition,
            isAvailable: product.isAvailable,
            isApproved: product.isApproved !== false,
            views: product.views || 0,
            likes: product.likes || 0,
            createdAt: product.createdAt,
            images: product.images || []
          }));
          
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        } else {
          setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term and status filter
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'available') {
        filtered = filtered.filter(product => product.isAvailable);
      } else if (statusFilter === 'sold') {
        filtered = filtered.filter(product => !product.isAvailable);
      } else if (statusFilter === 'approved') {
        filtered = filtered.filter(product => product.isApproved);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(product => !product.isApproved);
      }
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, statusFilter]);

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
      try {
        const response = await apiService.deleteProduct(productId);
        if (response.success) {
          setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        } else {
          alert('ไม่สามารถลบสินค้าได้');
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('เกิดข้อผิดพลาดในการลบสินค้า');
      }
    }
  };

  const getStatusBadge = (product: Product) => {
    if (!product.isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          รออนุมัติ
        </span>
      );
    }
    if (!product.isAvailable) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ขายแล้ว
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        พร้อมขาย
      </span>
    );
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">สินค้าของฉัน</h1>
          <p className="text-gray-600">จัดการสินค้าที่คุณลงขาย</p>
        </div>
        <Link
          href="/seller/products/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าใหม่
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ยอดดูรวม</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รออนุมัติ</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => !p.isApproved).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">พร้อมขาย</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.isApproved && p.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="available">พร้อมขาย</option>
              <option value="sold">ขายแล้ว</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="pending">รออนุมัติ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบสินค้า</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' 
              : 'คุณยังไม่มีสินค้า ลองเพิ่มสินค้าใหม่ดูสิ'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <Link
                href="/seller/products/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มสินค้าแรก
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Product Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  {getStatusBadge(product)}
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">฿{product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {product.views}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  <p>หมวดหมู่: {getCategoryDisplayName(product.category)}</p>
                  <p>วันที่เพิ่ม: {new Date(product.createdAt).toLocaleDateString('th-TH')}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
