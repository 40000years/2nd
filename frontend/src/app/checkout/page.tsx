'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Package, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { apiService } from '@/lib/api';
import Link from 'next/link';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Get checkout data from URL params or cart
  const productId = searchParams.get('product');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  useEffect(() => {
    // Load checkout items
    if (productId) {
      // Single product checkout
      // This would need to fetch product details from API
      setCheckoutItems([{
        id: productId,
        name: 'สินค้าทดสอบ',
        price: 100,
        image: '',
        quantity: quantity
      }]);
    } else {
      // Cart checkout
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCheckoutItems(cart);
    }

    // Load user info if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.firstName) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`
      }));
    }
  }, [productId, quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!shippingAddress.fullName.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุล');
      return false;
    }
    if (!shippingAddress.phone.trim()) {
      setError('กรุณากรอกเบอร์โทรศัพท์');
      return false;
    }
    if (!shippingAddress.address.trim()) {
      setError('กรุณากรอกที่อยู่');
      return false;
    }
    if (!shippingAddress.city.trim()) {
      setError('กรุณากรอกเมือง/อำเภอ');
      return false;
    }
    if (!shippingAddress.province.trim()) {
      setError('กรุณากรอกจังหวัด');
      return false;
    }
    if (!shippingAddress.postalCode.trim()) {
      setError('กรุณากรอกรหัสไปรษณีย์');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create orders for each item
      const orders = [];
      
      for (const item of checkoutItems) {
        const orderData = {
          productId: item.id,
          quantity: item.quantity,
          shippingAddress: {
            ...shippingAddress,
            fullAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.postalCode}`
          },
          paymentMethod,
          notes: ''
        };

        const response = await apiService.createOrder(orderData);
        if (response.success) {
          orders.push(response.data.order);
        } else {
          throw new Error(response.message || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
        }
      }

      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success
      setSuccess(true);
      if (orders.length > 0) {
        setOrderNumber(orders[0].orderNumber);
      }

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        router.push('/orders');
      }, 3000);

    } catch (error: any) {
      console.error('Failed to place order:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return checkoutItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">สั่งซื้อสำเร็จ!</h1>
          <p className="text-gray-600 mb-2">คำสั่งซื้อของคุณได้รับการยืนยันแล้ว</p>
          {orderNumber && (
            <p className="text-sm text-gray-500 mb-4">เลขที่คำสั่งซื้อ: {orderNumber}</p>
          )}
          <p className="text-gray-600 mb-4">กำลังเปลี่ยนเส้นทางไปยังหน้าประวัติการสั่งซื้อ...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่มีสินค้าในตะกร้า</h1>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            กลับไปดูสินค้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปตะกร้าสินค้า
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">ยืนยันคำสั่งซื้อ</h1>
          <p className="text-gray-600 mt-2">กรอกข้อมูลการจัดส่งและเลือกวิธีการชำระเงิน</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                ข้อมูลการจัดส่ง
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="081-234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ที่อยู่ *
                  </label>
                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="บ้านเลขที่, หมู่, ถนน"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เมือง/อำเภอ *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="เมือง/อำเภอ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      จังหวัด *
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={shippingAddress.province}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="จังหวัด"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสไปรษณีย์ *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10110"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                วิธีการชำระเงิน
              </h2>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">เก็บเงินปลายทาง (COD)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">โอนเงินผ่านธนาคาร</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">บัตรเครดิต/เดบิต</span>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                สรุปคำสั่งซื้อ
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ฿{item.price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>จำนวนสินค้า:</span>
                  <span>{getTotalItems()} ชิ้น</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ราคารวม:</span>
                  <span>฿{getTotalPrice().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ค่าจัดส่ง:</span>
                  <span>฿0</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>ยอดรวม:</span>
                    <span>฿{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังดำเนินการ...
                  </>
                ) : (
                  'ยืนยันคำสั่งซื้อ'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                การสั่งซื้อจะดำเนินการเมื่อคุณยืนยันคำสั่งซื้อ
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
