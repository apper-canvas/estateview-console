import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  type = "text", 
  placeholder, 
  className, 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "border-gray-300 bg-white hover:border-gray-400 focus:border-accent",
    error: "border-error bg-red-50 focus:border-error focus:ring-error"
  };

  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={cn(
        baseStyles,
        error ? variants.error : variants.default,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;