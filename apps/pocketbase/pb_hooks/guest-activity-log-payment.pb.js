/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  if (e.record.collectionName !== 'bookings') {
    e.next();
    return;
  }

  try {
    const guestId = e.record.get('guestId');
    const bookingId = e.record.id;
    const paymentStatus = e.record.get('paymentStatus');

    // Log payment activity if payment is verified
    if (paymentStatus === 'verified') {
      const logRecord = new Record($app.findCollectionByNameOrId('guest_activity_logs'));
      logRecord.set('userId', guestId);
      logRecord.set('actionType', 'payment_made');
      logRecord.set('targetId', bookingId);
      logRecord.set('targetType', 'booking');

      $app.save(logRecord);
    }
  } catch (err) {
    console.log('Error creating activity log on booking create:', err);
  }

  e.next();
}, 'bookings');

onRecordAfterUpdateSuccess((e) => {
  if (e.record.collectionName !== 'bookings') {
    e.next();
    return;
  }

  try {
    const original = e.record.original();
    const currentPaymentStatus = e.record.get('paymentStatus');
    const originalPaymentStatus = original ? original.get('paymentStatus') : null;

    // Log payment activity if paymentStatus changed to 'verified'
    if (currentPaymentStatus === 'verified' && originalPaymentStatus !== 'verified') {
      const guestId = e.record.get('guestId');
      const bookingId = e.record.id;

      const logRecord = new Record($app.findCollectionByNameOrId('guest_activity_logs'));
      logRecord.set('userId', guestId);
      logRecord.set('actionType', 'payment_made');
      logRecord.set('targetId', bookingId);
      logRecord.set('targetType', 'booking');

      $app.save(logRecord);
    }
  } catch (err) {
    console.log('Error creating activity log on booking update:', err);
  }

  e.next();
}, 'bookings');