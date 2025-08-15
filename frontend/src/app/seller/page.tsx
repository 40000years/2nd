'use client';

import React, { useEffect, useState } from 'react';
import { Package, Plus, Eye, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiService } from '@/lib/api';
import Link from 'next/link';

interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalSales: number;
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalViews: 0,
    totalSales: 0
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSellerData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Load seller's products
        const productsResponse = await apiService.getUserProducts();
        if (productsResponse.success && productsResponse.data) {
          const products = productsResponse.data.products;
          
          setStats({
            totalProducts: products.length,
            activeProducts: products.filter((p: any) => p.isAvailable).length,
            totalViews: products.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
            totalSales: 0 // TODO: Implement sales tracking
          });

          // Get recent products (last 5)
          setRecentProducts(products.slice(0, 5));
        } else {
          setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
        }
      } catch (error) {
        console.error('Failed to load seller data:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };

    loadSellerData();
  }, []);

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
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ดผู้ขาย</h1>
          <p className="text-gray-600">จัดการสินค้าและดูสถิติการขายของคุณ</p>
        </div>
        <Link
          href="/seller/products/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าใหม่
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">สินค้าที่ขายได้</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ยอดดูรวม</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ยอดขายรวม</p>
              <p className="text-2xl font-bold text-gray-900">฿{stats.totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/seller/products/add"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2 text-blue-600" />
            <span>เพิ่มสินค้าใหม่</span>
          </Link>
          <Link
            href="/seller/products"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="h-5 w-5 mr-2 text-green-600" />
            <span>จัดการสินค้า</span>
          </Link>
          <Link
            href="/seller/orders"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
            <span>ดูคำสั่งซื้อ</span>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">สินค้าล่าสุด</h2>
          <Link
            href="/seller/products"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ดูทั้งหมด
          </Link>
        </div>
        
        {recentProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">คุณยังไม่มีสินค้า</p>
            <Link
              href="/seller/products/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้าแรก
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">฿{product.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    product.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isAvailable ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                  </span>
                  <span className="text-sm text-gray-500">
                    ดู: {product.views || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">เคล็ดลับการขาย</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-medium text-blue-900">ถ่ายรูปสินค้าให้ชัดเจน</h4>
              <p className="text-sm text-blue-700">รูปภาพที่ดีจะช่วยดึงดูดลูกค้าได้มากขึ้น</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-medium text-blue-900">เขียนรายละเอียดครบถ้วน</h4>
              <p className="text-sm text-blue-700">อธิบายสภาพและคุณสมบัติของสินค้าให้ชัดเจน</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-medium text-blue-900">ตั้งราคาที่เหมาะสม</h4>
              <p className="text-sm text-blue-700">เปรียบเทียบราคาตลาดและตั้งราคาที่แข่งขันได้</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              4
            </div>
            <div>
              <h4 className="font-medium text-blue-900">ตอบลูกค้าอย่างรวดเร็ว</h4>
              <p className="text-sm text-blue-700">การตอบสนองที่เร็วจะช่วยเพิ่มโอกาสในการขาย</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
