import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import VirtualTourViewer from "@/components/molecules/VirtualTourViewer";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import PropertyMap from "@/components/molecules/PropertyMap";
import ImageGallery from "@/components/molecules/ImageGallery";
import { propertyService } from "@/services/api/propertyService";
const PropertyDetailPage = () => {
const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [virtualTour, setVirtualTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
const [favoriteLoading, setFavoriteLoading] = useState(false);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await propertyService.getById(id);
      setProperty(data);
      
      // Load virtual tour if available
      try {
        const tourData = await propertyService.getVirtualTour(id);
        setVirtualTour(tourData);
      } catch (tourErr) {
        // Virtual tour not available, continue without it
        setVirtualTour(null);
      }
      
      // Check if property is in favorites
      const favorite = await propertyService.isFavorite(id);
      setIsFavorite(favorite);
    } catch (err) {
      setError(err.message || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await propertyService.removeFromFavorites(id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await propertyService.addToFavorites(id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error(err.message || "Error updating favorites");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleContact = () => {
    toast.success("Contact information sent to your email!");
  };

  const handleScheduleTour = () => {
    toast.success("Tour scheduled! You'll receive a confirmation email shortly.");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadProperty} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Property not found" onRetry={() => navigate("/")} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="ghost"
          size="small"
          onClick={() => navigate(-1)}
        >
          <ApperIcon name="ChevronLeft" className="h-5 w-5 mr-1" />
          Back
        </Button>
        <Badge variant="outline" size="medium">
          {property.propertyType}
        </Badge>
        <Badge variant="success" size="medium">
          {property.status}
        </Badge>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ImageGallery images={property.images} title={property.title} />
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              {property.title}
            </h1>
            <p className="text-gray-600 flex items-center mb-4">
              <ApperIcon name="MapPin" className="h-5 w-5 mr-2" />
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>
            <div className="text-3xl font-bold text-accent gradient-text mb-4">
              {formatPrice(property.price)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ApperIcon name="Bed" className="h-6 w-6 mx-auto mb-2 text-accent" />
              <div className="text-xl font-bold text-gray-900">{property.bedrooms}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ApperIcon name="Bath" className="h-6 w-6 mx-auto mb-2 text-accent" />
              <div className="text-xl font-bold text-gray-900">{property.bathrooms}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ApperIcon name="Square" className="h-6 w-6 mx-auto mb-2 text-accent" />
              <div className="text-xl font-bold text-gray-900">{property.squareFeet.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Sq Ft</div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="primary"
              size="large"
              onClick={handleScheduleTour}
              className="flex-1"
            >
              <ApperIcon name="Calendar" className="h-5 w-5 mr-2" />
              Schedule Tour
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={handleContact}
              className="flex-1"
            >
              <ApperIcon name="Phone" className="h-5 w-5 mr-2" />
              Contact Agent
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
            >
              <ApperIcon
                name="Heart"
                className={`h-5 w-5 ${isFavorite ? "text-red-500 fill-current" : "text-gray-600"}`}
              />
            </Button>
</div>
        </div>
      </div>
      {/* Virtual Tour Section */}
      {virtualTour && (
        <div className="mb-8">
          <h2 className="text-2xl font-display font-semibold text-primary mb-4">
            Virtual Tour
          </h2>
          <VirtualTourViewer tourData={virtualTour} className="w-full" />
        </div>
      )}
      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-display font-semibold text-primary mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-display font-semibold text-primary mb-4">
              Features & Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <ApperIcon name="Check" className="h-4 w-4 text-success mr-2" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-display font-semibold text-primary mb-4">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium">{property.propertyType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Year Built:</span>
                <span className="font-medium">{property.yearBuilt}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Square Feet:</span>
                <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Price per Sq Ft:</span>
                <span className="font-medium">
                  ${Math.round(property.price / property.squareFeet).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Listing Date:</span>
                <span className="font-medium">
                  {new Date(property.listingDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <Badge variant="success" size="small">{property.status}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-1">
          <PropertyMap property={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;