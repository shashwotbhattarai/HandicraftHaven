import { Button } from '@/components/ui/button';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section className="bg-white py-8 border-b border-artisan-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant={selectedCategory === null ? "default" : "secondary"}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
              selectedCategory === null 
                ? 'bg-artisan-brown text-white hover:bg-artisan-chocolate' 
                : 'bg-artisan-beige text-artisan-dark hover:bg-artisan-burlywood'
            }`}
            onClick={() => onCategoryChange(null)}
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.id 
                  ? 'bg-artisan-brown text-white hover:bg-artisan-chocolate' 
                  : 'bg-artisan-beige text-artisan-dark hover:bg-artisan-burlywood'
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
