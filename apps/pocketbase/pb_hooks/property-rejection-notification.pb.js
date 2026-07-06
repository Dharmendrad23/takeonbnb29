/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const property = e.record;
  const original = e.record.original();
  const oldStatus = original.get("approvalStatus");
  const newStatus = property.get("approvalStatus");
  
  // Only send if status changed to 'rejected'
  if (oldStatus !== "rejected" && newStatus === "rejected") {
    const hostId = property.get("hostId");
    const host = $app.findRecordById("users", hostId);
    const propertyName = property.get("title");
    const rejectionReason = property.get("rejectionReason") || "Not specified";
    
    // Send email to host
    const emailMessage = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: host.get("email") }],
      subject: "Property Not Approved - " + propertyName,
      html: "<h2>Property Review Update</h2><p>Your property <strong>" + propertyName + "</strong> was not approved.</p><p><strong>Reason:</strong> " + rejectionReason + "</p><p>Please update your property details and resubmit for review.</p>"
    });
    $app.newMailClient().send(emailMessage);
  }
  
  e.next();
}, "properties");