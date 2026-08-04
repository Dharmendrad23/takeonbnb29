import api from '@/lib/api.js';

const getData = async (request) => {
  const response = await request;
  return response.data;
};

export const listProperties = (params) => getData(api.get('/properties', { params }));
export const getProperty = (id, params) => getData(api.get(`/properties/${id}`, { params }));
export const createProperty = (payload) => getData(api.post('/properties', payload));
export const updateProperty = (id, payload) => getData(api.put(`/properties/${id}`, payload));
export const deleteProperty = (id) => getData(api.delete(`/properties/${id}`));

export const listBookings = (params) => getData(api.get('/bookings', { params }));
export const getBooking = (id, params) => getData(api.get(`/bookings/${id}`, { params }));
export const createBooking = (payload) => getData(api.post('/bookings', payload));
export const updateBooking = (id, payload) => getData(api.put(`/bookings/${id}`, payload));
export const deleteBooking = (id) => getData(api.delete(`/bookings/${id}`));

export const listReviews = (params) => getData(api.get('/reviews', { params }));
export const getReview = (id, params) => getData(api.get(`/reviews/${id}`, { params }));
export const createReview = (payload) => getData(api.post('/reviews', payload));
export const updateReview = (id, payload) => getData(api.put(`/reviews/${id}`, payload));
export const deleteReview = (id) => getData(api.delete(`/reviews/${id}`));

export const listFavorites = (params) => getData(api.get('/favorites', { params }));
export const createFavorite = (payload) => getData(api.post('/favorites', payload));
export const deleteFavorite = (id) => getData(api.delete(`/favorites/${id}`));

export const listNotifications = (params) => getData(api.get('/notifications', { params }));
export const updateNotification = (id, payload) => getData(api.put(`/notifications/${id}`, payload));
export const createNotification = (payload) => getData(api.post('/notifications', payload));

export const listUsers = (params) => getData(api.get('/users', { params }));
export const getUser = (id, params) => getData(api.get(`/users/${id}`, { params }));
export const updateUser = (id, payload) => getData(api.put(`/users/${id}`, payload));
export const createUser = (payload) => getData(api.post('/users', payload));

export const listAmenities = (params) => getData(api.get('/amenities', { params }));
export const listPropertyRates = (params) => getData(api.get('/property_rates', { params }));
export const createPropertyRate = (payload) => getData(api.post('/property_rates', payload));
export const deletePropertyRate = (id) => getData(api.delete(`/property_rates/${id}`));

export const listUnavailableDates = (params) => getData(api.get('/unavailable_dates', { params }));
export const createUnavailableDate = (payload) => getData(api.post('/unavailable_dates', payload));
export const deleteUnavailableDate = (id) => getData(api.delete(`/unavailable_dates/${id}`));

export const listActivityLogs = (params) => getData(api.get('/activity_logs', { params }));
export const listDashboardData = (params) => getData(api.get('/dashboard', { params }));
export const listAdminStats = () => getData(api.get('/admin/dashboard/stats'));
export const createActivityLog = (payload) => getData(api.post('/admin/activity-log', payload));

export const loginUser = (payload) => getData(api.post('/auth/login', payload));
export const registerUser = (payload) => getData(api.post('/auth/register', payload));
