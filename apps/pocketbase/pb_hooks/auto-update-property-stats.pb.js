/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const review = e.record;
  const propertyId = review.get("propertyId");
  
  // Get property
  const property = $app.findRecordById("properties", propertyId);
  
  // Calculate average rating from all reviews for this property
  const reviews = $app.findRecordsByFilter("reviews", "propertyId = '" + propertyId + "'");
  let totalRating = 0;
  let reviewCount = 0;
  
  for (let i = 0; i < reviews.length; i++) {
    totalRating += reviews[i].get("rating");
    reviewCount++;
  }
  
  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
  property.set("rating", averageRating);
  
  $app.save(property);
  
  e.next();
}, "reviews");

onRecordUpdate((e) => {
  const booking = e.record;
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = booking.get("status");
  
  // Only process if status changed to 'completed'
  if (oldStatus !== "completed" && newStatus === "completed") {
    const propertyId = booking.get("propertyId");
    
    // Get property and update totalBookings
    const property = $app.findRecordById("properties", propertyId);
    const currentBookings = property.get("totalBookings") || 0;
    property.set("totalBookings", currentBookings + 1);
    
    $app.save(property);
  }
  
  e.next();
}, "bookings");