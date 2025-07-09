import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-display font-semibold text-primary mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button variant="primary" onClick={onRetry} className="mb-4">
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <p className="text-sm text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default Error;