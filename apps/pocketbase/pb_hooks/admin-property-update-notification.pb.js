/// <reference path="../pb_data/types.d.ts" />
// Notify admin when property is created/updated/deleted
onRecordAfterCreateSuccess((e) => {
  const adminUsers = $app.findRecordsByFilter("admin_users", "role = 'admin'", { limit: 100 });
  
  adminUsers.forEach((admin) => {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: admin.get("email") }],
      subject: "New Property Created: " + e.record.get("title"),
      html: "<h2>New Property Listing</h2><p><strong>Title:</strong> " + e.record.get("title") + "</p><p><strong>Location:</strong> " + e.record.get("location") + "</p><p><strong>Type:</strong> " + e.record.get("propertyType") + "</p><p><strong>Price per Night:</strong> $" + e.record.get("pricePerNight") + "</p><p><strong>Status:</strong> " + (e.record.get("status") || "Draft") + "</p>"
    });
    $app.newMailClient().send(message);
  });
  
  e.next();
}, "properties");

onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const statusChanged = original.get("status") !== e.record.get("status");
  
  if (statusChanged) {
    const adminUsers = $app.findRecordsByFilter("admin_users", "role = 'admin'", { limit: 100 });
    
    adminUsers.forEach((admin) => {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: admin.get("email") }],
        subject: "Property Status Updated: " + e.record.get("title"),
        html: "<h2>Property Status Change</h2><p><strong>Property:</strong> " + e.record.get("title") + "</p><p><strong>Previous Status:</strong> " + original.get("status") + "</p><p><strong>New Status:</strong> " + e.record.get("status") + "</p><p><strong>Location:</strong> " + e.record.get("location") + "</p>"
      });
      $app.newMailClient().send(message);
    });
  }
  
  e.next();
}, "properties");

onRecordAfterDeleteSuccess((e) => {
  const adminUsers = $app.findRecordsByFilter("admin_users", "role = 'admin'", { limit: 100 });
  
  adminUsers.forEach((admin) => {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: admin.get("email") }],
      subject: "Property Deleted: " + e.record.get("title"),
      html: "<h2>Property Listing Deleted</h2><p><strong>Title:</strong> " + e.record.get("title") + "</p><p><strong>Location:</strong> " + e.record.get("location") + "</p><p><strong>Type:</strong> " + e.record.get("propertyType") + "</p>"
    });
    $app.newMailClient().send(message);
  });
  
  e.next();
}, "properties");