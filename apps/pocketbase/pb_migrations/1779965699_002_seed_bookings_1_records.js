/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("bookings");

  const record0 = new Record(collection);
    const record0_propertyIdLookup = app.findFirstRecordByFilter("properties", "id!=''");
    if (!record0_propertyIdLookup) { throw new Error("Lookup failed for propertyId: no record in 'properties' matching \"id!=''\""); }
    record0.set("propertyId", record0_propertyIdLookup.id);
    const record0_guestIdLookup = app.findFirstRecordByFilter("users", "id!=''");
    if (!record0_guestIdLookup) { throw new Error("Lookup failed for guestId: no record in 'users' matching \"id!=''\""); }
    record0.set("guestId", record0_guestIdLookup.id);
    record0.set("checkInDate", "2024-01-15");
    record0.set("checkOutDate", "2024-01-20");
    record0.set("guestCount", 2);
    record0.set("totalPrice", 500);
    record0.set("status", "pending");
    record0.set("guestFullName", "John Doe");
    record0.set("guestMobileNumber", "+15551234567");
    record0.set("guestEmail", "john.doe@example.com");
    record0.set("propertyName", "Luxury Apartment");
    record0.set("totalAmount", 500);
    record0.set("paymentStatus", "pending");
    record0.set("bookingStatus", "pending");
  app.save(record0);
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})