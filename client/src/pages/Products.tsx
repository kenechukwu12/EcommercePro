import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Check, ChevronDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "featured");
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || ""
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Update the URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (priceRange.min) params.set("min", priceRange.min);
    if (priceRange.max) params.set("max", priceRange.max);
    
    const newSearch = params.toString();
    window.history.replaceState(
      null, 
      '', 
      newSearch ? `?${newSearch}` : window.location.pathname
    );
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortBy, priceRange]);

  // Apply filters and sort
  const filteredProducts = products
    ? products
        .filter((product) => {
          let matches = true;
          
          // Filter by search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matches = matches && (
              product.name.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query)
            );
          }
          
          // Filter by category
          if (selectedCategory && matches) {
            matches = matches && product.category === selectedCategory;
          }
          
          // Filter by price range
          if (priceRange.min && matches) {
            const minPrice = parseFloat(priceRange.min);
            const productPrice = product.discountedPrice || product.price;
            matches = matches && productPrice >= minPrice;
          }
          
          if (priceRange.max && matches) {
            const maxPrice = parseFloat(priceRange.max);
            const productPrice = product.discountedPrice || product.price;
            matches = matches && productPrice <= maxPrice;
          }
          
          return matches;
        })
        .sort((a, b) => {
          // Sort products
          switch (sortBy) {
            case "price-low-high":
              return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
            case "price-high-low":
              return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
            case "newest":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "rating":
              return b.rating - a.rating;
            default:
              return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
          }
        })
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("featured");
    setPriceRange({ min: "", max: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Search</h3>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-500">
                    <Search size={16} />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Category</h3>
              {isLoadingCategories ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      className={`justify-start p-2 w-full ${!selectedCategory ? 'bg-gray-100' : ''}`}
                      onClick={() => setSelectedCategory("")}
                    >
                      <Check 
                        className={`mr-2 h-4 w-4 ${!selectedCategory ? 'opacity-100' : 'opacity-0'}`} 
                      />
                      All Categories
                    </Button>
                  </div>
                  {categories?.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Button
                        variant="ghost"
                        className={`justify-start p-2 w-full ${selectedCategory === category.name ? 'bg-gray-100' : ''}`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <Check 
                          className={`mr-2 h-4 w-4 ${selectedCategory === category.name ? 'opacity-100' : 'opacity-0'}`} 
                        />
                        {category.name}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Price Range</h3>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-1/2"
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </h2>
              {/* Applied filters */}
              {(selectedCategory || searchQuery || priceRange.min || priceRange.max) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategory && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                      Category: {selectedCategory}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 p-0 ml-1" 
                        onClick={() => setSelectedCategory("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                      Search: {searchQuery}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 p-0 ml-1" 
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {priceRange.min && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                      Min: ${priceRange.min}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 p-0 ml-1" 
                        onClick={() => setPriceRange({ ...priceRange, min: "" })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {priceRange.max && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                      Max: ${priceRange.max}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 p-0 ml-1" 
                        onClick={() => setPriceRange({ ...priceRange, max: "" })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-56" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// We need the X icon for the badges to clear individual filters
const X = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default Products;
