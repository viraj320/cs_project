import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="inline-flex rounded-md shadow-sm">
        
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-l-md"
        >
          ‹
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-4 py-2 border-t border-b border-gray-300 ${
              currentPage === index + 1 ? 'bg-gray-500 text-white' : 'text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-r-md"
        >
          ›
        </button>

      </div>
    </div>
  );
};

export default Pagination;
