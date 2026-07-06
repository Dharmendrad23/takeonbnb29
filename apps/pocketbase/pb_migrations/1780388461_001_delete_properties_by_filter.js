/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const records = app.findRecordsByFilter("properties", "title ~ 'Demo' || title ~ 'Sample' || title ~ 'Test' || title ~ 'Placeholder' || title ~ 'Example' || title ~ 'demo' || title ~ 'sample' || title ~ 'test' || title ~ 'placeholder' || title ~ 'example'");
  for (const record of records) {
    app.delete(record);
  }
}, (app) => {
  // Rollback: record data not stored, manual restore needed
})