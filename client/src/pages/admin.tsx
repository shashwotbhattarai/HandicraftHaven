import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { ProductManagement } from '@/components/admin/product-management';
import { CategoryManagement } from '@/components/admin/category-management';
import { OrdersManagement } from '@/components/admin/orders-management';
import { MakerStoriesManagement } from '@/components/admin/maker-stories-management';
import { AdminLogin } from '@/components/admin-login';
import { useAdminAuth } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Package, Tags, ShoppingBag, BarChart3, LogOut, Home, Users } from 'lucide-react';
import { Link } from 'wouter';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const { isAuthenticated, logout } = useAdminAuth();

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'maker-stories', label: 'Maker Stories', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'maker-stories':
        return <MakerStoriesManagement />;
      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-artisan-dark mb-4">Analytics Dashboard</h3>
            <p className="text-artisan-medium">Analytics dashboard coming soon. Here you'll be able to view sales reports, popular products, and customer insights.</p>
          </div>
        );
      default:
        return <ProductManagement />;
    }
  };

  return (
    <>
      <Navigation onSearch={() => {}} />
      
      <section className="py-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-6">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Store
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={logout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            <h1 className="text-4xl font-display font-bold text-artisan-brown mb-4">Admin Dashboard</h1>
            <p className="text-xl text-artisan-medium">Manage your products, categories, and orders</p>
          </div>
          
          {/* Admin Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "secondary"}
                  className={`px-6 py-3 font-medium transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-artisan-brown text-white hover:bg-artisan-chocolate' 
                      : 'bg-artisan-beige text-artisan-dark hover:bg-artisan-burlywood'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
          
          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </section>
    </>
  );
}
