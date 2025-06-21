import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cart-context';

interface NavigationProps {
  onSearch: (query: string) => void;
}

export function Navigation({ onSearch }: NavigationProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, setIsCartOpen } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/maker-stories', label: 'Maker Stories' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-artisan-beige sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-display font-bold text-artisan-brown cursor-pointer">
                Everest Drishti Craft
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`cursor-pointer transition-colors duration-200 ${
                  location === link.href 
                    ? 'text-artisan-brown font-medium' 
                    : 'text-artisan-dark hover:text-artisan-brown'
                }`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border-artisan-beige focus:ring-artisan-brown focus:border-transparent"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-artisan-medium" />
            </form>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative text-artisan-dark hover:text-artisan-brown"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-artisan-chocolate text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-artisan-dark hover:text-artisan-brown"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-artisan-beige bg-white">
          <div className="px-4 py-2 space-y-2">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span 
                  className="block py-2 text-artisan-dark hover:text-artisan-brown cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-artisan-beige focus:ring-artisan-brown"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-artisan-medium" />
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
