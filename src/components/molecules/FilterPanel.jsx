import React from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterPanel = ({ filters, onFiltersChange, onClear, className }) => {
  const propertyTypes = ["House", "Condo", "Loft", "Townhouse"];
  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4];

  const handleInputChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value === "" ? undefined : value
    });
  };

  const handlePropertyTypeChange = (type) => {
    const currentTypes = filters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFiltersChange({
      ...filters,
      propertyTypes: newTypes
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-card p-6 space-y-6", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-display font-semibold text-primary">Filters</h3>
        <Button variant="ghost" size="small" onClick={onClear}>
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="priceMin">Min Price</Label>
            <Input
              id="priceMin"
              type="number"
              placeholder="0"
              value={filters.priceMin || ""}
              onChange={(e) => handleInputChange("priceMin", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="priceMax">Max Price</Label>
            <Input
              id="priceMax"
              type="number"
              placeholder="No limit"
              value={filters.priceMax || ""}
              onChange={(e) => handleInputChange("priceMax", parseInt(e.target.value))}
            />
          </div>
        </div>
        {(filters.priceMin || filters.priceMax) && (
          <p className="text-sm text-gray-600">
            {filters.priceMin ? formatCurrency(filters.priceMin) : "Any"} - {filters.priceMax ? formatCurrency(filters.priceMax) : "Any"}
          </p>
        )}
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label>Property Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => handlePropertyTypeChange(type)}
              className={cn(
                "p-2 text-sm rounded-md border transition-all duration-200 text-left",
                (filters.propertyTypes || []).includes(type)
                  ? "border-accent bg-accent text-white"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <Label>Minimum Bedrooms</Label>
        <div className="flex gap-2">
          {bedroomOptions.map((num) => (
            <button
              key={num}
              onClick={() => handleInputChange("bedroomsMin", num)}
              className={cn(
                "px-3 py-2 text-sm rounded-md border transition-all duration-200",
                filters.bedroomsMin === num
                  ? "border-accent bg-accent text-white"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="space-y-3">
        <Label>Minimum Bathrooms</Label>
        <div className="flex gap-2">
          {bathroomOptions.map((num) => (
            <button
              key={num}
              onClick={() => handleInputChange("bathroomsMin", num)}
              className={cn(
                "px-3 py-2 text-sm rounded-md border transition-all duration-200",
                filters.bathroomsMin === num
                  ? "border-accent bg-accent text-white"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Square Footage */}
      <div className="space-y-3">
        <Label htmlFor="squareFeetMin">Minimum Square Feet</Label>
        <Input
          id="squareFeetMin"
          type="number"
          placeholder="Any size"
          value={filters.squareFeetMin || ""}
          onChange={(e) => handleInputChange("squareFeetMin", parseInt(e.target.value))}
        />
      </div>

      {/* Year Built */}
      <div className="space-y-3">
        <Label htmlFor="yearBuiltMin">Built After</Label>
        <Input
          id="yearBuiltMin"
          type="number"
          placeholder="Any year"
          value={filters.yearBuiltMin || ""}
          onChange={(e) => handleInputChange("yearBuiltMin", parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default FilterPanel;