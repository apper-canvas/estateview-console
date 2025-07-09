import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No properties found",
  description = "Try adjusting your search criteria or filters to find more properties.",
  actionText = "View All Properties",
  onAction,
  icon = "Search",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-display font-semibold text-primary mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {onAction && (
          <Button variant="primary" onClick={onAction}>
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;