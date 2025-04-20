import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent event bubbling
    
    addToCart({
      productId: product.id,
      quantity: 1,
      product: product
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent event bubbling
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  // Create rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-amber-400" />);
    }
    
    return stars;
  };

  return (
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <img 
            className="w-full h-56 object-cover object-center transition-transform group-hover:scale-105" 
            src={product.image} 
            alt={product.name} 
          />
          {product.badge && (
            <Badge 
              className={`absolute top-2 right-2 ${
                product.badge === 'Sale' 
                  ? 'bg-red-500' 
                  : product.badge === 'New' 
                    ? 'bg-orange-500' 
                    : 'bg-green-500'
              }`}
            >
              {product.badge}
            </Badge>
          )}
          <Button 
            size="icon"
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-white text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
          <div className="flex mb-2">
            <div className="flex">
              {renderRatingStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500 ml-1">{product.reviewCount} reviews</span>
          </div>
          <div className="flex justify-between items-center">
            {product.discountedPrice ? (
              <div>
                <span className="text-lg font-bold text-gray-900">${product.discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full mt-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
