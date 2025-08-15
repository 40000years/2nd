'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Star,
  Calendar
} from 'lucide-react';
import { apiService } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
  systemAlerts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    systemAlerts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Load admin stats
        const statsResponse = await apiService.getAdminStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(prev => ({
            ...prev,
            totalUsers: statsResponse.data.totalUsers,
            totalProducts: statsResponse.data.totalProducts,
            totalOrders: 0, // TODO: Implement orders
            totalRevenue: 0, // TODO: Implement revenue tracking
          }));
        }

        // Load recent products for top products section
        const productsResponse = await apiService.getAdminProducts();
        if (productsResponse.success && productsResponse.data) {
          const topProducts = productsResponse.data.products
            .sort((a, b) => b.views - a.views)
            .slice(0, 3)
            .map(product => ({
              name: product.name,
              views: product.views,
              sales: 0, // TODO: Implement sales tracking
              rating: 4.5 // TODO: Implement rating system
            }));

          setStats(prev => ({
            ...prev,
            topProducts
          }));
        }

        // Mock recent orders (TODO: Implement orders API)
        setStats(prev => ({
          ...prev,
          recentOrders: [
            { id: 1, customer: 'สมชาย ใจดี', product: 'iPhone 12', amount: 15000, status: 'completed' },
            { id: 2, customer: 'สมหญิง รักดี', product: 'MacBook Pro', amount: 45000, status: 'pending' },
            { id: 3, customer: 'สมศักดิ์ มั่นคง', product: 'AirPods Pro', amount: 8000, status: 'processing' },
          ],
          systemAlerts: [
            { type: 'warning', message: 'มีสินค้า 5 รายการที่หมดอายุแล้ว' },
            { type: 'info', message: 'ระบบจะปิดปรับปรุงในวันที่ 15 ธันวาคม' },
            { type: 'success', message: 'การสำรองข้อมูลเสร็จสิ้นแล้ว' },
          ]
        }));

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% จากเดือนที่แล้ว
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ alert }: any) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
      alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
      'bg-green-50 border-green-400'
    }`}>
      <div className="flex items-center">
        <AlertTriangle className={`h-5 w-5 ${
          alert.type === 'warning' ? 'text-yellow-400' :
          alert.type === 'info' ? 'text-blue-400' :
          'text-green-400'
        }`} />
        <p className="ml-3 text-sm text-gray-700">{alert.message}</p>
      </div>
    </div>
  );

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p className="text-gray-600">ภาพรวมของระบบและสถิติต่างๆ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="ผู้ใช้งานทั้งหมด"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="สินค้าทั้งหมด"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="คำสั่งซื้อ"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="bg-purple-500"
          change={-3}
        />
        <StatCard
          title="รายได้รวม"
          value={`฿${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-yellow-500"
          change={15}
        />
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">การแจ้งเตือนระบบ</h2>
        <div className="space-y-3">
          {stats.systemAlerts.map((alert, index) => (
            <AlertCard key={index} alert={alert} />
          ))}
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">คำสั่งซื้อล่าสุด</h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.customer}</p>
                  <p className="text-sm text-gray-600">{order.product}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">฿{order.amount.toLocaleString()}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'completed' ? 'เสร็จสิ้น' :
                     order.status === 'pending' ? 'รอดำเนินการ' : 'กำลังดำเนินการ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">สินค้าขายดี</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {product.views}
                    </span>
                    <span className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {product.sales}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            <span>จัดการผู้ใช้งาน</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="h-5 w-5 mr-2 text-green-600" />
            <span>จัดการสินค้า</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
            <span>ดูคำสั่งซื้อ</span>
          </button>
        </div>
      </div>
    </div>
  );
} 