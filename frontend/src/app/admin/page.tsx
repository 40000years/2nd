'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  isAvailable: boolean;
  views: number;
  likes: number;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  activeUsers: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accessDenied, setAccessDenied] = useState(false);
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication and admin role
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/admin');
        return;
      }
      
      if (user?.role !== 'admin') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      
      // User is authenticated and is admin, load data
      loadDashboardData();
    }
  }, [isAuthenticated, user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load real data from API
      const [statsResponse, usersResponse, productsResponse] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAdminUsers(),
        apiService.getAdminProducts()
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data.users);
      }

      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data.products);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Fallback to mock data if API fails
      setStats({
        totalUsers: 150,
        totalProducts: 1200,
        totalSales: 45000,
        activeUsers: 89
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'block' | 'delete' | 'promote') => {
    try {
      if (action === 'delete') {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
          await apiService.deleteUser(userId);
          alert('ลบผู้ใช้สำเร็จ');
          loadDashboardData(); // Reload data
        }
      } else if (action === 'promote') {
        const newRole = prompt('ใส่บทบาทใหม่ (admin/seller/buyer):', 'seller');
        if (newRole && ['admin', 'seller', 'buyer'].includes(newRole)) {
          await apiService.updateUserRole(userId, newRole);
          alert('อัปเดตบทบาทสำเร็จ');
          loadDashboardData(); // Reload data
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`เกิดข้อผิดพลาด: ${error}`);
    }
  };

  const handleProductAction = async (productId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'delete') {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
          await apiService.deleteProduct(productId);
          alert('ลบสินค้าสำเร็จ');
          loadDashboardData(); // Reload data
        }
      } else if (action === 'approve') {
        await apiService.updateProductStatus(productId, true);
        alert('อนุมัติสินค้าสำเร็จ');
        loadDashboardData(); // Reload data
      } else if (action === 'reject') {
        await apiService.updateProductStatus(productId, false);
        alert('ปฏิเสธสินค้าสำเร็จ');
        loadDashboardData(); // Reload data
      }
    } catch (error) {
      console.error(`Failed to ${action} product:`, error);
      alert(`เกิดข้อผิดพลาด: ${error}`);
    }
  };

  // Show loading while checking authentication
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user is not admin
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">🚫</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">เข้าถึงไม่ได้</h1>
          <p className="text-lg text-gray-600 mb-6">
            คุณไม่มีสิทธิ์เข้าถึงหน้า Admin Panel
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              กลับหน้าหลัก
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="block w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Admin: {user?.firstName} {user?.lastName}
              </span>
              <button 
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'ภาพรวม', icon: '📊' },
              { id: 'users', name: 'จัดการผู้ใช้', icon: '👥' },
              { id: 'products', name: 'จัดการสินค้า', icon: '📦' },
              { id: 'analytics', name: 'สถิติ', icon: '📈' },
              { id: 'settings', name: 'ตั้งค่า', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">ผู้ใช้ทั้งหมด</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.totalProducts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">ยอดขายรวม</p>
                    <p className="text-2xl font-semibold text-gray-900">฿{stats?.totalSales?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <span className="text-2xl">🟢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">ผู้ใช้ที่ใช้งาน</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.activeUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">กิจกรรมล่าสุด</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">ผู้ใช้ใหม่สมัครสมาชิก</span>
                    <span className="text-sm text-gray-400">2 นาทีที่แล้ว</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">สินค้าใหม่ถูกเพิ่ม</span>
                    <span className="text-sm text-gray-400">15 นาทีที่แล้ว</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">การขายใหม่</span>
                    <span className="text-sm text-gray-400">1 ชั่วโมงที่แล้ว</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">จัดการผู้ใช้</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ใช้</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สมัคร</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUserAction(user.id, 'promote')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            เลื่อนขั้น
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="text-red-600 hover:text-red-900"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">จัดการสินค้า</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ดู: {product.views} | ถูกใจ: {product.likes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">฿{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleProductAction(product.id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                          >
                            อนุมัติ
                          </button>
                          <button
                            onClick={() => handleProductAction(product.id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">สถิติการใช้งาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">ผู้ใช้ใหม่ต่อเดือน</h4>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">กราฟจะแสดงที่นี่</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">สินค้าที่ขายได้</h4>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">กราฟจะแสดงที่นี่</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ตั้งค่าระบบ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">อีเมลแจ้งเตือน</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">การแจ้งเตือน</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">แจ้งเตือนเมื่อมีผู้ใช้ใหม่</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">แจ้งเตือนเมื่อมีสินค้าใหม่</span>
                  </label>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 