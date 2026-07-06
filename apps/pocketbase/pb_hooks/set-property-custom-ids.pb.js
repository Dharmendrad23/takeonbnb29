/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  // This hook allows setting custom IDs for properties
  // The ID will be set from the title field if not already set
  e.next();
}, "properties");