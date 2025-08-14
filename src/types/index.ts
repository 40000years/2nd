export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  seller: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
  };
  location: string;
  createdAt: Date;
  tags: string[];
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  joinDate: Date;
  location: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  buyer: User;
  seller: User;
} 