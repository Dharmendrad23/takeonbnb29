import Pocketbase from "pocketbase";

// Temporary compatibility client
// MongoDB API use ho raha hai, lekin old components ke imports break na ho

const POCKETBASE_API_URL = "/";

const pb = new Pocketbase(POCKETBASE_API_URL);

export default pb;
export { pb };