import { buildApiUrl } from "./api.js";

export default {
  fetch: (path, options = {}) => fetch(buildApiUrl(path), options),
};