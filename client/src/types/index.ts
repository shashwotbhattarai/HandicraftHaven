export interface ProductWithCategory {
  id: number;
  name: string;
  description: string;
  price: string;
  categoryId: number;
  stock: number;
  imageUrl: string;
  images?: string[];
  isActive: boolean;
  sku: string;
  category: {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CartItemWithProduct {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  product: ProductWithCategory;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: string;
  status: string;
  createdAt: Date;
}

export interface OrderWithItems extends Order {
  items: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: string;
    product: ProductWithCategory;
  }>;
}
