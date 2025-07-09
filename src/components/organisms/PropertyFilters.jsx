import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import FilterPanel from "@/components/molecules/FilterPanel";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PropertyFilters = ({ filters, onFiltersChange, onApplyFilters, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.propertyTypes?.length) count++;
    if (filters.bedroomsMin) count++;
    if (filters.bathroomsMin) count++;
    if (filters.squareFeetMin) count++;
    if (filters.yearBuiltMin) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={cn("", className)}>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClear={handleClearFilters}
        />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center">
            <ApperIcon name="Filter" className="h-5 w-5 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ApperIcon name={isOpen ? "ChevronUp" : "ChevronDown"} className="h-5 w-5" />
        </Button>

        {isOpen && (
          <div className="mt-4 space-y-4">
            <FilterPanel
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClear={handleClearFilters}
            />
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;