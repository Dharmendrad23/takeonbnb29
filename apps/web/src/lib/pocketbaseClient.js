/**
 * PocketBase compatibility shim
 * Translates pb.collection() calls to REST API calls via axios.
 * Replaces the real PocketBase SDK — no pocketbase npm package is used.
 */

import api from "./api.js";

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse a simplified PocketBase filter string into axios query-param object.
 * Supports:  key = "val", key != "val", key ~ "val" (contains/search),
 *            combined with &&.  Dotted keys (a.b) use the last segment.
 */
function parseFilter(filter) {
  if (!filter) return {};
  const params = {};
  const conditions = filter.split("&&").map((c) => c.trim());

  for (const cond of conditions) {
    // contains:  key ~ "value"
    const containsMatch = cond.match(/^([\w.]+)\s*~\s*["']([^"']*)["']$/);
    if (containsMatch) {
      params.search = containsMatch[2];
      continue;
    }

    // not-equal: key != "value"
    const neqMatch = cond.match(/^([\w.]+)\s*!=\s*["']([^"']*)["']$/);
    if (neqMatch) {
      const key = neqMatch[1].includes(".")
        ? neqMatch[1].split(".").pop()
        : neqMatch[1];
      params[`${key}Not`] = neqMatch[2];
      if (key === "id" || key === "_id") params.idNot = neqMatch[2];
      continue;
    }

    // equal:   key = "value"  or  key = 'value'
    const eqMatch = cond.match(/^([\w.]+)\s*=\s*["']([^"']*)["']$/);
    if (eqMatch) {
      const raw = eqMatch[1];
      const key = raw.includes(".") ? raw.split(".").pop() : raw;
      params[key] = eqMatch[2];
    }
  }

  return params;
}

/** Normalize any API response shape into a { items, totalItems } structure */
function normalizeList(data, name) {
  const items =
    data?.items ||
    data?.properties ||
    data?.bookings ||
    data?.reviews ||
    data?.users ||
    data?.notifications ||
    data?.[name] ||
    (Array.isArray(data) ? data : []);

  const totalItems =
    data?.totalItems ?? data?.total ?? (Array.isArray(items) ? items.length : 0);

  return { items: Array.isArray(items) ? items : [], totalItems };
}

/** Normalize a single-record response */
function normalizeSingle(data) {
  return (
    data?.property ||
    data?.booking ||
    data?.review ||
    data?.user ||
    data?.item ||
    data
  );
}

// ── collection factory ────────────────────────────────────────────────────────

const ENDPOINT_MAP = {
  properties: "/properties",
  bookings: "/bookings",
  users: "/users",
  reviews: "/reviews",
  notifications: "/notifications",
  favorites: "/favorites",
  wishlist: "/wishlist",
  amenities: "/amenities",
};

function collection(name) {
  const endpoint = ENDPOINT_MAP[name] || `/${name}`;

  return {
    // ── read ────────────────────────────────────────────────────────────────
    async getList(page = 1, perPage = 30, options = {}) {
      try {
        const params = {
          page,
          limit: perPage,
          ...parseFilter(options.filter),
        };
        if (options.sort) params.sort = options.sort;
        const { data } = await api.get(endpoint, { params });
        const { items, totalItems } = normalizeList(data, name);
        return { items, totalItems, page, perPage };
      } catch (err) {
        console.error(`pb.collection('${name}').getList error:`, err);
        return { items: [], totalItems: 0, page, perPage };
      }
    },

    async getFullList(options = {}) {
      try {
        const params = {
          limit: 500,
          ...parseFilter(options.filter),
        };
        if (options.sort) params.sort = options.sort;
        const { data } = await api.get(endpoint, { params });
        const { items } = normalizeList(data, name);
        return items;
      } catch (err) {
        console.error(`pb.collection('${name}').getFullList error:`, err);
        return [];
      }
    },

    async getOne(id, _options = {}) {
      try {
        const { data } = await api.get(`${endpoint}/${id}`);
        return normalizeSingle(data);
      } catch (err) {
        console.error(`pb.collection('${name}').getOne(${id}) error:`, err);
        const status = err?.response?.status || 500;
        throw { status, message: err?.response?.data?.message || err.message };
      }
    },

    async getFirstListItem(filter, _options = {}) {
      try {
        const params = { limit: 1, ...parseFilter(filter) };
        const { data } = await api.get(endpoint, { params });
        const { items } = normalizeList(data, name);
        if (!items.length) throw { status: 404, message: "Not found" };
        return items[0];
      } catch (err) {
        if (err?.status === 404) throw err;
        console.error(`pb.collection('${name}').getFirstListItem error:`, err);
        throw { status: 404, message: "Not found" };
      }
    },

    // ── write ───────────────────────────────────────────────────────────────
    async create(bodyData, _options = {}) {
      try {
        let resp;
        if (bodyData instanceof FormData) {
          // Extract JSON-serialisable fields; ignore File objects
          const json = {};
          bodyData.forEach((value, key) => {
            if (!(value instanceof File)) json[key] = value;
          });
          resp = await api.post(endpoint, json);
        } else {
          resp = await api.post(endpoint, bodyData);
        }
        return normalizeSingle(resp.data) || resp.data;
      } catch (err) {
        console.error(`pb.collection('${name}').create error:`, err);
        throw err?.response?.data || err;
      }
    },

    async update(id, bodyData, _options = {}) {
      try {
        const resp = await api.patch(`${endpoint}/${id}`, bodyData);
        return normalizeSingle(resp.data) || resp.data;
      } catch (err) {
        console.error(`pb.collection('${name}').update error:`, err);
        throw err?.response?.data || err;
      }
    },

    async delete(id, _options = {}) {
      try {
        await api.delete(`${endpoint}/${id}`);
        return true;
      } catch (err) {
        console.error(`pb.collection('${name}').delete error:`, err);
        throw err?.response?.data || err;
      }
    },

    // ── realtime (no-op — no WebSocket available) ────────────────────────────
    subscribe(_event, _callback) {
      return Promise.resolve(() => {});
    },
    unsubscribe(_event) {},
    authWithOAuth2() {
      return Promise.reject(new Error("OAuth2 not supported in MongoDB mode"));
    },
  };
}

// ── authStore ─────────────────────────────────────────────────────────────────

const authStore = {
  get isValid() {
    return !!localStorage.getItem("token");
  },
  get model() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  },
  save(token, model) {
    if (token) localStorage.setItem("token", token);
    if (model) localStorage.setItem("user", JSON.stringify(model));
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// ── files helper ──────────────────────────────────────────────────────────────
// In the MongoDB API, photos are stored as full URLs — just return as-is.

function getFileUrl(_record, filename, _options = {}) {
  if (!filename) return "";
  // If already a full URL, return it directly
  if (typeof filename === "string" && filename.startsWith("http")) return filename;
  return filename;
}

const files = {
  getUrl: getFileUrl,
  getURL: getFileUrl,
};

// ── public API ────────────────────────────────────────────────────────────────

const pb = {
  collection,
  authStore,
  files,
};

export default pb;
export { pb };
