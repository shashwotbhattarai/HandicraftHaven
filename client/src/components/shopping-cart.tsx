import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/lib/cart-context';

export function ShoppingCart() {
  const { 
    cartItems, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartItem, 
    removeFromCart 
  } = useCart();

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Mock checkout process
    alert('Checkout functionality would be implemented here with payment processing');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="w-96 sm:w-96">
        <SheetHeader>
          <SheetTitle className="text-2xl font-display font-bold text-artisan-brown flex items-center justify-between">
            Shopping Cart
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="text-artisan-medium hover:text-artisan-dark"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-artisan-medium">Your cart is empty</p>
                <p className="text-sm text-artisan-medium mt-2">Add some beautiful handcrafted items!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-6 border-b border-artisan-beige">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-artisan-dark">{item.product.name}</h4>
                      <p className="text-sm text-artisan-medium">{item.product.category.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0 rounded-full bg-artisan-beige hover:bg-artisan-burlywood"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 p-0 rounded-full bg-artisan-beige hover:bg-artisan-burlywood"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold text-artisan-brown">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-artisan-medium hover:text-red-500"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-artisan-beige pt-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-artisan-dark">Total:</span>
                <span className="text-2xl font-bold text-artisan-brown">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-artisan-chocolate hover:bg-artisan-brown text-white py-4 font-semibold transition-colors duration-200 mb-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-artisan-brown text-artisan-brown hover:bg-artisan-brown hover:text-white py-4 font-semibold transition-all duration-200"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
