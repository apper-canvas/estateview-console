import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await propertyService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          My Favorites
        </h1>
        <p className="text-gray-600">
          Properties you've saved for later viewing
        </p>
      </div>

      {error && (
        <Error message={error} onRetry={loadFavorites} />
      )}

      {!error && favorites.length === 0 && (
        <Empty
          title="No favorites yet"
          description="Start browsing properties and save your favorites to view them here."
          actionText="Browse Properties"
          onAction={() => navigate("/")}
          icon="Heart"
        />
      )}

      {!error && favorites.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              {favorites.length} favorite{favorites.length !== 1 ? "s" : ""} found
            </span>
            <Button
              variant="outline"
              size="small"
              onClick={() => navigate("/")}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
              Add More
            </Button>
          </div>
          
          <PropertyGrid properties={favorites} />
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;