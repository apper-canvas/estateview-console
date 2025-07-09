import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { propertyService } from "@/services/api/propertyService";

const PropertyCard = ({ property, className, onComparisonToggle, isInComparison }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorite = await propertyService.isFavorite(property.Id);
        setIsFavorite(favorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [property.Id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      if (isFavorite) {
        await propertyService.removeFromFavorites(property.Id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await propertyService.addToFavorites(property.Id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
} catch (error) {
      toast.error(error.message || "Error updating favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparisonToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onComparisonToggle) return;
    
    setIsComparisonLoading(true);
    try {
      await onComparisonToggle(property.Id);
      if (isInComparison) {
        toast.success("Removed from comparison");
      } else {
        toast.success("Added to comparison");
      }
    } catch (error) {
      toast.error(error.message || "Error updating comparison");
    } finally {
      setIsComparisonLoading(false);
    }
  };

const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden card-hover", className)}>
      <Link to={`/property/${property.Id}`} className="block">
        <div className="relative">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
<div className="absolute top-3 right-3 flex space-x-2">
            {onComparisonToggle && (
              <Button
                variant="ghost"
                size="small"
                onClick={handleComparisonToggle}
                disabled={isComparisonLoading}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md"
              >
                <ApperIcon
                  name={isInComparison ? "GitCompare" : "GitCompare"}
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isInComparison ? "text-accent" : "text-gray-600"
                  )}
                />
              </Button>
            )}
            <Button
              variant="ghost"
              size="small"
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md"
            >
              <ApperIcon
                name={isFavorite ? "Heart" : "Heart"}
                className={cn(
                  "h-5 w-5 transition-colors",
                  isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                )}
              />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge variant="primary" size="medium">
              {property.propertyType}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-display font-semibold text-primary line-clamp-1">
              {property.title}
            </h3>
            <span className="text-xl font-bold text-accent gradient-text">
              {formatPrice(property.price)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 flex items-center">
            <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
            {property.address}, {property.city}, {property.state}
          </p>
          
          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
                {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
                {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Square" className="h-4 w-4 mr-1" />
                {property.squareFeet.toLocaleString()} sq ft
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {property.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" size="small">
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge variant="outline" size="small">
                +{property.features.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Listed {new Date(property.listingDate).toLocaleDateString()}
            </span>
            <Badge variant="success" size="small">
              {property.status}
            </Badge>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;