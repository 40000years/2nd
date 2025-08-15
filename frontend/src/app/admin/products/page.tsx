'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, Filter, Eye, CheckCircle, XCircle, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { apiService } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  condition: string;
  seller: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isAvailable: boolean;
  isApproved: boolean;
  views: number;
  likes: number;
  createdAt: string;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await apiService.getAdminProducts();
        if (response.success && response.data) {
          // Transform API data to match our interface
          const transformedProducts: Product[] = response.data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            category: product.category,
            condition: product.condition,
            seller: {
              firstName: product.seller?.firstName || 'ไม่ระบุ',
              lastName: product.seller?.lastName || 'ไม่ระบุ',
              email: product.seller?.email || 'ไม่ระบุ'
            },
            isAvailable: product.isAvailable,
            isApproved: product.isApproved !== false, // Default to true if not explicitly false
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
    // Filter products based on search term and filters
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter(product => product.isApproved);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(product => !product.isApproved);
      } else if (statusFilter === 'available') {
        filtered = filtered.filter(product => product.isAvailable);
      } else if (statusFilter === 'sold') {
        filtered = filtered.filter(product => !product.isAvailable);
      }
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleApproveProduct = async (productId: string) => {
    try {
      const response = await apiService.updateProductStatus(productId, true);
      if (response.success) {
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === productId ? { ...product, isApproved: true } : product
          )
        );
      } else {
        alert('ไม่สามารถอนุมัติสินค้าได้');
      }
    } catch (error) {
      console.error('Failed to approve product:', error);
      alert('เกิดข้อผิดพลาดในการอนุมัติสินค้า');
    }
  };

  const handleRejectProduct = async (productId: string) => {
    try {
      const response = await apiService.updateProductStatus(productId, false);
      if (response.success) {
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === productId ? { ...product, isApproved: false } : product
          )
        );
      } else {
        alert('ไม่สามารถปฏิเสธสินค้าได้');
      }
    } catch (error) {
      console.error('Failed to reject product:', error);
      alert('เกิดข้อผิดพลาดในการปฏิเสธสินค้า');
    }
  };

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

  const getConditionBadge = (condition: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    switch (condition) {
      case 'Used - Excellent':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Used - Good':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Used - Fair':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
        <p className="text-gray-600">ดูและจัดการสินค้าทั้งหมดในระบบ</p>
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
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">อนุมัติแล้ว</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.isApproved).length}
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
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ยอดดูรวม</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกหมวดหมู่</option>
              <option value="Electronics">อิเล็กทรอนิกส์</option>
              <option value="Fashion">แฟชั่น</option>
              <option value="Home">บ้านและสวน</option>
              <option value="Sports">กีฬา</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="pending">รออนุมัติ</option>
              <option value="available">พร้อมขาย</option>
              <option value="sold">ขายแล้ว</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สินค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้ขาย
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ราคา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถิติ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                        <div className="text-xs text-gray-400">{product.condition}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.seller.firstName} {product.seller.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{product.seller.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">฿{product.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 line-through">฿{product.originalPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>ดู: {product.views.toLocaleString()}</div>
                    <div>ถูกใจ: {product.likes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {!product.isApproved && (
                        <>
                          <button
                            onClick={() => handleApproveProduct(product.id)}
                            className="text-green-600 hover:text-green-900"
                            title="อนุมัติสินค้า"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="ปฏิเสธสินค้า"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="ลบสินค้า"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบสินค้า</h3>
          <p className="mt-1 text-sm text-gray-500">
            ลองเปลี่ยนคำค้นหาหรือตัวกรอง
          </p>
        </div>
      )}
    </div>
  );
}
