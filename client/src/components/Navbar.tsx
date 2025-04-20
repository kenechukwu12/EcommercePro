import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Menu, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [location] = useLocation();
  const { cart, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                ShopEase
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 text-sm font-medium ${
                  location === "/" ? "text-primary" : "text-gray-500 hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`px-3 py-2 text-sm font-medium ${
                  location === "/about" ? "text-primary" : "text-gray-500 hover:text-primary"
                }`}
              >
                About
              </Link>
              <Link 
                href="/products" 
                className={`px-3 py-2 text-sm font-medium ${
                  location.startsWith("/products") ? "text-primary" : "text-gray-500 hover:text-primary"
                }`}
              >
                Products
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                className="w-64 pl-10 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-500">
                <Search size={16} />
              </div>
            </form>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleCart}
              className="text-gray-500 hover:text-primary relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0"
                  variant="outline"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-500 hover:text-primary"
              asChild
            >
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center sm:hidden">
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-primary"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/" 
                  ? "text-primary bg-gray-100" 
                  : "text-gray-500 hover:text-primary hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/about" 
                  ? "text-primary bg-gray-100" 
                  : "text-gray-500 hover:text-primary hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/products" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.startsWith("/products") 
                  ? "text-primary bg-gray-100" 
                  : "text-gray-500 hover:text-primary hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <form 
                  onSubmit={(e) => {
                    handleSearch(e);
                    setMobileMenuOpen(false);
                  }} 
                  className="relative w-full"
                >
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-500">
                    <Search size={16} />
                  </div>
                </form>
              </div>
              <div className="mt-3 px-2 flex space-x-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    toggleCart();
                    setMobileMenuOpen(false);
                  }}
                >
                  Cart ({cartItemsCount})
                </Button>
                <Button 
                  className="flex-1"
                  asChild
                >
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
