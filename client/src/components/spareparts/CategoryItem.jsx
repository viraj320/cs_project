import React from 'react';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';

const CategoryItem = ({ category, isExpanded, onToggle }) => {
  return (
    <div className="flex flex-col">
      {/* Parent category */}
      <div
        className="flex items-center gap-2 cursor-pointer text-blue-700 font-semibold hover:text-blue-900"
        onClick={onToggle}
      >
        {/* Always show + or - */}
        {isExpanded ? (
          <FaMinusSquare size={18} />
        ) : (
          <FaPlusSquare size={18} />
        )}
        <span className="truncate">{category.name}</span>
      </div>

      {/* Subcategories (only if expanded) */}
      {isExpanded && category.subcategories && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          {category.subcategories.map((sub, subIndex) => (
            <div
              key={subIndex}
              className="flex justify-between text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              <span>{sub.name}</span>
              <span>({sub.count})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
