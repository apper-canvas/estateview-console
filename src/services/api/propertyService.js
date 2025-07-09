import { toast } from 'react-toastify';

export const propertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "price" } },
          { "field": { "Name": "address" } },
          { "field": { "Name": "city" } },
          { "field": { "Name": "state" } },
          { "field": { "Name": "zip_code" } },
          { "field": { "Name": "property_type" } },
          { "field": { "Name": "bedrooms" } },
          { "field": { "Name": "bathrooms" } },
          { "field": { "Name": "square_feet" } },
          { "field": { "Name": "year_built" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "features" } },
          { "field": { "Name": "images" } },
          { "field": { "Name": "latitude" } },
          { "field": { "Name": "longitude" } },
          { "field": { "Name": "listing_date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "virtual_tour" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "price" } },
          { "field": { "Name": "address" } },
          { "field": { "Name": "city" } },
          { "field": { "Name": "state" } },
          { "field": { "Name": "zip_code" } },
          { "field": { "Name": "property_type" } },
          { "field": { "Name": "bedrooms" } },
          { "field": { "Name": "bathrooms" } },
          { "field": { "Name": "square_feet" } },
          { "field": { "Name": "year_built" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "features" } },
          { "field": { "Name": "images" } },
          { "field": { "Name": "latitude" } },
          { "field": { "Name": "longitude" } },
          { "field": { "Name": "listing_date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "virtual_tour" } }
        ]
      };
      
      const response = await apperClient.getRecordById('property', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message || "Property not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      if (!query) {
        return this.getAll();
      }
      
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "price" } },
          { "field": { "Name": "address" } },
          { "field": { "Name": "city" } },
          { "field": { "Name": "state" } },
          { "field": { "Name": "zip_code" } },
          { "field": { "Name": "property_type" } },
          { "field": { "Name": "bedrooms" } },
          { "field": { "Name": "bathrooms" } },
          { "field": { "Name": "square_feet" } },
          { "field": { "Name": "year_built" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "features" } },
          { "field": { "Name": "images" } },
          { "field": { "Name": "latitude" } },
          { "field": { "Name": "longitude" } },
          { "field": { "Name": "listing_date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "virtual_tour" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "title", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "address", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "city", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "state", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "description", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "features", operator: "Contains", values: [query] }
              ]
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async filter(filters) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const whereConditions = [];
      
      if (filters.priceMin) {
        whereConditions.push({
          fieldName: "price",
          operator: "GreaterThanOrEqualTo",
          values: [filters.priceMin]
        });
      }
      
      if (filters.priceMax) {
        whereConditions.push({
          fieldName: "price",
          operator: "LessThanOrEqualTo",
          values: [filters.priceMax]
        });
      }
      
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        whereConditions.push({
          fieldName: "property_type",
          operator: "ExactMatch",
          values: filters.propertyTypes
        });
      }
      
      if (filters.bedroomsMin) {
        whereConditions.push({
          fieldName: "bedrooms",
          operator: "GreaterThanOrEqualTo",
          values: [filters.bedroomsMin]
        });
      }
      
      if (filters.bathroomsMin) {
        whereConditions.push({
          fieldName: "bathrooms",
          operator: "GreaterThanOrEqualTo",
          values: [filters.bathroomsMin]
        });
      }
      
      if (filters.squareFeetMin) {
        whereConditions.push({
          fieldName: "square_feet",
          operator: "GreaterThanOrEqualTo",
          values: [filters.squareFeetMin]
        });
      }
      
      if (filters.yearBuiltMin) {
        whereConditions.push({
          fieldName: "year_built",
          operator: "GreaterThanOrEqualTo",
          values: [filters.yearBuiltMin]
        });
      }
      
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "price" } },
          { "field": { "Name": "address" } },
          { "field": { "Name": "city" } },
          { "field": { "Name": "state" } },
          { "field": { "Name": "zip_code" } },
          { "field": { "Name": "property_type" } },
          { "field": { "Name": "bedrooms" } },
          { "field": { "Name": "bathrooms" } },
          { "field": { "Name": "square_feet" } },
          { "field": { "Name": "year_built" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "features" } },
          { "field": { "Name": "images" } },
          { "field": { "Name": "latitude" } },
          { "field": { "Name": "longitude" } },
          { "field": { "Name": "listing_date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "virtual_tour" } }
        ],
        where: whereConditions
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error filtering properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getFavorites() {
    try {
      const { favoriteService } = await import('./favoriteService');
      const favorites = await favoriteService.getAll();
      
      if (!favorites || favorites.length === 0) {
        return [];
      }
      
      const propertyIds = favorites.map(fav => fav.property_id);
      const properties = [];
      
      for (const propertyId of propertyIds) {
        try {
          const property = await this.getById(propertyId);
          if (property) {
            properties.push(property);
          }
        } catch (error) {
          console.error(`Error fetching property ${propertyId}:`, error.message);
        }
      }
      
      return properties;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching favorites:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async addToFavorites(propertyId) {
    try {
      const { favoriteService } = await import('./favoriteService');
      const newFavorite = await favoriteService.create({
        property_id: parseInt(propertyId),
        saved_date: new Date().toISOString().split("T")[0]
      });
      
      return newFavorite;
    } catch (error) {
      throw error;
    }
  },

  async removeFromFavorites(propertyId) {
    try {
      const { favoriteService } = await import('./favoriteService');
      const favorites = await favoriteService.getAll();
      const favorite = favorites.find(fav => fav.property_id === parseInt(propertyId));
      
      if (!favorite) {
        throw new Error("Property not found in favorites");
      }
      
      await favoriteService.delete(favorite.Id);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async isFavorite(propertyId) {
    try {
      const { favoriteService } = await import('./favoriteService');
      const favorites = await favoriteService.getAll();
      return favorites.some(fav => fav.property_id === parseInt(propertyId));
    } catch (error) {
      console.error("Error checking favorite status:", error.message);
      return false;
    }
  },

  async getVirtualTour(propertyId) {
    try {
      const property = await this.getById(propertyId);
      if (!property || !property.virtual_tour) {
        throw new Error("Virtual tour not available for this property");
      }
      return property.virtual_tour;
    } catch (error) {
      throw error;
    }
  }
};