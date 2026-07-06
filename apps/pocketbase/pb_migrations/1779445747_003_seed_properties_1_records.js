/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("properties");

  const record0 = new Record(collection);
    record0.set("title", "Himalayan Mountain Retreat");
    record0.set("description", "Beautiful property in Jammu & Kashmir with stunning views");
    record0.set("location", "Srinagar, Jammu & Kashmir");
    record0.set("propertyType", "villa");
    record0.set("pricePerNight", 5000);
    const record0_hostIdLookup = app.findFirstRecordByFilter("users", "email='host@himalayan.com'");
    if (!record0_hostIdLookup) { throw new Error("Lookup failed for hostId: no record in 'users' matching \"email='host@himalayan.com'\""); }
    record0.set("hostId", record0_hostIdLookup.id);
    record0.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='Mountain View'"}, {"_lookup": "amenities", "where": "name='Heating'"}, {"_lookup": "amenities", "where": "name='Kitchen'"}, {"_lookup": "amenities", "where": "name='Parking'"}]);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})