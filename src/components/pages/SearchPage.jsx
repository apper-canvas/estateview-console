import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const searchProperties = async (searchQuery) => {
    if (!searchQuery) {
      setProperties([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await propertyService.search(searchQuery);
      setProperties(data);
    } catch (err) {
      setError(err.message || "Failed to search properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sorted = [...properties].sort((a, b) => {
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
    setProperties(sorted);
  };

  const clearSearch = () => {
    setSearchParams({});
    setProperties([]);
  };

  useEffect(() => {
    if (query) {
      searchProperties(query);
    } else {
      setProperties([]);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Search Properties
        </h1>
        <p className="text-gray-600 mb-6">
          Find your perfect property by location, type, or features
        </p>
        
        <div className="max-w-2xl">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by location, property type, or features..."
          />
        </div>
      </div>

      {query && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-sm text-gray-700">
              Search results for: <span className="font-medium">"{query}"</span>
            </span>
            <Button
              variant="outline"
              size="small"
              onClick={clearSearch}
            >
              <ApperIcon name="X" className="h-4 w-4 mr-1" />
              Clear Search
            </Button>
          </div>
        </div>
      )}

      {loading && <Loading />}

      {error && (
        <Error message={error} onRetry={() => searchProperties(query)} />
      )}

      {!loading && !error && query && properties.length === 0 && (
        <Empty
          title="No properties found"
          description={`No properties match your search for "${query}". Try different keywords or browse all properties.`}
          actionText="Browse All Properties"
          onAction={() => navigate("/")}
          icon="Search"
        />
      )}

      {!loading && !error && !query && (
        <Empty
          title="Start your search"
          description="Use the search bar above to find properties by location, type, or features."
          actionText="Browse All Properties"
          onAction={() => navigate("/")}
          icon="Search"
        />
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {properties.length} propert{properties.length !== 1 ? "ies" : "y"} found
            </span>
            
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
          
          <PropertyGrid properties={properties} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;