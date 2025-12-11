import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FilterSection = ({ title, icon, isExpanded, onToggle, options = [] }) => {
  return (
    <div className="border-b py-6">
      {/* Section Title */}
      <div
        className="flex justify-between items-center cursor-pointer font-semibold text-black"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
        {isExpanded ? <FaMinus /> : <FaPlus />}
      </div>

      {/* Section Content */}
      {isExpanded && options.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {options.map((option, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">{option.name}</span>
              </div>
              <span className="text-gray-400 text-sm">({option.count})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
