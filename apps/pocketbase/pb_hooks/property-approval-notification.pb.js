/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const property = e.record;
  const original = e.record.original();
  const oldStatus = original.get("approvalStatus");
  const newStatus = property.get("approvalStatus");
  
  // Only send if status changed to 'approved'
  if (oldStatus !== "approved" && newStatus === "approved") {
    const hostId = property.get("hostId");
    const host = $app.findRecordById("users", hostId);
    const propertyName = property.get("title");
    
    // Send email to host
    const emailMessage = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: host.get("email") }],
      subject: "Property Approved - " + propertyName,
      html: "<h2>Great news!</h2><p>Your property <strong>" + propertyName + "</strong> has been approved and is now live on Take On BnB.</p>"
    });
    $app.newMailClient().send(emailMessage);
  }
  
  e.next();
}, "properties");