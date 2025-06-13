import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { ProductGrid } from "@/components/product-grid";
import { CategoryFilter } from "@/components/category-filter";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { ShoppingCart } from "@/components/shopping-cart";
import type { ProductWithCategory, Category } from "@/types";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const handleProductClick = (product: ProductWithCategory) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-artisan-cream via-white to-artisan-sage/10">
        <Navigation onSearch={setSearchQuery} />
        <div className="flex items-center justify-center h-64">
          <div className="text-artisan-brown text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-artisan-cream via-white to-artisan-sage/10">
      <Navigation onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-artisan-dark mb-4">Our Products</h1>
          <p className="text-artisan-brown text-lg">
            Discover our carefully curated collection of handcrafted items
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </aside>

          <section className="flex-1">
            {searchQuery && (
              <div className="mb-6">
                <p className="text-artisan-brown">
                  Showing results for "{searchQuery}" ({filteredProducts.length} products)
                </p>
              </div>
            )}
            
            <ProductGrid
              products={filteredProducts}
              onProductClick={handleProductClick}
            />
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-artisan-brown text-lg">
                  {searchQuery || selectedCategory 
                    ? "No products found matching your criteria." 
                    : "No products available at the moment."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={handleCloseModal}
      />

      <ShoppingCart />
    </div>
  );
}