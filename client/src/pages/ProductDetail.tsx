import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ChevronRight, Minus, Plus, Star, StarHalf, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });

  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    select: (data) => data.filter(p => p.category === product?.category && p.id !== productId).slice(0, 4),
    enabled: !!product,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      quantity,
      product,
      color: selectedColor,
      size: selectedSize
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Create rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-amber-400 text-amber-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-amber-400 text-amber-400" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-5 w-5 text-amber-400" />);
    }
    
    return stars;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link href="/products" className="text-gray-500 hover:text-primary">Products</Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-primary">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-contain aspect-square"
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderRatingStars(product.rating)}
            </div>
            <span className="text-gray-500">{product.reviewCount} reviews</span>
          </div>
          
          <div className="mb-6">
            {product.discountedPrice ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900 mr-3">${product.discountedPrice.toFixed(2)}</span>
                <span className="text-xl text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="ml-3 px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                  {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Color Selection - Just an example, we don't have colors in our schema */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
            <div className="flex space-x-2">
              {["Red", "Blue", "Black", "White"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color 
                      ? 'border-primary' 
                      : 'border-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    border: color.toLowerCase() === 'white' ? '1px solid #e5e7eb' : undefined
                  }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          
          {/* Size Selection - Just an example, we don't have sizes in our schema */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">Small</SelectItem>
                <SelectItem value="M">Medium</SelectItem>
                <SelectItem value="L">Large</SelectItem>
                <SelectItem value="XL">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= (product.stock || 10)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="ml-4 text-sm text-gray-500">
                {product.stock ? `${product.stock} available` : 'In stock'}
              </span>
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1" 
              size="lg"
              asChild
            >
              <Link href="/checkout">Buy Now</Link>
            </Button>
          </div>
          
          {/* Shipping/Returns Info */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-gray-600">30-day easy returns</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-gray-600">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Product Description</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel
              ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
              nisl sit amet nisl.
            </p>
            <p className="text-gray-600 mt-4">
              Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
              nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
              eget aliquam nisl nisl sit amet nisl.
            </p>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
                <span className="text-gray-600">Material</span>
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
                <span className="text-gray-600">Weight</span>
                <span className="font-medium">0.5 kg</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
                <span className="text-gray-600">Dimensions</span>
                <span className="font-medium">30 x 20 x 10 cm</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
                <span className="text-gray-600">Warranty</span>
                <span className="font-medium">1 Year</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex mr-2">
                {renderRatingStars(product.rating)}
              </div>
              <span className="text-gray-600">Based on {product.reviewCount} reviews</span>
            </div>
            
            <div className="space-y-6">
              {/* Sample reviews since we don't have real reviews in our schema */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderRatingStars(5)}
                  </div>
                  <span className="text-gray-600 text-sm">2 weeks ago</span>
                </div>
                <h4 className="font-medium mb-1">John D.</h4>
                <p className="text-gray-600">
                  Great product! Exactly as described and arrived quickly. Would definitely recommend.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderRatingStars(4)}
                  </div>
                  <span className="text-gray-600 text-sm">1 month ago</span>
                </div>
                <h4 className="font-medium mb-1">Sarah M.</h4>
                <p className="text-gray-600">
                  Very good quality for the price. Shipping was a bit slow but the product itself is excellent.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderRatingStars(5)}
                  </div>
                  <span className="text-gray-600 text-sm">2 months ago</span>
                </div>
                <h4 className="font-medium mb-1">Michael P.</h4>
                <p className="text-gray-600">
                  Absolutely love it! This is my second purchase and I'm just as satisfied as the first time.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        
        {isLoadingRelated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        ) : relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No related products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
