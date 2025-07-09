import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-gradient-to-r from-accent to-info p-2 rounded-lg mr-3">
              <ApperIcon name="Home" className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-primary">
              EstateView
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                "text-base font-medium transition-colors hover:text-accent",
                isActive("/") ? "text-accent" : "text-gray-700"
              )}
            >
              All Listings
            </Link>
            <Link
              to="/favorites"
              className={cn(
                "text-base font-medium transition-colors hover:text-accent flex items-center",
                isActive("/favorites") ? "text-accent" : "text-gray-700"
              )}
            >
              <ApperIcon name="Heart" className="h-4 w-4 mr-1" />
              Favorites
            </Link>
            <Link
              to="/search"
              className={cn(
                "text-base font-medium transition-colors hover:text-accent flex items-center",
                isActive("/search") ? "text-accent" : "text-gray-700"
              )}
            >
              <ApperIcon name="Search" className="h-4 w-4 mr-1" />
              Search
            </Link>
          </nav>

          {/* Desktop Search */}
          <div className="hidden lg:block w-96">
            <SearchBar placeholder="Search by location, property type..." />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="small"
            onClick={toggleMobileMenu}
            className="md:hidden"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <SearchBar placeholder="Search properties..." />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 px-3 rounded-lg text-base font-medium transition-colors",
                isActive("/") 
                  ? "text-accent bg-accent bg-opacity-10" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              All Listings
            </Link>
            <Link
              to="/favorites"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 px-3 rounded-lg text-base font-medium transition-colors flex items-center",
                isActive("/favorites") 
                  ? "text-accent bg-accent bg-opacity-10" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <ApperIcon name="Heart" className="h-4 w-4 mr-2" />
              Favorites
            </Link>
            <Link
              to="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 px-3 rounded-lg text-base font-medium transition-colors flex items-center",
                isActive("/search") 
                  ? "text-accent bg-accent bg-opacity-10" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <ApperIcon name="Search" className="h-4 w-4 mr-2" />
              Search
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;