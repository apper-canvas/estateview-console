import propertiesData from "@/services/mockData/properties.json";
import favoritesData from "@/services/mockData/favorites.json";

let properties = [...propertiesData];
let favorites = [...favoritesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  async search(query) {
    await delay(400);
    if (!query) return [...properties];
    
    const searchTerm = query.toLowerCase();
    return properties.filter(property => 
      property.title.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.state.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm) ||
      property.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  },

  async filter(filters) {
    await delay(300);
    return properties.filter(property => {
      if (filters.priceMin && property.price < filters.priceMin) return false;
      if (filters.priceMax && property.price > filters.priceMax) return false;
      if (filters.propertyTypes && filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.propertyType)) return false;
      if (filters.bedroomsMin && property.bedrooms < filters.bedroomsMin) return false;
      if (filters.bathroomsMin && property.bathrooms < filters.bathroomsMin) return false;
      if (filters.squareFeetMin && property.squareFeet < filters.squareFeetMin) return false;
      if (filters.yearBuiltMin && property.yearBuilt < filters.yearBuiltMin) return false;
      return true;
    });
  },

  async getFavorites() {
    await delay(250);
    const favoritePropertyIds = favorites.map(fav => fav.propertyId);
    return properties.filter(property => favoritePropertyIds.includes(property.Id));
  },

  async addToFavorites(propertyId) {
    await delay(200);
    const existingFavorite = favorites.find(fav => fav.propertyId === parseInt(propertyId));
    if (existingFavorite) {
      throw new Error("Property already in favorites");
    }
    
    const newFavorite = {
      Id: favorites.length > 0 ? Math.max(...favorites.map(f => f.Id)) + 1 : 1,
      propertyId: parseInt(propertyId),
      savedDate: new Date().toISOString().split("T")[0]
    };
    
    favorites.push(newFavorite);
    return { ...newFavorite };
  },

  async removeFromFavorites(propertyId) {
    await delay(200);
    const index = favorites.findIndex(fav => fav.propertyId === parseInt(propertyId));
    if (index === -1) {
      throw new Error("Property not found in favorites");
    }
    
    favorites.splice(index, 1);
    return { success: true };
  },

async isFavorite(propertyId) {
    await delay(100);
    return favorites.some(fav => fav.propertyId === parseInt(propertyId));
  },

  async getVirtualTour(propertyId) {
    await delay(300);
    const property = properties.find(p => p.Id === parseInt(propertyId));
    if (!property || !property.virtualTour) {
      throw new Error("Virtual tour not available for this property");
    }
    return { ...property.virtualTour };
  }
};