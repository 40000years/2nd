'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Calendar, User, CreditCard, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { apiService } from '@/lib/api';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  seller: {
    firstName: string;
    lastName: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          setError('กรุณาเข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อ');
          return;
        }

        const response = await apiService.getBuyerOrders();
        if (response.success && response.data) {
          setOrders(response.data.orders);
        } else {
          setError('ไม่สามารถโหลดประวัติการสั่งซื้อได้');
        }
      } catch (error: any) {
        console.error('Failed to fetch orders:', error);
        if (error.message?.includes('401')) {
          setError('กรุณาเข้าสู่ระบบใหม่');
        } else {
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'รอการยืนยัน',
      confirmed: 'ยืนยันแล้ว',
      shipped: 'จัดส่งแล้ว',
      delivered: 'จัดส่งสำเร็จ',
      cancelled: 'ยกเลิกแล้ว',
      refunded: 'คืนเงินแล้ว'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap = {
      pending: 'รอการชำระ',
      paid: 'ชำระแล้ว',
      failed: 'ชำระไม่สำเร็จ',
      refunded: 'คืนเงินแล้ว'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่สามารถโหลดข้อมูลได้</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            {error.includes('เข้าสู่ระบบ') && (
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ยังไม่มีคำสั่งซื้อ</h1>
            <p className="text-gray-600 mb-8">เริ่มต้นการช้อปปิ้งเพื่อดูประวัติการสั่งซื้อของคุณ</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ประวัติการสั่งซื้อ</h1>
          <p className="text-gray-600 mt-2">ติดตามสถานะคำสั่งซื้อของคุณ</p>
        </div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        คำสั่งซื้อ #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} flex items-center space-x-1`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Info */}
                  <div className="flex items-center space-x-4">
                    {order.product.images && order.product.images.length > 0 ? (
                      <img
                        src={order.product.images[0]}
                        alt={order.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">
                        {order.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        จำนวน: {order.quantity} ชิ้น
                      </p>
                      <p className="text-sm text-gray-600">
                        ราคาต่อชิ้น: ฿{order.unitPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ราคารวม:</span>
                      <span className="font-medium">฿{order.totalAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ขายโดย:</span>
                      <span className="font-medium">
                        {order.seller.firstName} {order.seller.lastName}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">วันที่สั่งซื้อ:</span>
                      <span className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/products/${order.product.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      ดูสินค้า
                    </Link>
                    
                    {order.status === 'delivered' && order.paymentStatus === 'paid' && (
                      <button className="text-green-600 hover:text-green-800 transition-colors text-sm">
                        ให้คะแนน
                      </button>
                    )}
                    
                    {order.status === 'pending' && (
                      <button className="text-red-600 hover:text-red-800 transition-colors text-sm">
                        ยกเลิกคำสั่งซื้อ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
