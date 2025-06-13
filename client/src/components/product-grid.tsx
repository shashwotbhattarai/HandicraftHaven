import { ProductWithCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface ProductGridProps {
  products: ProductWithCategory[];
  onProductClick: (product: ProductWithCategory) => void;
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    await addToCart(productId);
  };

  if (products.length === 0) {
    return (
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-display font-bold text-artisan-brown mb-4">No Products Found</h2>
            <p className="text-xl text-artisan-medium">Try adjusting your search or filter criteria.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-artisan-brown mb-4">Featured Products</h2>
          <p className="text-xl text-artisan-medium max-w-2xl mx-auto">
            Each piece in our collection is carefully crafted by skilled artisans using traditional techniques passed down through generations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <Badge 
                  variant="secondary" 
                  className="bg-artisan-peru/20 text-artisan-peru mb-3"
                >
                  {product.category.name}
                </Badge>
                <h3 className="text-xl font-semibold text-artisan-dark mb-2">{product.name}</h3>
                <p className="text-artisan-medium mb-4 text-sm line-clamp-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-artisan-brown">${product.price}</span>
                  <Button
                    className="bg-artisan-chocolate hover:bg-artisan-brown text-white px-4 py-2 transition-colors duration-200"
                    onClick={(e) => handleAddToCart(e, product.id)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
                <div className="mt-3 text-sm text-artisan-medium">
                  <span>In Stock ({product.stock} available)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
