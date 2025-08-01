import React from "react";
import PropertyCard from "@/components/molecules/PropertyCard";
import { cn } from "@/utils/cn";

const PropertyGrid = ({ properties, className, onComparisonToggle, comparisonIds = [] }) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      className
    )}>
      {properties.map((property) => (
        <PropertyCard 
          key={property.Id} 
          property={property} 
          onComparisonToggle={onComparisonToggle}
          isInComparison={comparisonIds.includes(property.Id)}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;