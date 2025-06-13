import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItemWithProduct } from '@/types';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItemWithProduct[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  sessionId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', id);
    }
    return id;
  });
  const { toast } = useToast();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  const fetchCartItems = async () => {
    try {
      const res = await fetch(`/api/cart/${sessionId}`);
      if (res.ok) {
        const items = await res.json();
        setCartItems(items);
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [sessionId]);

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      await apiRequest('POST', '/api/cart', {
        sessionId,
        productId,
        quantity
      });
      
      await fetchCartItems();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    try {
      await apiRequest('PUT', `/api/cart/${sessionId}/${productId}`, { quantity });
      await fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await apiRequest('DELETE', `/api/cart/${sessionId}/${productId}`);
      await fetchCartItems();
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      await apiRequest('DELETE', `/api/cart/${sessionId}`);
      setCartItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      sessionId
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
