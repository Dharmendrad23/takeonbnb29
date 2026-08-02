import Pocketbase from 'pocketbase';

// PocketBase JS client already appends /api internally.
// Use root base URL so requests go to /api/... instead of /api/api/...
const POCKETBASE_API_URL = '/';

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
