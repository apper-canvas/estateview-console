import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PropertyMap = ({ property, className }) => {
  // Using a placeholder map since we don't have actual map integration
  const mapUrl = `https://via.placeholder.com/600x400/e2e8f0/64748b?text=Map+View+%0A${property.address}%0A${property.city}%2C+${property.state}`;

  const handleDirections = () => {
    const query = encodeURIComponent(`${property.address}, ${property.city}, ${property.state}`);
    window.open(`https://maps.google.com/maps?q=${query}`, "_blank");
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-card overflow-hidden", className)}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-display font-semibold text-primary">Location</h3>
          <button
            onClick={handleDirections}
            className="flex items-center text-accent hover:text-info transition-colors"
          >
            <ApperIcon name="Navigation" className="h-4 w-4 mr-1" />
            Get Directions
          </button>
        </div>
      </div>
      
      <div className="relative">
        <img
          src={mapUrl}
          alt="Property location map"
          className="w-full h-64 object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-start">
              <ApperIcon name="MapPin" className="h-5 w-5 text-accent mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{property.address}</p>
                <p className="text-sm text-gray-600">{property.city}, {property.state} {property.zipCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
          <span>Walking distance to downtown: ~15 minutes</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Car" className="h-4 w-4 mr-2" />
          <span>Parking: Street parking available</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Train" className="h-4 w-4 mr-2" />
          <span>Transit: Bus stop 0.2 miles away</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;