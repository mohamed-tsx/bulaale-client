import Link from 'next/link';
import { Category } from '@/lib/api';
import CategoryImage from './CategoryImage';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <CategoryImage
            imageUrl={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="p-4 text-center">
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Shop {category.name.toLowerCase()}
          </p>
        </div>
      </div>
    </Link>
  );
}
