export const validatePropertyForm = (data) => {
  const errors = {};

  if (!data.title || data.title.length < 5 || data.title.length > 100) {
    errors.title = 'Title must be between 5 and 100 characters.';
  }

  if (!data.propertyType) {
    errors.propertyType = 'Property type is required.';
  }

  if (!data.description || data.description.length < 50 || data.description.length > 5000) {
    errors.description = 'Description must be between 50 and 5000 characters.';
  }

  if (!data.location || data.location.trim() === '') {
    errors.location = 'Location is required.';
  }

  if (!data.pricePerNight || Number(data.pricePerNight) <= 0) {
    errors.pricePerNight = 'Price per night must be greater than 0.';
  }

  if (!data.bedrooms || Number(data.bedrooms) <= 0) {
    errors.bedrooms = 'At least 1 bedroom is required.';
  }

  if (!data.bathrooms || Number(data.bathrooms) <= 0) {
    errors.bathrooms = 'At least 1 bathroom is required.';
  }

  if (!data.guestCapacity || Number(data.guestCapacity) <= 0) {
    errors.guestCapacity = 'Guest capacity must be at least 1.';
  }

  if (!data.photos || data.photos.length === 0) {
    errors.photos = 'At least 1 image is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};