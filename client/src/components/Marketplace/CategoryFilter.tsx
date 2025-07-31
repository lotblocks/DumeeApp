import React from 'react';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories', emoji: 'ðŸŒŸ' },
  { id: 'education', name: 'Education', emoji: 'ðŸ“š' },
  { id: 'creative', name: 'Creative', emoji: 'ðŸŽ¨' },
  { id: 'business', name: 'Business', emoji: 'ðŸ’¼' },
  { id: 'entertainment', name: 'Entertainment', emoji: 'ðŸŽ®' },
  { id: 'productivity', name: 'Productivity', emoji: 'âš¡' },
  { id: 'health', name: 'Health & Wellness', emoji: 'ðŸ¥' },
  { id: 'technology', name: 'Technology', emoji: 'ðŸ’»' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: 'ðŸŒ±' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{category.emoji}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
