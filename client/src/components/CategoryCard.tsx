import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
      <div className="group relative rounded-lg overflow-hidden shadow-md block cursor-pointer">
        <img 
          className="w-full h-40 md:h-56 object-cover transition-transform group-hover:scale-105" 
          src={category.image} 
          alt={category.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
