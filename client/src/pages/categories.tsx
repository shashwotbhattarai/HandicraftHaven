import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "@/components/shopping-cart";
import { Link } from "wouter";
import type { Category, ProductWithCategory } from "@/types";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products"],
  });

  const getCategoryProductCount = (categoryId: number) => {
    return products.filter(product => product.categoryId === categoryId).length;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-artisan-cream via-white to-artisan-sage/10">
        <Navigation onSearch={setSearchQuery} />
        <div className="flex items-center justify-center h-64">
          <div className="text-artisan-brown text-lg">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-artisan-cream via-white to-artisan-sage/10">
      <Navigation onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-artisan-dark mb-4">Product Categories</h1>
          <p className="text-artisan-brown text-lg">
            Explore our different categories of handcrafted products
          </p>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <p className="text-artisan-brown">
              Showing results for "{searchQuery}" ({filteredCategories.length} categories)
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const productCount = getCategoryProductCount(category.id);
            
            return (
              <Card key={category.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-artisan-sage/20">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-artisan-dark">
                      {category.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-artisan-sage/10 text-artisan-brown">
                      {productCount} {productCount === 1 ? 'product' : 'products'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {category.description && (
                    <p className="text-artisan-brown mb-4 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <Link href={`/products?category=${category.id}`}>
                      <Button 
                        className="bg-artisan-chocolate hover:bg-artisan-brown text-white transition-colors duration-200"
                        disabled={productCount === 0}
                      >
                        View Products
                      </Button>
                    </Link>
                    {productCount === 0 && (
                      <span className="text-sm text-gray-500">No products yet</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-artisan-brown text-lg">
              {searchQuery 
                ? "No categories found matching your search." 
                : "No categories available at the moment."}
            </p>
          </div>
        )}
      </main>

      <ShoppingCart />
    </div>
  );
}