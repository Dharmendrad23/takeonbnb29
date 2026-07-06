/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("properties");

  const record0 = new Record(collection);
    record0.set("hostId", "host_001");
    record0.set("title", "Cozy Apartment in Udupi");
    record0.set("description", "Beautiful beachfront apartment with modern amenities");
    record0.set("location", "Udupi, Karnataka");
    record0.set("propertyType", "apartment");
    record0.set("pricePerNight", 2500);
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
    record1.set("hostId", "host_002");
    record1.set("title", "Heritage Villa in Udupi");
    record1.set("description", "Traditional Kerala-style villa with spacious rooms");
    record1.set("location", "Udupi, Karnataka");
    record1.set("propertyType", "villa");
    record1.set("pricePerNight", 4500);
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
    record2.set("hostId", "host_003");
    record2.set("title", "Modern House in Udupi");
    record2.set("description", "Contemporary house with all modern facilities");
    record2.set("location", "Udupi, Karnataka");
    record2.set("propertyType", "house");
    record2.set("pricePerNight", 3500);
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
    record3.set("hostId", "host_004");
    record3.set("title", "Budget Room in Udupi");
    record3.set("description", "Comfortable room for solo travelers");
    record3.set("location", "Udupi, Karnataka");
    record3.set("propertyType", "room");
    record3.set("pricePerNight", 1200);
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
    record4.set("hostId", "host_005");
    record4.set("title", "Luxury Apartment in Udupi");
    record4.set("description", "Premium apartment with ocean view");
    record4.set("location", "Udupi, Karnataka");
    record4.set("propertyType", "apartment");
    record4.set("pricePerNight", 5000);
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
    record5.set("hostId", "host_006");
    record5.set("title", "Mountain Cottage in Shimla");
    record5.set("description", "Peaceful cottage in the hills");
    record5.set("location", "Shimla, Himachal Pradesh");
    record5.set("propertyType", "house");
    record5.set("pricePerNight", 2800);
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
    record6.set("hostId", "host_007");
    record6.set("title", "Adventure Villa in Manali");
    record6.set("description", "Perfect base for adventure activities");
    record6.set("location", "Manali, Himachal Pradesh");
    record6.set("propertyType", "villa");
    record6.set("pricePerNight", 4200);
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
    record7.set("hostId", "host_008");
    record7.set("title", "Cozy Room in Dharamshala");
    record7.set("description", "Warm and welcoming room");
    record7.set("location", "Dharamshala, Himachal Pradesh");
    record7.set("propertyType", "room");
    record7.set("pricePerNight", 1500);
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
    record8.set("hostId", "host_009");
    record8.set("title", "Luxury Resort Apartment in Shimla");
    record8.set("description", "5-star apartment with all amenities");
    record8.set("location", "Shimla, Himachal Pradesh");
    record8.set("propertyType", "apartment");
    record8.set("pricePerNight", 6000);
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
    record9.set("hostId", "host_010");
    record9.set("title", "Traditional House in Kullu");
    record9.set("description", "Authentic Himachali house");
    record9.set("location", "Kullu, Himachal Pradesh");
    record9.set("propertyType", "house");
    record9.set("pricePerNight", 2200);
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
    record10.set("hostId", "host_011");
    record10.set("title", "Beach Shack in North Goa");
    record10.set("description", "Laid-back beach property");
    record10.set("location", "North Goa");
    record10.set("propertyType", "room");
    record10.set("pricePerNight", 1800);
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
    record11.set("hostId", "host_012");
    record11.set("title", "Luxury Villa in South Goa");
    record11.set("description", "Exclusive beachfront villa");
    record11.set("location", "South Goa");
    record11.set("propertyType", "villa");
    record11.set("pricePerNight", 7500);
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
    record12.set("hostId", "host_013");
    record12.set("title", "Modern Apartment in Panaji");
    record12.set("description", "Contemporary apartment in city center");
    record12.set("location", "Panaji, Goa");
    record12.set("propertyType", "apartment");
    record12.set("pricePerNight", 3200);
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
    record13.set("hostId", "host_014");
    record13.set("title", "Beachfront House in Goa");
    record13.set("description", "Direct beach access property");
    record13.set("location", "Goa");
    record13.set("propertyType", "house");
    record13.set("pricePerNight", 5500);
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
    record14.set("hostId", "host_015");
    record14.set("title", "Budget Room in Goa");
    record14.set("description", "Affordable accommodation near beach");
    record14.set("location", "Goa");
    record14.set("propertyType", "room");
    record14.set("pricePerNight", 1200);
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
    record15.set("hostId", "host_016");
    record15.set("title", "Houseboat in Kochi");
    record15.set("description", "Traditional Kerala houseboat experience");
    record15.set("location", "Kochi, Kerala");
    record15.set("propertyType", "house");
    record15.set("pricePerNight", 4800);
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
    record16.set("hostId", "host_017");
    record16.set("title", "Backwater Villa in Alleppey");
    record16.set("description", "Serene villa overlooking backwaters");
    record16.set("location", "Alleppey, Kerala");
    record16.set("propertyType", "villa");
    record16.set("pricePerNight", 5200);
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
    record17.set("hostId", "host_018");
    record17.set("title", "Cozy Room in Munnar");
    record17.set("description", "Tea plantation view room");
    record17.set("location", "Munnar, Kerala");
    record17.set("propertyType", "room");
    record17.set("pricePerNight", 1600);
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
    record18.set("hostId", "host_019");
    record18.set("title", "Luxury Apartment in Thiruvananthapuram");
    record18.set("description", "Premium apartment in capital city");
    record18.set("location", "Thiruvananthapuram, Kerala");
    record18.set("propertyType", "apartment");
    record18.set("pricePerNight", 4000);
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
    record19.set("hostId", "host_020");
    record19.set("title", "Heritage House in Kottayam");
    record19.set("description", "Historic house with modern comforts");
    record19.set("location", "Kottayam, Kerala");
    record19.set("propertyType", "house");
    record19.set("pricePerNight", 3000);
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
    record20.set("hostId", "host_021");
    record20.set("title", "Palace Hotel in Jaipur");
    record20.set("description", "Majestic palace-style accommodation");
    record20.set("location", "Jaipur, Rajasthan");
    record20.set("propertyType", "villa");
    record20.set("pricePerNight", 6500);
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
    record21.set("hostId", "host_022");
    record21.set("title", "Desert Camp in Jaisalmer");
    record21.set("description", "Authentic desert camping experience");
    record21.set("location", "Jaisalmer, Rajasthan");
    record21.set("propertyType", "house");
    record21.set("pricePerNight", 2500);
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
    record22.set("hostId", "host_023");
    record22.set("title", "Fort View Apartment in Jodhpur");
    record22.set("description", "Apartment with fort views");
    record22.set("location", "Jodhpur, Rajasthan");
    record22.set("propertyType", "apartment");
    record22.set("pricePerNight", 3800);
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
    record23.set("hostId", "host_024");
    record23.set("title", "Budget Room in Udaipur");
    record23.set("description", "Affordable room near lake");
    record23.set("location", "Udaipur, Rajasthan");
    record23.set("propertyType", "room");
    record23.set("pricePerNight", 1400);
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
    record24.set("hostId", "host_025");
    record24.set("title", "Luxury Villa in Pushkar");
    record24.set("description", "Exclusive villa near holy lake");
    record24.set("location", "Pushkar, Rajasthan");
    record24.set("propertyType", "villa");
    record24.set("pricePerNight", 5800);
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
    record25.set("hostId", "host_026");
    record25.set("title", "Modern Apartment in South Delhi");
    record25.set("description", "Contemporary apartment in upscale area");
    record25.set("location", "South Delhi");
    record25.set("propertyType", "apartment");
    record25.set("pricePerNight", 4500);
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
    record26.set("hostId", "host_027");
    record26.set("title", "Heritage House in Old Delhi");
    record26.set("description", "Historic house in cultural area");
    record26.set("location", "Old Delhi");
    record26.set("propertyType", "house");
    record26.set("pricePerNight", 2800);
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
    record27.set("hostId", "host_028");
    record27.set("title", "Luxury Villa in Gurgaon");
    record27.set("description", "Premium villa in business district");
    record27.set("location", "Gurgaon, Delhi NCR");
    record27.set("propertyType", "villa");
    record27.set("pricePerNight", 7000);
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
    record28.set("hostId", "host_029");
    record28.set("title", "Budget Room in North Delhi");
    record28.set("description", "Affordable room near metro");
    record28.set("location", "North Delhi");
    record28.set("propertyType", "room");
    record28.set("pricePerNight", 1300);
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
    record29.set("hostId", "host_030");
    record29.set("title", "Boutique Apartment in Central Delhi");
    record29.set("description", "Stylish apartment in prime location");
    record29.set("location", "Central Delhi");
    record29.set("propertyType", "apartment");
    record29.set("pricePerNight", 5500);
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
    record30.set("hostId", "host_031");
    record30.set("title", "Modern House in Amritsar");
    record30.set("description", "Contemporary house near Golden Temple");
    record30.set("location", "Amritsar, Punjab");
    record30.set("propertyType", "house");
    record30.set("pricePerNight", 2400);
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
    record31.set("hostId", "host_032");
    record31.set("title", "Luxury Villa in Chandigarh");
    record31.set("description", "Premium villa in planned city");
    record31.set("location", "Chandigarh");
    record31.set("propertyType", "villa");
    record31.set("pricePerNight", 5500);
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
    record32.set("hostId", "host_033");
    record32.set("title", "Cozy Apartment in Ludhiana");
    record32.set("description", "Comfortable apartment in industrial city");
    record32.set("location", "Ludhiana, Punjab");
    record32.set("propertyType", "apartment");
    record32.set("pricePerNight", 2800);
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
    record33.set("hostId", "host_034");
    record33.set("title", "Budget Room in Jalandhar");
    record33.set("description", "Affordable room for travelers");
    record33.set("location", "Jalandhar, Punjab");
    record33.set("propertyType", "room");
    record33.set("pricePerNight", 1100);
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
    record34.set("hostId", "host_035");
    record34.set("title", "Heritage House in Patiala");
    record34.set("description", "Historic house with royal charm");
    record34.set("location", "Patiala, Punjab");
    record34.set("propertyType", "house");
    record34.set("pricePerNight", 3200);
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
    record35.set("hostId", "host_036");
    record35.set("title", "Houseboat in Dal Lake");
    record35.set("description", "Iconic houseboat experience");
    record35.set("location", "Srinagar, Jammu & Kashmir");
    record35.set("propertyType", "house");
    record35.set("pricePerNight", 3500);
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
    record36.set("hostId", "host_037");
    record36.set("title", "Mountain Villa in Gulmarg");
    record36.set("description", "Ski resort villa");
    record36.set("location", "Gulmarg, Jammu & Kashmir");
    record36.set("propertyType", "villa");
    record36.set("pricePerNight", 6200);
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
    record37.set("hostId", "host_038");
    record37.set("title", "Cozy Room in Pahalgam");
    record37.set("description", "Room in scenic valley");
    record37.set("location", "Pahalgam, Jammu & Kashmir");
    record37.set("propertyType", "room");
    record37.set("pricePerNight", 1700);
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
    record38.set("hostId", "host_039");
    record38.set("title", "Modern Apartment in Jammu");
    record38.set("description", "Contemporary apartment in city");
    record38.set("location", "Jammu, Jammu & Kashmir");
    record38.set("propertyType", "apartment");
    record38.set("pricePerNight", 3000);
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
    record39.set("hostId", "host_040");
    record39.set("title", "Luxury Resort in Srinagar");
    record39.set("description", "5-star resort experience");
    record39.set("location", "Srinagar, Jammu & Kashmir");
    record39.set("propertyType", "villa");
    record39.set("pricePerNight", 7500);
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
    record40.set("hostId", "host_041");
    record40.set("title", "Heritage Hotel in Agra");
    record40.set("description", "Hotel near Taj Mahal");
    record40.set("location", "Agra, Uttar Pradesh");
    record40.set("propertyType", "house");
    record40.set("pricePerNight", 3200);
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
    record41.set("hostId", "host_042");
    record41.set("title", "Luxury Villa in Lucknow");
    record41.set("description", "Premium villa in city");
    record41.set("location", "Lucknow, Uttar Pradesh");
    record41.set("propertyType", "villa");
    record41.set("pricePerNight", 5000);
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
    record42.set("hostId", "host_043");
    record42.set("title", "Modern Apartment in Varanasi");
    record42.set("description", "Contemporary apartment near Ganges");
    record42.set("location", "Varanasi, Uttar Pradesh");
    record42.set("propertyType", "apartment");
    record42.set("pricePerNight", 2600);
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
    record43.set("hostId", "host_044");
    record43.set("title", "Budget Room in Mathura");
    record43.set("description", "Affordable room near temples");
    record43.set("location", "Mathura, Uttar Pradesh");
    record43.set("propertyType", "room");
    record43.set("pricePerNight", 1000);
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
    record44.set("hostId", "host_045");
    record44.set("title", "Riverside House in Kanpur");
    record44.set("description", "House with river views");
    record44.set("location", "Kanpur, Uttar Pradesh");
    record44.set("propertyType", "house");
    record44.set("pricePerNight", 2200);
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