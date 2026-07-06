/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("properties");
  collection.listRule = "status = 'Live' || (status = 'Draft' && hostId = @request.auth.id) || (status = 'Submitted' && hostId = @request.auth.id) || (status = 'Pending' && hostId = @request.auth.id) || (status = 'Approved' && hostId = @request.auth.id) || @request.auth.role = 'admin'";
  collection.viewRule = "status = 'Live' || (status = 'Draft' && hostId = @request.auth.id) || (status = 'Submitted' && hostId = @request.auth.id) || (status = 'Pending' && hostId = @request.auth.id) || (status = 'Approved' && hostId = @request.auth.id) || @request.auth.role = 'admin'";
  collection.updateRule = "hostId = @request.auth.id && (status = 'Draft' || status = 'Live')";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("properties");
  collection.listRule = "approvalStatus = 'approved' || hostId = @request.auth.id || @request.auth.role = 'admin'";
  collection.viewRule = "approvalStatus = 'approved' || hostId = @request.auth.id || @request.auth.role = 'admin'";
  collection.updateRule = "hostId = @request.auth.id";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})