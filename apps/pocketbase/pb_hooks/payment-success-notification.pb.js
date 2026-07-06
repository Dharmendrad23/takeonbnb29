/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  // Check if this is a bookings collection update
  if (e.record.collectionName !== 'bookings') {
    e.next();
    return;
  }

  // Get the original record to check if paymentStatus changed to 'verified'
  const original = e.record.original();
  const currentPaymentStatus = e.record.get('paymentStatus');
  const originalPaymentStatus = original ? original.get('paymentStatus') : null;

  // Only proceed if paymentStatus changed to 'verified'
  if (currentPaymentStatus === 'verified' && originalPaymentStatus !== 'verified') {
    try {
      const guestId = e.record.get('guestId');
      const totalAmount = e.record.get('totalAmount');
      const bookingId = e.record.id;

      // Create payment notification record
      const notificationRecord = new Record($app.findCollectionByNameOrId('payment_notifications'));
      notificationRecord.set('userId', guestId);
      notificationRecord.set('bookingId', bookingId);
      notificationRecord.set('notificationType', 'payment_successful');
      notificationRecord.set('amount', totalAmount);
      notificationRecord.set('currency', 'INR');
      notificationRecord.set('isRead', false);

      $app.save(notificationRecord);
    } catch (err) {
      console.log('Error creating payment notification:', err);
    }
  }

  e.next();
}, 'bookings');