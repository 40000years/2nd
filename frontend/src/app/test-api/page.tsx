'use client';

import React, { useState } from 'react';
import { apiService } from '@/lib/api';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testHealthCheck = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.healthCheck();
      setResult(response);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testGetProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getProducts({ limit: 5 });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const productData = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        category: 'electronics',
        condition: 'good' as const,
        location: 'กรุงเทพมหานคร'
      };
      const response = await apiService.createProduct(productData);
      setResult(response);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testHealthCheck}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Health Check
          </button>
          
          <button
            onClick={testGetProducts}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 ml-4"
          >
            Test Get Products
          </button>
          
          <button
            onClick={testCreateProduct}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 ml-4"
          >
            Test Create Product
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info:</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
            <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
