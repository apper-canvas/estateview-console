import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import ComparisonTable from "@/components/organisms/ComparisonTable";
import PropertyFilters from "@/components/organisms/PropertyFilters";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [comparisonIds, setComparisonIds] = useState([]);
  const [comparisonProperties, setComparisonProperties] = useState([]);
  const navigate = useNavigate();

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await propertyService.getAll();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (newFilters) => {
    try {
      setLoading(true);
      setError("");
      const filtered = await propertyService.filter(newFilters);
      setFilteredProperties(filtered);
      setFilters(newFilters);
    } catch (err) {
      setError(err.message || "Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredProperties].sort((a, b) => {
      switch (sortType) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.listingDate) - new Date(a.listingDate);
        case "oldest":
          return new Date(a.listingDate) - new Date(b.listingDate);
        case "sqft-large":
          return b.squareFeet - a.squareFeet;
        case "sqft-small":
          return a.squareFeet - b.squareFeet;
        default:
          return 0;
      }
    });
    setFilteredProperties(sorted);
};

  const handleComparisonToggle = async (propertyId) => {
    if (comparisonIds.includes(propertyId)) {
      // Remove from comparison
      setComparisonIds(prev => prev.filter(id => id !== propertyId));
      setComparisonProperties(prev => prev.filter(p => p.Id !== propertyId));
    } else {
      // Add to comparison (max 4 properties)
      if (comparisonIds.length >= 4) {
        toast.error("You can compare up to 4 properties at a time");
        return;
      }
      
      try {
        const property = await propertyService.getById(propertyId);
        setComparisonIds(prev => [...prev, propertyId]);
        setComparisonProperties(prev => [...prev, property]);
      } catch (error) {
        toast.error("Error adding property to comparison");
      }
    }
  };

  const handleRemoveFromComparison = (propertyId) => {
    setComparisonIds(prev => prev.filter(id => id !== propertyId));
    setComparisonProperties(prev => prev.filter(p => p.Id !== propertyId));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Premium Properties
        </h1>
        <p className="text-gray-600">
          Discover your dream home from our curated collection of premium properties
        </p>
      </div>

      <ComparisonTable 
        properties={comparisonProperties}
        onRemove={handleRemoveFromComparison}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <PropertyFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={applyFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {filteredProperties.length} properties found
              </span>
              {Object.keys(filters).length > 0 && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => applyFilters({})}
                >
                  <ApperIcon name="X" className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sqft-large">Largest First</option>
                <option value="sqft-small">Smallest First</option>
              </select>
            </div>
          </div>

          {error && (
            <Error message={error} onRetry={loadProperties} />
          )}

          {!error && filteredProperties.length === 0 && (
            <Empty
              title="No properties found"
              description="Try adjusting your search criteria or filters to find more properties."
              actionText="Clear All Filters"
              onAction={() => applyFilters({})}
            />
          )}

          {!error && filteredProperties.length > 0 && (
<PropertyGrid 
              properties={filteredProperties} 
              onComparisonToggle={handleComparisonToggle}
              comparisonIds={comparisonIds}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;