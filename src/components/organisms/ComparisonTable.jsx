import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ComparisonTable = ({ properties, onRemove, className }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRemove = (propertyId) => {
    onRemove(propertyId);
    toast.success("Property removed from comparison");
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-card p-6 mb-8", className)}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-primary">
          Property Comparison
        </h2>
        <Button
          variant="outline"
          size="small"
          onClick={() => properties.forEach(p => handleRemove(p.Id))}
        >
          <ApperIcon name="X" className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Mobile View - Stacked Cards */}
      <div className="md:hidden space-y-4">
        {properties.map((property) => (
          <div key={property.Id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <Link 
                to={`/property/${property.Id}`}
                className="text-lg font-display font-semibold text-primary hover:text-accent"
              >
                {property.title}
              </Link>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleRemove(property.Id)}
                className="ml-2"
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Price:</span>
                <div className="font-bold text-accent">{formatPrice(property.price)}</div>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
<div><Badge variant="outline" size="small">{property.property_type}</Badge></div>
              </div>
              <div>
                <span className="text-gray-500">Bedrooms:</span>
                <div className="flex items-center">
                  <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
                  {property.bedrooms}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Bathrooms:</span>
                <div className="flex items-center">
                  <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
                  {property.bathrooms}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Square Feet:</span>
                <div className="flex items-center">
<ApperIcon name="Square" className="h-4 w-4 mr-1" />
                  {property.square_feet?.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Year Built:</span>
<div>{property.year_built}</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-gray-500 text-sm">Location:</span>
              <div className="flex items-center text-sm">
                <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
{property.address}, {property.city}, {property.state}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Property</th>
              {properties.map((property) => (
                <th key={property.Id} className="text-left py-3 px-2 min-w-[200px]">
                  <div className="flex justify-between items-start">
                    <Link 
                      to={`/property/${property.Id}`}
                      className="text-sm font-display font-semibold text-primary hover:text-accent line-clamp-2"
                    >
                      {property.title}
                    </Link>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleRemove(property.Id)}
                      className="ml-2 flex-shrink-0"
                    >
                      <ApperIcon name="X" className="h-4 w-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 px-2 text-sm font-medium text-gray-500">Price</td>
              {properties.map((property) => (
                <td key={property.Id} className="py-4 px-2">
                  <span className="text-lg font-bold text-accent">
                    {formatPrice(property.price)}
                  </span>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="py-4 px-2 text-sm font-medium text-gray-500">Type</td>
              {properties.map((property) => (
                <td key={property.Id} className="py-4 px-2">
<Badge variant="outline" size="small">{property.property_type}</Badge>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="py-4 px-2 text-sm font-medium text-gray-500">Bedrooms</td>
              {properties.map((property) => (
                <td key={property.Id} className="py-4 px-2">
                  <div className="flex items-center text-sm">
                    <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
                    {property.bedrooms}
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="py-4 px-2 text-sm font-medium text-gray-500">Bathrooms</td>
              {properties.map((property) => (
                <td key={property.Id} className="py-4 px-2">
                  <div className="flex items-center text-sm">
                    <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
                    {property.bathrooms}
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="py-4 px-2 text-sm font-medium text-gray-500">Square Feet</td>
              {properties.map((property) => (
                <td key={property.Id} className="py-4 px-2">
                  <div className="flex items-center text-sm">
<ApperIcon name="Square" className="h-4 w-4 mr-1" />
                    {property.square_feet?.toLocaleString()}
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="py-4 px-2 text-sm font-medium text-gray-500">Year Built</td>
              {properties.map((property) => (
                <td key={property.Id} className="py-4 px-2">
<span className="text-sm">{property.year_built}</span>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="py-4 px-2 text-sm font-medium text-gray-500">Location</td>
              {properties.map((property) => (
                <td key={property.Id} className="py-4 px-2">
                  <div className="flex items-center text-sm">
                    <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                    <span className="line-clamp-2">
                      {property.address}, {property.city}, {property.state}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;