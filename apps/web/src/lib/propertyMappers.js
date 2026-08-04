const DEFAULT_PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop';

const DEFAULT_HOST_AVATAR =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isRecordObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isMediaUrl = (value) =>
  isNonEmptyString(value) &&
  (/^(https?:)?\/\//.test(value) || /^data:|^blob:|^\//.test(value));

const pickFirstMediaString = (values = []) => values.find(isMediaUrl) || '';

const toNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const getEntityId = (record) => record?.id || record?._id || '';

export const getPropertyPhotos = (property = {}) => {
  const gallery = [];

  if (Array.isArray(property.imageUrls)) {
    gallery.push(...property.imageUrls.filter(isMediaUrl));
  }

  if (Array.isArray(property.photos)) {
    gallery.push(...property.photos.filter(isMediaUrl));
  }

  const leadImage = pickFirstMediaString([
    property.coverImageUrl,
    property.coverImage,
    property.image,
    property.imageUrl,
    property._staticImage,
  ]);

  if (leadImage) {
    gallery.unshift(leadImage);
  }

  return [...new Set(gallery)];
};

export const getPropertyImage = (property = {}) =>
  getPropertyPhotos(property)[0] || DEFAULT_PROPERTY_IMAGE;

export const isLiveProperty = (property = {}) => {
  const status = String(property?.status || '').toLowerCase();
  const approvalStatus = String(property?.approvalStatus || '').toLowerCase();

  if (status && !['live', 'approved', 'published'].includes(status)) {
    return false;
  }

  if (approvalStatus && approvalStatus !== 'approved') {
    return false;
  }

  return true;
};

export const getHostFromProperty = (property = {}) =>
  [property.host, property.hostDetails, property.hostProfile, property.hostId].find(isRecordObject) || null;

export const getBookingProperty = (booking = {}) =>
  [booking.property, booking.propertyDetails, booking.propertyId].find(isRecordObject) || null;

export const getBookingGuest = (booking = {}) =>
  [booking.guest, booking.guestDetails, booking.guestId].find(isRecordObject) || null;

export const getReviewGuest = (review = {}) =>
  [review.guest, review.user, review.guestId].find(isRecordObject) || null;

export const getActivityActor = (activity = {}) =>
  [activity.admin, activity.user, activity.actor, activity.adminId].find(isRecordObject) || null;

export const getPropertyAmenities = (property = {}) =>
  Array.isArray(property.amenities)
    ? property.amenities
        .map((amenity) =>
          typeof amenity === 'string'
            ? {
                id: amenity,
                name: amenity,
              }
            : amenity
        )
        .filter(Boolean)
    : [];

export const getHostName = (host) =>
  host?.name || host?.fullName || host?.displayName || host?.email || 'Host';

export const getHostAvatarUrl = (host) =>
  pickFirstMediaString([host?.avatarUrl, host?.avatar, host?.profileImage, host?.image, DEFAULT_HOST_AVATAR]);

export const getPropertyReviewCount = (property = {}, reviews = []) => {
  if (Array.isArray(reviews) && reviews.length > 0) {
    return reviews.length;
  }

  if (Array.isArray(property.reviews)) {
    return property.reviews.length;
  }

  return toNumber(
    property.reviewCount ??
      property.totalReviews ??
      property.reviewsCount ??
      property.totalBookings ??
      property.reviews
  );
};

export const getPropertyRating = (property = {}, reviews = []) => {
  if (Array.isArray(reviews) && reviews.length > 0) {
    const total = reviews.reduce((sum, review) => sum + toNumber(review.rating), 0);
    return Number((total / reviews.length).toFixed(1));
  }

  const rating = toNumber(property.rating ?? property.averageRating ?? property.reviewStats?.average);
  return rating > 0 ? rating : 4.9;
};

export const getPropertyPrice = (property = {}) =>
  toNumber(property.pricePerNight ?? property.price ?? property.nightlyRate);

export const normalizePropertyType = (propertyType) => {
  if (!isNonEmptyString(propertyType)) {
    return 'place';
  }

  return propertyType
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase();
};

export const normalizeReviews = (reviews = []) =>
  reviews.map((review, index) => {
    const guest = review.guest || review.user || review.guestId || {};

    return {
      id: getEntityId(review) || `review-${index}`,
      rating: toNumber(review.rating) || 0,
      reviewText: review.reviewText || review.comment || review.description || '',
      createdAt: review.createdAt || review.created || review.updatedAt || null,
      guest: {
        name: getHostName(guest).replace(/@.*/, '') || 'Guest',
        avatarUrl: getHostAvatarUrl(guest),
      },
    };
  });
