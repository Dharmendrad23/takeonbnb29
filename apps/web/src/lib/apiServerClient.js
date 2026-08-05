import { buildApiUrl } from "./apiBase.js";

export default {
  fetch: (path, options = {}) => fetch(buildApiUrl(path), options),
};