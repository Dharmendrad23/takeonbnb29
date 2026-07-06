/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  if (e.record.collectionName !== 'bookings') {
    e.next();
    return;
  }

  try {
    const guestId = e.record.get('guestId');
    updateGuestStats(guestId);
  } catch (err) {
    console.log('Error updating guest stats on booking create:', err);
  }

  e.next();
}, 'bookings');

onRecordAfterUpdateSuccess((e) => {
  if (e.record.collectionName !== 'bookings') {
    e.next();
    return;
  }

  try {
    const guestId = e.record.get('guestId');
    updateGuestStats(guestId);
  } catch (err) {
    console.log('Error updating guest stats on booking update:', err);
  }

  e.next();
}, 'bookings');

function updateGuestStats(guestId) {
  try {
    // Find guest record
    const guestRecord = $app.findFirstRecordByData('guests', 'userId', guestId);
    if (!guestRecord) {
      return;
    }

    // Get all bookings for this guest
    const bookings = $app.findRecordsByFilter('bookings', 'guestId = "' + guestId + '"', '-checkInDate', 1000);

    // Calculate totalBookings (confirmed + completed)
    let totalBookings = 0;
    let totalSpent = 0;
    let lastBookingDate = null;

    for (const booking of bookings) {
      const bookingStatus = booking.get('bookingStatus');
      const paymentStatus = booking.get('paymentStatus');

      // Count confirmed and completed bookings
      if (bookingStatus === 'confirmed' || bookingStatus === 'completed') {
        totalBookings++;
      }

      // Sum totalAmount for verified payments
      if (paymentStatus === 'verified') {
        const amount = booking.get('totalAmount');
        if (amount) {
          totalSpent += amount;
        }
      }

      // Get latest checkInDate
      const checkInDate = booking.get('checkInDate');
      if (checkInDate && (!lastBookingDate || checkInDate > lastBookingDate)) {
        lastBookingDate = checkInDate;
      }
    }

    // Update guest record
    guestRecord.set('totalBookings', totalBookings);
    guestRecord.set('totalSpent', totalSpent);
    if (lastBookingDate) {
      guestRecord.set('lastBookingDate', lastBookingDate);
    }

    $app.save(guestRecord);
  } catch (err) {
    console.log('Error in updateGuestStats:', err);
  }
}