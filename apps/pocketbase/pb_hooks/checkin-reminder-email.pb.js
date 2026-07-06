/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const guestEmail = e.record.get("guestEmail");
  const guestFullName = e.record.get("guestFullName");
  const propertyName = e.record.get("propertyName");
  const checkInDate = e.record.get("checkInDate");
  
  // Note: This hook sends the reminder immediately upon booking creation.
  // For true 24-hour scheduling, implement a cron job or external scheduler.
  // This version sends a reminder email with check-in instructions.
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: guestEmail }],
    subject: "Check-in Reminder - " + propertyName,
    html: "<h2>Check-in Reminder</h2>" +
          "<p>Dear " + guestFullName + ",</p>" +
          "<p>Your check-in date is approaching!</p>" +
          "<ul>" +
          "<li><strong>Property:</strong> " + propertyName + "</li>" +
          "<li><strong>Check-in Date:</strong> " + checkInDate + "</li>" +
          "<li><strong>Check-in Time:</strong> 3:00 PM</li>" +
          "</ul>" +
          "<p><strong>Check-in Instructions:</strong></p>" +
          "<p>Please arrive at the property by 3:00 PM on your check-in date. The key will be available at the front desk or via keypad code (provided separately).</p>" +
          "<p><strong>Property Details:</strong></p>" +
          "<p>Make sure to review the house rules and amenities guide provided in your booking confirmation.</p>" +
          "<p>If you have any questions or need assistance, please contact us immediately.</p>"
  });
  
  $app.newMailClient().send(message);
  
  e.next();
}, "bookings");