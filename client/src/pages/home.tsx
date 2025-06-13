import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductWithCategory, Category } from '@/types';
import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { CategoryFilter } from '@/components/category-filter';
import { ProductGrid } from '@/components/product-grid';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { ShoppingCart } from '@/components/shopping-cart';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products', selectedCategory, searchQuery],
    queryFn: async () => {
      let url = '/api/products';
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category', selectedCategory.toString());
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  const handleProductClick = (product: ProductWithCategory) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category filter when searching
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when filtering by category
  };

  return (
    <>
      <Navigation onSearch={handleSearch} />
      <HeroSection />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-artisan-medium">Loading products...</p>
          </div>
        </div>
      ) : (
        <ProductGrid
          products={products}
          onProductClick={handleProductClick}
        />
      )}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      <ShoppingCart />
      
      {/* Footer */}
      <footer className="bg-artisan-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">Everest Drishti Craft</h3>
              <p className="text-gray-300 mb-4">
                Handcrafted with love, made for you. Supporting local artisans and traditional craftsmanship.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Our Artisans</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Custom Orders</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
              <p className="text-gray-300 mb-4">Subscribe to get updates on new products and artisan stories.</p>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-12 pt-8 text-center">
            <p className="text-gray-300">
              &copy; 2024 Artisan Crafts. All rights reserved. Made with ❤️ for artisans everywhere.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
