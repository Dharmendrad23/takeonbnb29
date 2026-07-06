/// <reference path="../pb_data/types.d.ts" />
// Notify admin when booking status changes
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const statusChanged = original.get("status") !== e.record.get("status") || original.get("bookingStatus") !== e.record.get("bookingStatus");
  
  if (statusChanged) {
    const adminUsers = $app.findRecordsByFilter("admin_users", "role = 'admin'", { limit: 100 });
    
    adminUsers.forEach((admin) => {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: admin.get("email") }],
        subject: "Booking Status Updated - " + e.record.get("propertyName"),
        html: "<h2>Booking Status Change</h2><p><strong>Property:</strong> " + e.record.get("propertyName") + "</p><p><strong>Guest:</strong> " + e.record.get("guestFullName") + "</p><p><strong>Guest Email:</strong> " + e.record.get("guestEmail") + "</p><p><strong>Check-in:</strong> " + e.record.get("checkInDate") + "</p><p><strong>Check-out:</strong> " + e.record.get("checkOutDate") + "</p><p><strong>Previous Booking Status:</strong> " + original.get("bookingStatus") + "</p><p><strong>New Booking Status:</strong> " + e.record.get("bookingStatus") + "</p><p><strong>Previous Payment Status:</strong> " + original.get("paymentStatus") + "</p><p><strong>New Payment Status:</strong> " + e.record.get("paymentStatus") + "</p><p><strong>Total Amount:</strong> $" + e.record.get("totalAmount") + "</p>"
      });
      $app.newMailClient().send(message);
    });
  }
  
  e.next();
}, "bookings");

onRecordAfterCreateSuccess((e) => {
  const adminUsers = $app.findRecordsByFilter("admin_users", "role = 'admin'", { limit: 100 });
  
  adminUsers.forEach((admin) => {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: admin.get("email") }],
      subject: "New Booking Created - " + e.record.get("propertyName"),
      html: "<h2>New Booking</h2><p><strong>Property:</strong> " + e.record.get("propertyName") + "</p><p><strong>Guest:</strong> " + e.record.get("guestFullName") + "</p><p><strong>Guest Email:</strong> " + e.record.get("guestEmail") + "</p><p><strong>Guest Phone:</strong> " + e.record.get("guestMobileNumber") + "</p><p><strong>Check-in:</strong> " + e.record.get("checkInDate") + "</p><p><strong>Check-out:</strong> " + e.record.get("checkOutDate") + "</p><p><strong>Guest Count:</strong> " + e.record.get("guestCount") + "</p><p><strong>Total Amount:</strong> $" + e.record.get("totalAmount") + "</p><p><strong>Status:</strong> " + e.record.get("bookingStatus") + "</p>"
    });
    $app.newMailClient().send(message);
  });
  
  e.next();
}, "bookings");