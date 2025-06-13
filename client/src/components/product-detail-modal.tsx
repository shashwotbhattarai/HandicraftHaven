import { useState } from 'react';
import { ProductWithCategory } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface ProductDetailModalProps {
  product: ProductWithCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display font-bold text-artisan-brown">
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl mb-4"
            />
            
            {images.length > 1 && (
              <div className="flex space-x-3">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                      selectedImage === index ? 'ring-2 ring-artisan-brown' : 'hover:ring-2 hover:ring-artisan-brown'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <Badge 
              variant="secondary" 
              className="bg-artisan-peru/20 text-artisan-peru mb-3"
            >
              {product.category.name}
            </Badge>
            <h3 className="text-2xl font-semibold text-artisan-dark mb-4">{product.name}</h3>
            <p className="text-artisan-medium mb-6 leading-relaxed">{product.description}</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-artisan-brown">${product.price}</span>
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-artisan-dark mb-2">Quantity:</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-artisan-beige hover:border-artisan-brown"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="border border-artisan-beige px-4 py-2 rounded-lg w-16 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-artisan-beige hover:border-artisan-brown"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Stock Info */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-medium">
                  In Stock - {product.stock} available
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-artisan-chocolate hover:bg-artisan-brown text-white px-6 py-4 font-semibold transition-colors duration-200"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="px-6 py-4 border-2 border-artisan-brown text-artisan-brown hover:bg-artisan-brown hover:text-white font-semibold transition-all duration-200"
              >
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
