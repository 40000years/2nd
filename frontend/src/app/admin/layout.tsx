'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Package, ShoppingCart, BarChart3, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login with return URL
        router.push('/auth/login?redirect=/admin');
        return;
      }

      if (user?.role !== 'admin') {
        // User is not admin, redirect to home
        router.push('/');
        return;
      }

      // User is authenticated and is admin
      setIsAuthorized(true);
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const adminMenuItems = [
    { name: 'แดชบอร์ด', icon: BarChart3, href: '/admin' },
    { name: 'ผู้ใช้งาน', icon: Users, href: '/admin/users' },
    { name: 'สินค้า', icon: Package, href: '/admin/products' },
    { name: 'คำสั่งซื้อ', icon: ShoppingCart, href: '/admin/orders' },
    { name: 'การตั้งค่า', icon: Settings, href: '/admin/settings' },
  ];

  // Show loading while checking authentication
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
          <p className="text-gray-500 text-sm mt-2">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  // Render admin interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                ยินดีต้อนรับ, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 