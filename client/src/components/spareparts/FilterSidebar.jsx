import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterSection from '../../components/spareparts/FilterSection';

const FilterSidebar = ({ selectedCategoryId, onFiltersChange }) => {
  const [expanded, setExpanded] = useState({
    productGrade: false,
    fitment: false,
    brand: false,
    price: false,
    availability: false,
  });

  const [filterOptions, setFilterOptions] = useState({
    productGrade: [],
    fitment: [],
    brand: [],
    price: [],
    availability: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    productGrade: [],
    fitment: [],
    brand: [],
    priceRange: [],
    availability: [],
  });

  const toggleSection = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch and build filter options from products
  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (!selectedCategoryId) {
        setFilterOptions({
          productGrade: [],
          fitment: [],
          brand: [],
          price: [],
          availability: [],
        });
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/spare-parts/category/${selectedCategoryId}`
        );

        // Process products to generate filter options
        const grades = {};
        const fitments = {};
        const brands = {};
        const availabilities = {};
        const priceRanges = {
          '$0 - $50': 0,
          '$51 - $100': 0,
          '$101 - $200': 0,
          '$201 - $500': 0,
          '$500+': 0,
        };

        data.forEach((item) => {
          // Product Grade
          if (item.productGrade) {
            grades[item.productGrade] = (grades[item.productGrade] || 0) + 1;
          }

          // Fitment
          if (item.fitment) {
            fitments[item.fitment] = (fitments[item.fitment] || 0) + 1;
          }

          // Brand
          if (item.specifications?.brand) {
            brands[item.specifications.brand] = (brands[item.specifications.brand] || 0) + 1;
          }

          // Availability
          if (item.availability) {
            availabilities[item.availability] = (availabilities[item.availability] || 0) + 1;
          }

          // Price Range
          if (item.price) {
            if (item.price <= 50) priceRanges['$0 - $50']++;
            else if (item.price <= 100) priceRanges['$51 - $100']++;
            else if (item.price <= 200) priceRanges['$101 - $200']++;
            else if (item.price <= 500) priceRanges['$201 - $500']++;
            else priceRanges['$500+']++;
          }
        });

        setFilterOptions({
          productGrade: Object.entries(grades).map(([name, count]) => ({ name, count })),
          fitment: Object.entries(fitments).map(([name, count]) => ({ name, count })),
          brand: Object.entries(brands).map(([name, count]) => ({ name, count })),
          price: Object.entries(priceRanges).map(([name, count]) => ({ name, count })).filter(item => item.count > 0),
          availability: Object.entries(availabilities).map(([name, count]) => ({ name, count })),
        });
      } catch (e) {
        console.error("Error fetching filter options:", e);
      }
    };

    fetchFilterOptions();
  }, [selectedCategoryId]);

  const handleFilterChange = (filterType, filterValue) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      const filterKey = filterType === 'price' ? 'priceRange' : filterType;

      if (updatedFilters[filterKey].includes(filterValue)) {
        updatedFilters[filterKey] = updatedFilters[filterKey].filter((f) => f !== filterValue);
      } else {
        updatedFilters[filterKey] = [...updatedFilters[filterKey], filterValue];
      }

      // Notify parent of filter changes
      if (onFiltersChange) {
        onFiltersChange(updatedFilters);
      }

      return updatedFilters;
    });
  };

  if (!selectedCategoryId) {
    return (
      <div className="w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Filters</h2>
        <p className="text-center text-gray-500 text-sm">Select a category to view filters</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-md shadow-md overflow-y-auto max-h-screen">
      <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">All Filters</h2>

      {/* Product Grade */}
      {filterOptions.productGrade.length > 0 && (
        <div className="border-b py-4">
          <div
            className="flex justify-between items-center cursor-pointer font-semibold text-black"
            onClick={() => toggleSection('productGrade')}
          >
            <span>Product Grade</span>
            <span>{expanded.productGrade ? '−' : '+'}</span>
          </div>
          {expanded.productGrade && (
            <div className="mt-3 flex flex-col gap-2">
              {filterOptions.productGrade.map((option) => (
                <div key={option.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`grade-${option.name}`}
                    checked={selectedFilters.productGrade.includes(option.name)}
                    onChange={() => handleFilterChange('productGrade', option.name)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`grade-${option.name}`} className="text-gray-700 cursor-pointer flex-1">
                    {option.name}
                  </label>
                  <span className="text-gray-400 text-sm">({option.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fitment */}
      {filterOptions.fitment.length > 0 && (
        <div className="border-b py-4">
          <div
            className="flex justify-between items-center cursor-pointer font-semibold text-black"
            onClick={() => toggleSection('fitment')}
          >
            <span>Fitment</span>
            <span>{expanded.fitment ? '−' : '+'}</span>
          </div>
          {expanded.fitment && (
            <div className="mt-3 flex flex-col gap-2">
              {filterOptions.fitment.map((option) => (
                <div key={option.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`fitment-${option.name}`}
                    checked={selectedFilters.fitment.includes(option.name)}
                    onChange={() => handleFilterChange('fitment', option.name)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`fitment-${option.name}`} className="text-gray-700 cursor-pointer flex-1">
                    {option.name}
                  </label>
                  <span className="text-gray-400 text-sm">({option.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brand */}
      {filterOptions.brand.length > 0 && (
        <div className="border-b py-4">
          <div
            className="flex justify-between items-center cursor-pointer font-semibold text-black"
            onClick={() => toggleSection('brand')}
          >
            <span>Brand</span>
            <span>{expanded.brand ? '−' : '+'}</span>
          </div>
          {expanded.brand && (
            <div className="mt-3 flex flex-col gap-2">
              {filterOptions.brand.map((option) => (
                <div key={option.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`brand-${option.name}`}
                    checked={selectedFilters.brand.includes(option.name)}
                    onChange={() => handleFilterChange('brand', option.name)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`brand-${option.name}`} className="text-gray-700 cursor-pointer flex-1">
                    {option.name}
                  </label>
                  <span className="text-gray-400 text-sm">({option.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price */}
      {filterOptions.price.length > 0 && (
        <div className="border-b py-4">
          <div
            className="flex justify-between items-center cursor-pointer font-semibold text-black"
            onClick={() => toggleSection('price')}
          >
            <span>Price</span>
            <span>{expanded.price ? '−' : '+'}</span>
          </div>
          {expanded.price && (
            <div className="mt-3 flex flex-col gap-2">
              {filterOptions.price.map((option) => (
                <div key={option.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`price-${option.name}`}
                    checked={selectedFilters.priceRange.includes(option.name)}
                    onChange={() => handleFilterChange('price', option.name)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`price-${option.name}`} className="text-gray-700 cursor-pointer flex-1">
                    {option.name}
                  </label>
                  <span className="text-gray-400 text-sm">({option.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Availability */}
      {filterOptions.availability.length > 0 && (
        <div className="border-b py-4">
          <div
            className="flex justify-between items-center cursor-pointer font-semibold text-black"
            onClick={() => toggleSection('availability')}
          >
            <span>Availability</span>
            <span>{expanded.availability ? '−' : '+'}</span>
          </div>
          {expanded.availability && (
            <div className="mt-3 flex flex-col gap-2">
              {filterOptions.availability.map((option) => (
                <div key={option.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`avail-${option.name}`}
                    checked={selectedFilters.availability.includes(option.name)}
                    onChange={() => handleFilterChange('availability', option.name)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`avail-${option.name}`} className="text-gray-700 cursor-pointer flex-1">
                    {option.name}
                  </label>
                  <span className="text-gray-400 text-sm">({option.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
