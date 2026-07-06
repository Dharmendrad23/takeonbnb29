/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("properties");

  const record0 = new Record(collection);
    record0.set("title", "Mountain View Villa");
    record0.set("description", "Stunning villa with panoramic mountain views");
    record0.set("location", "Nainital");
    record0.set("propertyType", "villa");
    record0.set("pricePerNight", 8500);
    record0.set("rating", 4.8);
    record0.set("hostId", "host1");
    record0.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("title", "Lakeside Cottage");
    record1.set("description", "Cozy cottage overlooking the lake");
    record1.set("location", "Bhimtal");
    record1.set("propertyType", "house");
    record1.set("pricePerNight", 6500);
    record1.set("rating", 4.7);
    record1.set("hostId", "host2");
    record1.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='lake access'"}]);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("title", "Forest Retreat");
    record2.set("description", "Peaceful retreat surrounded by pine forests");
    record2.set("location", "Munsiyari");
    record2.set("propertyType", "villa");
    record2.set("pricePerNight", 7200);
    record2.set("rating", 4.9);
    record2.set("hostId", "host3");
    record2.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='fireplace'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("title", "Adventure Base Camp");
    record3.set("description", "Perfect base for trekking and adventure");
    record3.set("location", "Auli");
    record3.set("propertyType", "house");
    record3.set("pricePerNight", 5500);
    record3.set("rating", 4.6);
    record3.set("hostId", "host4");
    record3.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='parking'"}, {"_lookup": "amenities", "where": "name='guide service'"}]);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("title", "Riverside Bungalow");
    record4.set("description", "Charming bungalow by the river");
    record4.set("location", "Rishikesh");
    record4.set("propertyType", "house");
    record4.set("pricePerNight", 6800);
    record4.set("rating", 4.7);
    record4.set("hostId", "host5");
    record4.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='river access'"}, {"_lookup": "amenities", "where": "name='yoga space'"}]);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("title", "Himalayan Hideaway");
    record5.set("description", "Luxurious hideaway with snow-capped views");
    record5.set("location", "Shimla");
    record5.set("propertyType", "villa");
    record5.set("pricePerNight", 9500);
    record5.set("rating", 4.9);
    record5.set("hostId", "host6");
    record5.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='fireplace'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("title", "Valley View Home");
    record6.set("description", "Modern home with valley views");
    record6.set("location", "Manali");
    record6.set("propertyType", "house");
    record6.set("pricePerNight", 7800);
    record6.set("rating", 4.8);
    record6.set("hostId", "host7");
    record6.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='parking'"}, {"_lookup": "amenities", "where": "name='heater'"}]);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("title", "Apple Orchard Cottage");
    record7.set("description", "Charming cottage in apple orchards");
    record7.set("location", "Kullu");
    record7.set("propertyType", "house");
    record7.set("pricePerNight", 5900);
    record7.set("rating", 4.7);
    record7.set("hostId", "host8");
    record7.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='orchard access'"}]);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("title", "Mountain Peak Resort");
    record8.set("description", "Resort with stunning peak views");
    record8.set("location", "Dalhousie");
    record8.set("propertyType", "villa");
    record8.set("pricePerNight", 8200);
    record8.set("rating", 4.8);
    record8.set("hostId", "host9");
    record8.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='restaurant'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("title", "Riverside Escape");
    record9.set("description", "Peaceful escape by the river");
    record9.set("location", "Baijnath");
    record9.set("propertyType", "house");
    record9.set("pricePerNight", 6400);
    record9.set("rating", 4.6);
    record9.set("hostId", "host10");
    record9.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='river access'"}]);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("title", "Beachfront Paradise");
    record10.set("description", "Luxury beachfront villa with private beach");
    record10.set("location", "Goa");
    record10.set("propertyType", "villa");
    record10.set("pricePerNight", 12000);
    record10.set("rating", 4.9);
    record10.set("hostId", "host11");
    record10.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='beach access'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("title", "Tropical Garden Villa");
    record11.set("description", "Villa surrounded by tropical gardens");
    record11.set("location", "Goa");
    record11.set("propertyType", "villa");
    record11.set("pricePerNight", 8500);
    record11.set("rating", 4.8);
    record11.set("hostId", "host12");
    record11.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("title", "Coastal Retreat");
    record12.set("description", "Serene retreat near the coast");
    record12.set("location", "Konkan");
    record12.set("propertyType", "house");
    record12.set("pricePerNight", 7200);
    record12.set("rating", 4.7);
    record12.set("hostId", "host13");
    record12.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='beach access'"}]);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("title", "Spice Plantation House");
    record13.set("description", "Historic house in spice plantations");
    record13.set("location", "Goa");
    record13.set("propertyType", "house");
    record13.set("pricePerNight", 6800);
    record13.set("rating", 4.6);
    record13.set("hostId", "host14");
    record13.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='plantation tours'"}]);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("title", "Sunset View Bungalow");
    record14.set("description", "Bungalow with stunning sunset views");
    record14.set("location", "Konkan");
    record14.set("propertyType", "house");
    record14.set("pricePerNight", 7500);
    record14.set("rating", 4.8);
    record14.set("hostId", "host15");
    record14.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='sunset deck'"}]);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("title", "Houseboat Experience");
    record15.set("description", "Traditional Kerala houseboat on backwaters");
    record15.set("location", "Alleppey");
    record15.set("propertyType", "house");
    record15.set("pricePerNight", 10500);
    record15.set("rating", 4.9);
    record15.set("hostId", "host16");
    record15.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='backwater access'"}, {"_lookup": "amenities", "where": "name='boat tours'"}]);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("title", "Spice Garden Villa");
    record16.set("description", "Villa in the heart of spice gardens");
    record16.set("location", "Munnar");
    record16.set("propertyType", "villa");
    record16.set("pricePerNight", 8200);
    record16.set("rating", 4.8);
    record16.set("hostId", "host17");
    record16.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='tea plantation tours'"}]);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("title", "Beachside Cottage");
    record17.set("description", "Cozy cottage on the beach");
    record17.set("location", "Kochi");
    record17.set("propertyType", "house");
    record17.set("pricePerNight", 7500);
    record17.set("rating", 4.7);
    record17.set("hostId", "host18");
    record17.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='beach access'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("title", "Ayurveda Wellness Retreat");
    record18.set("description", "Wellness retreat with Ayurveda treatments");
    record18.set("location", "Kumarakom");
    record18.set("propertyType", "villa");
    record18.set("pricePerNight", 9000);
    record18.set("rating", 4.8);
    record18.set("hostId", "host19");
    record18.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='spa'"}, {"_lookup": "amenities", "where": "name='wellness center'"}]);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("title", "Waterfall View Home");
    record19.set("description", "Home with waterfall views");
    record19.set("location", "Thekkady");
    record19.set("propertyType", "house");
    record19.set("pricePerNight", 6500);
    record19.set("rating", 4.6);
    record19.set("hostId", "host20");
    record19.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='nature trails'"}]);
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("title", "Palace Heritage Stay");
    record20.set("description", "Historic palace converted to luxury stay");
    record20.set("location", "Jaipur");
    record20.set("propertyType", "villa");
    record20.set("pricePerNight", 11000);
    record20.set("rating", 4.9);
    record20.set("hostId", "host21");
    record20.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='heritage tours'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("title", "Desert Camp Luxury");
    record21.set("description", "Luxury camp in the Thar desert");
    record21.set("location", "Jaisalmer");
    record21.set("propertyType", "house");
    record21.set("pricePerNight", 8500);
    record21.set("rating", 4.8);
    record21.set("hostId", "host22");
    record21.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='desert safari'"}, {"_lookup": "amenities", "where": "name='bonfire'"}]);
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("title", "Lake Palace View");
    record22.set("description", "Villa with views of the lake palace");
    record22.set("location", "Udaipur");
    record22.set("propertyType", "villa");
    record22.set("pricePerNight", 9200);
    record22.set("rating", 4.7);
    record22.set("hostId", "host23");
    record22.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='lake access'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("title", "Fort View Cottage");
    record23.set("description", "Cottage with fort views");
    record23.set("location", "Jodhpur");
    record23.set("propertyType", "house");
    record23.set("pricePerNight", 6800);
    record23.set("rating", 4.6);
    record23.set("hostId", "host24");
    record23.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='fort tours'"}]);
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("title", "Oasis Resort");
    record24.set("description", "Resort in the desert oasis");
    record24.set("location", "Khimsar");
    record24.set("propertyType", "villa");
    record24.set("pricePerNight", 7500);
    record24.set("rating", 4.8);
    record24.set("hostId", "host25");
    record24.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='camel safari'"}]);
  try {
    app.save(record24);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record25 = new Record(collection);
    record25.set("title", "Luxury City Apartment");
    record25.set("description", "Modern luxury apartment in central Delhi");
    record25.set("location", "Delhi");
    record25.set("propertyType", "apartment");
    record25.set("pricePerNight", 8500);
    record25.set("rating", 4.8);
    record25.set("hostId", "host26");
    record25.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='gym'"}, {"_lookup": "amenities", "where": "name='parking'"}, {"_lookup": "amenities", "where": "name='concierge'"}]);
  try {
    app.save(record25);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record26 = new Record(collection);
    record26.set("title", "Heritage Haveli");
    record26.set("description", "Restored heritage haveli in Old Delhi");
    record26.set("location", "Delhi");
    record26.set("propertyType", "house");
    record26.set("pricePerNight", 6500);
    record26.set("rating", 4.7);
    record26.set("hostId", "host27");
    record26.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='heritage tours'"}]);
  try {
    app.save(record26);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record27 = new Record(collection);
    record27.set("title", "Garden Villa");
    record27.set("description", "Spacious villa with garden");
    record27.set("location", "Gurgaon");
    record27.set("propertyType", "villa");
    record27.set("pricePerNight", 7800);
    record27.set("rating", 4.8);
    record27.set("hostId", "host28");
    record27.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record27);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record28 = new Record(collection);
    record28.set("title", "Business Suite");
    record28.set("description", "Modern suite for business travelers");
    record28.set("location", "Noida");
    record28.set("propertyType", "apartment");
    record28.set("pricePerNight", 5500);
    record28.set("rating", 4.6);
    record28.set("hostId", "host29");
    record28.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='workspace'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record28);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record29 = new Record(collection);
    record29.set("title", "Riverside Penthouse");
    record29.set("description", "Penthouse with river views");
    record29.set("location", "Delhi");
    record29.set("propertyType", "apartment");
    record29.set("pricePerNight", 9500);
    record29.set("rating", 4.9);
    record29.set("hostId", "host30");
    record29.set("amenities", [{"_lookup": "amenities", "where": "name='pool'"}, {"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='gym'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record29);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record30 = new Record(collection);
    record30.set("title", "Golden Temple View Home");
    record30.set("description", "Home with Golden Temple views");
    record30.set("location", "Amritsar");
    record30.set("propertyType", "house");
    record30.set("pricePerNight", 7200);
    record30.set("rating", 4.8);
    record30.set("hostId", "host31");
    record30.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='temple tours'"}]);
  try {
    app.save(record30);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record31 = new Record(collection);
    record31.set("title", "Heritage Farmhouse");
    record31.set("description", "Traditional Punjabi farmhouse");
    record31.set("location", "Ludhiana");
    record31.set("propertyType", "house");
    record31.set("pricePerNight", 6500);
    record31.set("rating", 4.7);
    record31.set("hostId", "host32");
    record31.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='farm activities'"}]);
  try {
    app.save(record31);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record32 = new Record(collection);
    record32.set("title", "Riverside Cottage");
    record32.set("description", "Cottage by the river");
    record32.set("location", "Jalandhar");
    record32.set("propertyType", "house");
    record32.set("pricePerNight", 5800);
    record32.set("rating", 4.6);
    record32.set("hostId", "host33");
    record32.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='river access'"}]);
  try {
    app.save(record32);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record33 = new Record(collection);
    record33.set("title", "Luxury City Apartment");
    record33.set("description", "Modern apartment in city center");
    record33.set("location", "Chandigarh");
    record33.set("propertyType", "apartment");
    record33.set("pricePerNight", 6800);
    record33.set("rating", 4.8);
    record33.set("hostId", "host34");
    record33.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='gym'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record33);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record34 = new Record(collection);
    record34.set("title", "Orchard Retreat");
    record34.set("description", "Retreat in fruit orchards");
    record34.set("location", "Hoshiarpur");
    record34.set("propertyType", "house");
    record34.set("pricePerNight", 5500);
    record34.set("rating", 4.7);
    record34.set("hostId", "host35");
    record34.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='orchard access'"}]);
  try {
    app.save(record34);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record35 = new Record(collection);
    record35.set("title", "Houseboat Dal Lake");
    record35.set("description", "Traditional houseboat on Dal Lake");
    record35.set("location", "Srinagar");
    record35.set("propertyType", "house");
    record35.set("pricePerNight", 9500);
    record35.set("rating", 4.9);
    record35.set("hostId", "host36");
    record35.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='lake access'"}, {"_lookup": "amenities", "where": "name='boat tours'"}]);
  try {
    app.save(record35);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record36 = new Record(collection);
    record36.set("title", "Mountain Lodge");
    record36.set("description", "Cozy lodge in the mountains");
    record36.set("location", "Gulmarg");
    record36.set("propertyType", "house");
    record36.set("pricePerNight", 7800);
    record36.set("rating", 4.8);
    record36.set("hostId", "host37");
    record36.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='fireplace'"}, {"_lookup": "amenities", "where": "name='mountain views'"}]);
  try {
    app.save(record36);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record37 = new Record(collection);
    record37.set("title", "Valley Retreat");
    record37.set("description", "Peaceful retreat in the valley");
    record37.set("location", "Pahalgam");
    record37.set("propertyType", "house");
    record37.set("pricePerNight", 6800);
    record37.set("rating", 4.7);
    record37.set("hostId", "host38");
    record37.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='valley views'"}]);
  try {
    app.save(record37);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record38 = new Record(collection);
    record38.set("title", "Meadow Camp");
    record38.set("description", "Luxury camp in alpine meadows");
    record38.set("location", "Sonamarg");
    record38.set("propertyType", "house");
    record38.set("pricePerNight", 8200);
    record38.set("rating", 4.8);
    record38.set("hostId", "host39");
    record38.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='camping'"}, {"_lookup": "amenities", "where": "name='nature trails'"}]);
  try {
    app.save(record38);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record39 = new Record(collection);
    record39.set("title", "Riverside Bungalow");
    record39.set("description", "Bungalow by the river");
    record39.set("location", "Anantnag");
    record39.set("propertyType", "house");
    record39.set("pricePerNight", 6500);
    record39.set("rating", 4.6);
    record39.set("hostId", "host40");
    record39.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='river access'"}]);
  try {
    app.save(record39);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record40 = new Record(collection);
    record40.set("title", "Taj View Villa");
    record40.set("description", "Villa with Taj Mahal views");
    record40.set("location", "Agra");
    record40.set("propertyType", "villa");
    record40.set("pricePerNight", 8500);
    record40.set("rating", 4.9);
    record40.set("hostId", "host41");
    record40.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='Taj tours'"}]);
  try {
    app.save(record40);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record41 = new Record(collection);
    record41.set("title", "Ghats Riverside Home");
    record41.set("description", "Home overlooking the ghats");
    record41.set("location", "Varanasi");
    record41.set("propertyType", "house");
    record41.set("pricePerNight", 7200);
    record41.set("rating", 4.8);
    record41.set("hostId", "host42");
    record41.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='ghat access'"}, {"_lookup": "amenities", "where": "name='yoga'"}]);
  try {
    app.save(record41);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record42 = new Record(collection);
    record42.set("title", "Temple Town Cottage");
    record42.set("description", "Cottage in temple town");
    record42.set("location", "Mathura");
    record42.set("propertyType", "house");
    record42.set("pricePerNight", 5800);
    record42.set("rating", 4.7);
    record42.set("hostId", "host43");
    record42.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='garden'"}, {"_lookup": "amenities", "where": "name='temple tours'"}]);
  try {
    app.save(record42);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record43 = new Record(collection);
    record43.set("title", "Lucknow Heritage Home");
    record43.set("description", "Heritage home in Lucknow");
    record43.set("location", "Lucknow");
    record43.set("propertyType", "house");
    record43.set("pricePerNight", 6500);
    record43.set("rating", 4.6);
    record43.set("hostId", "host44");
    record43.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='heritage tours'"}]);
  try {
    app.save(record43);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record44 = new Record(collection);
    record44.set("title", "Adventure Base");
    record44.set("description", "Base for adventure activities");
    record44.set("location", "Kanpur");
    record44.set("propertyType", "house");
    record44.set("pricePerNight", 6200);
    record44.set("rating", 4.8);
    record44.set("hostId", "host45");
    record44.set("amenities", [{"_lookup": "amenities", "where": "name='WiFi'"}, {"_lookup": "amenities", "where": "name='kitchen'"}, {"_lookup": "amenities", "where": "name='adventure tours'"}, {"_lookup": "amenities", "where": "name='parking'"}]);
  try {
    app.save(record44);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})