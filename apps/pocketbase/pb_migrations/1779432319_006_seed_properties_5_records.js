/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("properties");

  const record0 = new Record(collection);
    record0.set("title", "Luxury Villa in Mumbai");
    record0.set("description", "A stunning luxury villa with premium amenities and breathtaking views");
    record0.set("location", "Mumbai, India");
    record0.set("propertyType", "villa");
    record0.set("pricePerNight", 15000);
    record0.set("rating", 5);
    record0.set("hostId", "demo_host_001");
    record0.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='AC'"}, {"_lookup": "amenities", "where": "name='Kitchen'"}, {"_lookup": "amenities", "where": "name='Parking'"}, {"_lookup": "amenities", "where": "name='Pool'"}, {"_lookup": "amenities", "where": "name='Gym'"}, {"_lookup": "amenities", "where": "name='Security'"}]);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("title", "Modern Apartment in Delhi");
    record1.set("description", "Contemporary apartment with modern furnishings and excellent location");
    record1.set("location", "Delhi, India");
    record1.set("propertyType", "apartment");
    record1.set("pricePerNight", 8500);
    record1.set("rating", 4.5);
    record1.set("hostId", "demo_host_002");
    record1.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='AC'"}, {"_lookup": "amenities", "where": "name='Kitchen'"}, {"_lookup": "amenities", "where": "name='Parking'"}, {"_lookup": "amenities", "where": "name='TV'"}, {"_lookup": "amenities", "where": "name='Hot Water'"}]);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("title", "Cozy Room in Bangalore");
    record2.set("description", "Comfortable and affordable room in the heart of Bangalore");
    record2.set("location", "Bangalore, India");
    record2.set("propertyType", "room");
    record2.set("pricePerNight", 3500);
    record2.set("rating", 4);
    record2.set("hostId", "demo_host_003");
    record2.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='AC'"}, {"_lookup": "amenities", "where": "name='TV'"}, {"_lookup": "amenities", "where": "name='Hot Water'"}]);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("title", "Beach House in Goa");
    record3.set("description", "Spectacular beachfront property with stunning ocean views");
    record3.set("location", "Goa, India");
    record3.set("propertyType", "villa");
    record3.set("pricePerNight", 12000);
    record3.set("rating", 5);
    record3.set("hostId", "demo_host_004");
    record3.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='AC'"}, {"_lookup": "amenities", "where": "name='Kitchen'"}, {"_lookup": "amenities", "where": "name='Parking'"}, {"_lookup": "amenities", "where": "name='Pool'"}, {"_lookup": "amenities", "where": "name='Balcony'"}, {"_lookup": "amenities", "where": "name='Garden'"}, {"_lookup": "amenities", "where": "name='Security'"}]);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("title", "Studio Apartment in Pune");
    record4.set("description", "Compact and efficient studio apartment perfect for solo travelers");
    record4.set("location", "Pune, India");
    record4.set("propertyType", "apartment");
    record4.set("pricePerNight", 4200);
    record4.set("rating", 4);
    record4.set("hostId", "demo_host_005");
    record4.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='AC'"}, {"_lookup": "amenities", "where": "name='Kitchen'"}, {"_lookup": "amenities", "where": "name='TV'"}, {"_lookup": "amenities", "where": "name='Washing Machine'"}]);
  try {
    app.save(record4);
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