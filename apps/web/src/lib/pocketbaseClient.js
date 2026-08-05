import api from '@/lib/api.js';

const FAVORITES_STORAGE_KEY = 'takeonbnb-favorites';

const getStoredFavorites = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to read favorites from storage', error);
    return [];
  }
};

const persistFavorites = (favorites) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

const parseFilter = (filter) => {
  if (!filter) return null;

  const guestIdMatch = filter.match(/guestId\s*=\s*"([^"]+)"/i);
  const propertyIdMatch = filter.match(/propertyId\s*=\s*"([^"]+)"/i);
  const locationMatch = filter.match(/location\s*~\s*"([^"]+)"/i);
  const propertyTypeMatch = filter.match(/propertyType\s*=\s*"([^"]+)"/i);
  const statusMatch = filter.match(/status\s*=\s*"([^"]+)"/i);
  const minPriceMatch = filter.match(/pricePerNight\s*>=\s*(\d+)/i);
  const maxPriceMatch = filter.match(/pricePerNight\s*<=\s*(\d+)/i);
  const notIdMatch = filter.match(/id\s*!=\s*"([^"]+)"/i);

  return {
    guestId: guestIdMatch?.[1] || null,
    propertyId: propertyIdMatch?.[1] || null,
    location: locationMatch?.[1] || null,
    propertyType: propertyTypeMatch?.[1] || null,
    status: statusMatch?.[1] || null,
    minPrice: minPriceMatch ? Number(minPriceMatch[1]) : null,
    maxPrice: maxPriceMatch ? Number(maxPriceMatch[1]) : null,
    notId: notIdMatch?.[1] || null,
  };
};

const matchesFilter = (item, filter) => {
  const parsed = parseFilter(filter);
  if (!parsed) return true;

  if (parsed.guestId && item.guestId !== parsed.guestId) return false;
  if (parsed.propertyId && item.propertyId !== parsed.propertyId) return false;
  if (parsed.location && !(item.location || '').toLowerCase().includes(parsed.location.toLowerCase())) return false;
  if (parsed.propertyType && item.propertyType !== parsed.propertyType) return false;
  if (parsed.status) {
    const itemStatus = (item.status || 'Live').toString().toLowerCase();
    if (itemStatus !== parsed.status.toLowerCase()) return false;
  }
  if (parsed.minPrice != null && Number(item.pricePerNight) < parsed.minPrice) return false;
  if (parsed.maxPrice != null && Number(item.pricePerNight) > parsed.maxPrice) return false;
  if (parsed.notId && item.id === parsed.notId) return false;
  return true;
};

const sortItems = (items, sort) => {
  if (!sort) return items;

  const normalizedSort = sort.startsWith('-') ? sort.slice(1) : sort;
  const reverse = sort.startsWith('-');

  return [...items].sort((a, b) => {
    const aValue = Number(a[normalizedSort]) || a[normalizedSort] || '';
    const bValue = Number(b[normalizedSort]) || b[normalizedSort] || '';

    if (aValue < bValue) return reverse ? 1 : -1;
    if (aValue > bValue) return reverse ? -1 : 1;
    return 0;
  });
};

const createCollection = (collectionName) => {
  const buildPath = (id = null) => {
    const basePath = collectionName === 'favorites' ? '/favorites' : `/${collectionName}`;
    return id ? `${basePath}/${id}` : basePath;
  };

  return {
    async getFullList(options = {}) {
      if (collectionName === 'favorites') {
        const favorites = getStoredFavorites().filter((item) => matchesFilter(item, options.filter));
        return favorites.sort((a, b) => new Date(b.createdAt || b.created || 0) - new Date(a.createdAt || a.created || 0));
      }

      if (collectionName === 'properties') {
        const response = await api.get(buildPath());
        const records = Array.isArray(response.data) ? response.data : response.data?.items || [];
        return sortItems(records.filter((item) => matchesFilter(item, options.filter)), options.sort);
      }

      if (collectionName === 'bookings') {
        const response = await api.get(buildPath());
        const records = Array.isArray(response.data) ? response.data : response.data?.items || [];
        return sortItems(records.filter((item) => matchesFilter(item, options.filter)), options.sort);
      }

      if (collectionName === 'reviews') {
        return [];
      }

      const response = await api.get(buildPath());
      return Array.isArray(response.data) ? response.data : response.data?.items || [];
    },

    async getList(page = 1, perPage = 50, options = {}) {
      const items = await this.getFullList(options);
      const start = (page - 1) * perPage;
      const paginatedItems = items.slice(start, start + perPage);

      return {
        items: paginatedItems,
        page,
        perPage,
        totalItems: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / perPage)),
      };
    },

    async getOne(id, options = {}) {
      if (collectionName === 'favorites') {
        const record = getStoredFavorites().find((item) => item.id === id);
        return record || null;
      }

      const response = await api.get(buildPath(id));
      return response.data;
    },

    async getFirstListItem(filter) {
      const items = await this.getFullList({ filter });
      return items[0] || null;
    },

    async create(data) {
      if (collectionName === 'favorites') {
        const favorites = getStoredFavorites();
        const record = {
          id: data.id || `favorite-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
        };
        const nextFavorites = [...favorites, record];
        persistFavorites(nextFavorites);
        return record;
      }

      const response = await api.post(buildPath(), data);
      return response.data;
    },

    async update(id, data) {
      if (collectionName === 'favorites') {
        const favorites = getStoredFavorites();
        const index = favorites.findIndex((item) => item.id === id);
        if (index === -1) return null;
        favorites[index] = { ...favorites[index], ...data };
        persistFavorites(favorites);
        return favorites[index];
      }

      const response = await api.put(buildPath(id), data);
      return response.data;
    },

    async delete(id) {
      if (collectionName === 'favorites') {
        const favorites = getStoredFavorites().filter((item) => item.id !== id);
        persistFavorites(favorites);
        return {};
      }

      const response = await api.delete(buildPath(id));
      return response.data;
    },

    // The MongoDB-backed API has no realtime transport yet. These are safe
    // no-ops so callers written against PocketBase's realtime API don't crash.
    async subscribe() {
      return () => {};
    },
    async unsubscribe() {},
  };
};

const files = {
  getUrl(record, fileName) {
    if (!fileName) return null;
    if (typeof fileName === 'string' && /^(https?:)?\/\//i.test(fileName)) return fileName;
    if (typeof fileName === 'string' && fileName.startsWith('/')) {
      return `${api.defaults.baseURL || ''}${fileName}`;
    }

    if (record && typeof record === 'object' && fileName in record) {
      return this.getUrl(record, record[fileName]);
    }

    return fileName;
  },
  getURL(record, fileName) {
    return this.getUrl(record, fileName);
  },
};

const authStore = {
  get isValid() {
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem('authToken') || window.localStorage.getItem('adminToken'));
  },
  get model() {
    if (typeof window === 'undefined') return null;
    const storedUser = window.localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  },
};

const pocketbaseClient = {
  collection: createCollection,
  files,
  authStore,
};

export default pocketbaseClient;

export { pocketbaseClient };
