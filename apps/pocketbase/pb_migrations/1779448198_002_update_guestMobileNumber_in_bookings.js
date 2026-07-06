/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("bookings");
  const field = collection.fields.getByName("guestMobileNumber");
  field.pattern = "^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,9}$";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("bookings");
  const field = collection.fields.getByName("guestMobileNumber");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.pattern = "";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})