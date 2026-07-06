/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const property = e.record;
  const approvalStatus = property.get("approvalStatus");
  
  // Only send if property is pending approval
  if (approvalStatus === "pending") {
    const hostId = property.get("hostId");
    const host = $app.findRecordById("users", hostId);
    const propertyName = property.get("title");
    const hostName = host.get("name") || host.get("email");
    
    // Find admin email (you may need to adjust this based on your admin setup)
    // For now, sending to a default admin email - adjust as needed
    const adminEmail = "admin@takeonbnb.com"; // Replace with your admin email
    
    // Send email to admin
    const emailMessage = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: adminEmail }],
      subject: "New Property Submission - " + propertyName,
      html: "<h2>New Property Submission</h2><p>Property: <strong>" + propertyName + "</strong></p><p>Host: <strong>" + hostName + "</strong></p><p>Review and approve/reject in admin panel.</p>"
    });
    $app.newMailClient().send(emailMessage);
  }
  
  e.next();
}, "properties");