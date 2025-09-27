import Link from 'next/link';
import { Category } from '@/lib/api';
import { getImageUrl } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={getImageUrl(category.imageUrl)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.svg';
            }}
          />
        </div>
        
        <div className="p-4 text-center">
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
