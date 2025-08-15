const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'seller' | 'admin';
  rating?: number;
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  images: string[];
  tags: string[];
  isAvailable: boolean;
  views: number;
  likes: number;
  seller: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'buyer' | 'seller' | 'admin';
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/api/auth/profile');
  }

  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ApiResponse<ProductsResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.condition) searchParams.append('condition', params.condition);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ProductsResponse>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/api/products/${id}`);
  }

  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    location: string;
    images?: string[];
  }): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async getUserProducts(): Promise<ApiResponse<{ products: Product[] }>> {
    return this.request<{ products: Product[] }>('/api/products/user/my-products');
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Admin endpoints
  async getAdminUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.request<{ users: User[] }>('/api/admin/users');
  }

  async getAdminProducts(): Promise<ApiResponse<{ products: Product[] }>> {
    return this.request<{ products: Product[] }>('/api/admin/products');
  }

  async getAdminStats(): Promise<ApiResponse<{
    totalUsers: number;
    totalProducts: number;
    totalSales: number;
    activeUsers: number;
  }>> {
    return this.request<{
      totalUsers: number;
      totalProducts: number;
      totalSales: number;
      activeUsers: number;
    }>('/api/admin/stats');
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateProductStatus(productId: string, isAvailable: boolean): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/api/admin/products/${productId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
  }

  async deleteProduct(productId: string): Promise<ApiResponse> {
    return this.request(`/api/admin/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.removeToken();
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

export const apiService = new ApiService();
export default apiService; 