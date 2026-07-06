/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("properties");
  const field = collection.fields.getByName("photos");
  field.maxSelect = 100;
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("properties");
  const field = collection.fields.getByName("photos");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.maxSelect = 10;
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})