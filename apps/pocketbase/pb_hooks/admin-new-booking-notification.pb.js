/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const booking = e.record;
  const guestName = booking.get("guestFullName");
  const propertyName = booking.get("propertyName");
  const totalAmount = booking.get("totalAmount");
  const status = booking.get("status");
  
  // Find admin email - adjust as needed
  const adminEmail = "admin@takeonbnb.com"; // Replace with your admin email
  
  // Send email to admin
  const emailMessage = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: adminEmail }],
    subject: "New Booking - " + propertyName,
    html: "<h2>New Booking</h2><p>Guest: <strong>" + guestName + "</strong></p><p>Property: <strong>" + propertyName + "</strong></p><p>Amount: <strong>₹" + totalAmount + "</strong></p><p>Status: <strong>" + status + "</strong></p>"
  });
  $app.newMailClient().send(emailMessage);
  
  e.next();
}, "bookings");