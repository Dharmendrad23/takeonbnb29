const pb = {
  collection() {
    throw new Error(
      "PocketBase has been removed. Migrate this route to MongoDB."
    );
  },
};

export default pb;