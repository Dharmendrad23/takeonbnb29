import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";
import HostDashboardLayout from "@/components/HostDashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { buildApiUrl } from "../lib/api";

import {
  Wifi,
  Thermometer,
  Utensils,
  BedDouble,
  Bath,
  Mountain,
  Waves,
  Car,
  ShieldCheck,
  ConciergeBell,
  Baby,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react";


/* =========================================================
   100+ AMENITIES
========================================================= */

const AMENITY_CATEGORIES = [
  {
    id: "internet",
    title: "Internet & Entertainment",
    description: "WiFi, TV, streaming, gaming & more",
    icon: Wifi,
    amenities: [
      "WiFi",
      "High-Speed WiFi",
      "Smart TV",
      "Cable TV",
      "Netflix",
      "Amazon Prime Video",
      "Disney+ Hotstar",
      "Bluetooth Speaker",
      "Home Theatre",
      "Gaming Console",
    ],
  },

  {
    id: "heating",
    title: "Heating & Cooling",
    description: "AC, heating, fans & more",
    icon: Thermometer,
    amenities: [
      "Air Conditioning",
      "Central Air Conditioning",
      "Heating",
      "Room Heater",
      "Ceiling Fan",
      "Portable Fan",
      "Fireplace",
      "Electric Blanket",
    ],
  },

  {
    id: "kitchen",
    title: "Kitchen & Dining",
    description: "Kitchen appliances, utensils & dining",
    icon: Utensils,
    amenities: [
      "Kitchen",
      "Refrigerator",
      "Microwave",
      "Oven",
      "Gas Stove",
      "Induction Cooktop",
      "Cooking Basics",
      "Cooking Utensils",
      "Dining Table",
      "Dishwasher",
      "Coffee Maker",
      "Electric Kettle",
      "Toaster",
      "Water Purifier",
      "Barbecue Grill",
      "Mini Bar",
    ],
  },

  {
    id: "bedroom",
    title: "Bedroom & Laundry",
    description: "Laundry, wardrobe, bed essentials & more",
    icon: BedDouble,
    amenities: [
      "Washing Machine",
      "Dryer",
      "Iron",
      "Ironing Board",
      "Extra Pillows",
      "Extra Blankets",
      "Wardrobe",
      "Hangers",
      "Bed Linen",
      "Towels",
      "Hair Dryer",
      "Blackout Curtains",
    ],
  },

  {
    id: "bathroom",
    title: "Bathroom",
    description: "Bathroom amenities & essentials",
    icon: Bath,
    amenities: [
      "Hot Water",
      "Bathtub",
      "Shower",
      "Jacuzzi",
      "Shampoo",
      "Conditioner",
      "Body Soap",
      "Toilet Essentials",
      "Bidet",
      "Bathroom Towels",
      "Bathroom Essentials",
    ],
  },

  {
    id: "outdoor",
    title: "Outdoor & Views",
    description: "Garden, balcony, views & outdoor seating",
    icon: Mountain,
    amenities: [
      "Balcony",
      "Terrace",
      "Private Garden",
      "Shared Garden",
      "Patio",
      "Mountain View",
      "Valley View",
      "Garden View",
      "Pool View",
      "City View",
      "River View",
      "Lake View",
      "Forest View",
      "Outdoor Furniture",
      "Outdoor Dining Area",
      "Bonfire Area",
      "BBQ Area",
    ],
  },

  {
    id: "wellness",
    title: "Pool & Wellness",
    description: "Pool, gym, spa & wellness facilities",
    icon: Waves,
    amenities: [
      "Swimming Pool",
      "Private Pool",
      "Indoor Pool",
      "Hot Tub",
      "Jacuzzi",
      "Sauna",
      "Spa",
      "Gym",
      "Yoga Area",
      "Massage Service",
    ],
  },

  {
    id: "parking",
    title: "Parking & Transport",
    description: "Parking, EV charger, transport & more",
    icon: Car,
    amenities: [
      "Free Parking",
      "Paid Parking",
      "Private Parking",
      "EV Charger",
      "Airport Pickup",
      "Taxi Service",
      "Bicycle Rental",
      "Car Rental",
    ],
  },

  {
    id: "safety",
    title: "Safety & Security",
    description: "Security, alarms, CCTV & safety gear",
    icon: ShieldCheck,
    amenities: [
      "CCTV",
      "Security Guard",
      "Fire Extinguisher",
      "Smoke Alarm",
      "Carbon Monoxide Alarm",
      "First Aid Kit",
      "Emergency Exit",
      "Security Alarm",
      "Safe / Locker",
    ],
  },

  {
    id: "services",
    title: "Services & Property Features",
    description: "Services, accessibility & property features",
    icon: ConciergeBell,
    amenities: [
      "Self Check-in",
      "24/7 Check-in",
      "Reception",
      "Housekeeping",
      "Daily Cleaning",
      "Breakfast",
      "Room Service",
      "Chef Available",
      "Cook Available",
      "Butler Service",
      "Luggage Drop-off",
      "Long-Term Stays Allowed",
      "Workspace",
      "Meeting Room",
      "Elevator",
      "Wheelchair Accessible",
      "Pets Allowed",
      "Smoking Area",
      "Event Space",
    ],
  },

  {
    id: "family",
    title: "Family Friendly",
    description: "Kids, baby essentials & family features",
    icon: Baby,
    amenities: [
      "Crib",
      "Baby Bath",
      "High Chair",
      "Children's Books & Toys",
      "Baby Safety Gates",
      "Children's Playground",
      "Kids Pool",
      "Babysitter Available",
    ],
  },
];


const HostAddPropertyPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);

  const [amenitySearch, setAmenitySearch] = useState("");

  const [openCategories, setOpenCategories] = useState({});

  const [customAmenity, setCustomAmenity] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",

    propertyType: "villa",
    propertyCategory: "All",

    maxGuests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",

    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    latitude: "",
    longitude: "",

    pricePerNight: "",

    amenities: [],

    checkInTime: "",
    checkOutTime: "",
    houseRules: "",
  });


  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* =========================================================
     TOGGLE AMENITY
  ========================================================= */

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,

      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(
            (item) => item !== amenity
          )
        : [...prev.amenities, amenity],
    }));
  };


  /* =========================================================
     REMOVE AMENITY
  ========================================================= */

  const removeAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,

      amenities: prev.amenities.filter(
        (item) => item !== amenity
      ),
    }));
  };


  /* =========================================================
     CLEAR ALL
  ========================================================= */

  const clearAllAmenities = () => {
    setFormData((prev) => ({
      ...prev,
      amenities: [],
    }));
  };


  /* =========================================================
     ADD CUSTOM AMENITY
  ========================================================= */

  const addCustomAmenity = () => {
    const amenity = customAmenity.trim();

    if (!amenity) {
      toast.error("Please enter an amenity name");
      return;
    }

    const alreadyExists =
      formData.amenities.some(
        (item) =>
          item.toLowerCase() === amenity.toLowerCase()
      );

    if (alreadyExists) {
      toast.error("This amenity is already selected");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      amenities: [
        ...prev.amenities,
        amenity,
      ],
    }));

    setCustomAmenity("");

    toast.success(
      `${amenity} added successfully`
    );
  };


  /* =========================================================
     OPEN / CLOSE CATEGORY
  ========================================================= */

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };


  /* =========================================================
     SEARCH AMENITIES
  ========================================================= */

  const filteredCategories = useMemo(() => {
    const search = amenitySearch
      .trim()
      .toLowerCase();

    if (!search) {
      return AMENITY_CATEGORIES;
    }

    return AMENITY_CATEGORIES.map(
      (category) => ({
        ...category,

        amenities: category.amenities.filter(
          (amenity) =>
            amenity
              .toLowerCase()
              .includes(search)
        ),
      })
    ).filter(
      (category) =>
        category.amenities.length > 0
    );
  }, [amenitySearch]);


  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length > 20) {
      toast.error(
        "Maximum 20 images are allowed"
      );

      return;
    }

    setSelectedImages(files);
  };


  /* =========================================================
     SUBMIT PROPERTY
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.id) {
      toast.error("Please login again before submitting");
      return;
    }

    if (!selectedImages.length) {
      toast.error("Please upload at least one property image");
      return;
    }

    if (!formData.title?.trim()) {
      toast.error("Property title is required");
      return;
    }

    if (!formData.description?.trim()) {
      toast.error("Property description is required");
      return;
    }

    if (!formData.city?.trim()) {
      toast.error("City is required");
      return;
    }

    if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
      toast.error("Valid price per night is required");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("hostId", currentUser.id);
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());

      payload.append(
        "propertyType",
        formData.propertyType || "villa"
      );

      payload.append(
        "propertyCategory",
        formData.propertyCategory || "All"
      );

      payload.append(
        "maxGuests",
        String(Number(formData.maxGuests) || 1)
      );

      payload.append(
        "bedrooms",
        String(Number(formData.bedrooms) || 0)
      );

      payload.append(
        "beds",
        String(Number(formData.beds) || 0)
      );

      payload.append(
        "bathrooms",
        String(Number(formData.bathrooms) || 0)
      );

      payload.append("address", formData.address || "");
      payload.append("city", formData.city.trim());
      payload.append("state", formData.state || "");
      payload.append("country", formData.country || "India");
      payload.append("pincode", formData.pincode || "");

      payload.append("latitude", formData.latitude || "");
      payload.append("longitude", formData.longitude || "");

      payload.append(
        "pricePerNight",
        String(Number(formData.pricePerNight) || 0)
      );

      payload.append(
        "checkInTime",
        formData.checkInTime || ""
      );

      payload.append(
        "checkOutTime",
        formData.checkOutTime || ""
      );

      payload.append(
        "houseRules",
        formData.houseRules || ""
      );

      formData.amenities.forEach((amenity) => {
        payload.append("amenities", amenity);
      });

      selectedImages.forEach((image) => {
        payload.append("images", image);
      });

      const response = await axios.post(
        buildApiUrl("/api/properties"),
        payload,
        {
          timeout: 60000,
        }
      );

      const result = response.data;

      if (result?.success === false) {
        throw new Error(
          result.message || "Failed to submit property"
        );
      }

      toast.success(
        "Property submitted successfully! Waiting for admin approval."
      );

      navigate("/host/properties");

    } catch (error) {
      console.error(
        "PROPERTY SUBMIT ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit property"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <HostDashboardLayout>

      <Helmet>
        <title>
          Add New Property | Take On BnB
        </title>
      </Helmet>


      <div className="max-w-5xl mx-auto pb-10">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            List Your Property
          </h1>

          <p className="text-muted-foreground mt-2">
            Add complete details so your property
            appears correctly on the Take On BnB
            property page.
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >


          {/* BASIC DETAILS */}

          <section className="border rounded-2xl p-6 space-y-5 bg-white">

            <h2 className="text-xl font-semibold">
              Property Details
            </h2>


            <div>

              <label className="block text-sm font-medium mb-2">
                Property Title *
              </label>

              <Input
                required
                value={formData.title}
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
                placeholder="e.g. Pine Rose Cottage & Resort"
              />

            </div>


            <div>

              <label className="block text-sm font-medium mb-2">
                About This Place *
              </label>

              <textarea
                required
                rows={6}
                value={
                  formData.description
                }
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm"
                placeholder="Describe your property, rooms, views, facilities and what makes it special..."
              />

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Property Type *
                </label>

                <select
                  value={
                    formData.propertyType
                  }
                  onChange={(e) =>
                    updateField(
                      "propertyType",
                      e.target.value
                    )
                  }
                  className="w-full h-10 rounded-md border border-input px-3"
                >

                  <option value="apartment">
                    Apartment
                  </option>

                  <option value="house">
                    House
                  </option>

                  <option value="villa">
                    Villa
                  </option>

                  <option value="room">
                    Private Room
                  </option>

                  <option value="hotel">
                    Hotel
                  </option>

                  <option value="resort">
                    Resort
                  </option>

                  <option value="cottage">
                    Cottage
                  </option>

                  <option value="homestay">
                    Homestay
                  </option>

                  <option value="farmstay">
                    Farm Stay
                  </option>

                </select>

              </div>


              <div>

                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  value={
                    formData.propertyCategory
                  }
                  onChange={(e) =>
                    updateField(
                      "propertyCategory",
                      e.target.value
                    )
                  }
                  className="w-full h-10 rounded-md border border-input px-3"
                >

                  <option value="All">
                    General
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Hotel">
                    Hotel
                  </option>

                  <option value="Luxury">
                    Luxury
                  </option>

                  <option value="Budget">
                    Budget
                  </option>

                </select>

              </div>

            </div>

          </section>



          {/* GUESTS & ROOMS */}

          <section className="border rounded-2xl p-6 bg-white">

            <h2 className="text-xl font-semibold mb-5">
              Guests and Rooms
            </h2>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

              <div>

                <label className="text-sm font-medium">
                  Guests
                </label>

                <Input
                  type="number"
                  min="1"
                  value={
                    formData.maxGuests
                  }
                  onChange={(e) =>
                    updateField(
                      "maxGuests",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  Bedrooms
                </label>

                <Input
                  type="number"
                  min="0"
                  value={
                    formData.bedrooms
                  }
                  onChange={(e) =>
                    updateField(
                      "bedrooms",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  Beds
                </label>

                <Input
                  type="number"
                  min="0"
                  value={
                    formData.beds
                  }
                  onChange={(e) =>
                    updateField(
                      "beds",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  Bathrooms
                </label>

                <Input
                  type="number"
                  min="0"
                  value={
                    formData.bathrooms
                  }
                  onChange={(e) =>
                    updateField(
                      "bathrooms",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </section>



          {/* LOCATION */}

          <section className="border rounded-2xl p-6 space-y-5 bg-white">

            <h2 className="text-xl font-semibold">
              Property Location
            </h2>


            <div>

              <label className="block text-sm font-medium mb-2">
                Address
              </label>

              <Input
                value={
                  formData.address
                }
                onChange={(e) =>
                  updateField(
                    "address",
                    e.target.value
                  )
                }
                placeholder="Property address"
              />

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="text-sm font-medium">
                  City *
                </label>

                <Input
                  required
                  value={
                    formData.city
                  }
                  onChange={(e) =>
                    updateField(
                      "city",
                      e.target.value
                    )
                  }
                  placeholder="Dehradun"
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  State
                </label>

                <Input
                  value={
                    formData.state
                  }
                  onChange={(e) =>
                    updateField(
                      "state",
                      e.target.value
                    )
                  }
                  placeholder="Uttarakhand"
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  Country
                </label>

                <Input
                  value={
                    formData.country
                  }
                  onChange={(e) =>
                    updateField(
                      "country",
                      e.target.value
                    )
                  }
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  Pincode
                </label>

                <Input
                  value={
                    formData.pincode
                  }
                  onChange={(e) =>
                    updateField(
                      "pincode",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="text-sm font-medium">
                  Latitude
                </label>

                <Input
                  type="number"
                  step="any"
                  value={
                    formData.latitude
                  }
                  onChange={(e) =>
                    updateField(
                      "latitude",
                      e.target.value
                    )
                  }
                  placeholder="30.3165"
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  Longitude
                </label>

                <Input
                  type="number"
                  step="any"
                  value={
                    formData.longitude
                  }
                  onChange={(e) =>
                    updateField(
                      "longitude",
                      e.target.value
                    )
                  }
                  placeholder="78.0322"
                />

              </div>

            </div>

          </section>



          {/* PRICING */}

          <section className="border rounded-2xl p-6 bg-white">

            <h2 className="text-xl font-semibold mb-5">
              Pricing
            </h2>


            <div className="max-w-md">

              <label className="text-sm font-medium">
                Price Per Night (₹) *
              </label>

              <Input
                required
                type="number"
                min="1"
                value={
                  formData.pricePerNight
                }
                onChange={(e) =>
                  updateField(
                    "pricePerNight",
                    e.target.value
                  )
                }
                placeholder="5000"
              />

            </div>

          </section>



          {/* =====================================================
              AMENITIES & FACILITIES
          ===================================================== */}

          <section className="border rounded-2xl p-4 md:p-6 bg-white">

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">

              <div>

                <h2 className="text-xl md:text-2xl font-bold">
                  Amenities & Facilities
                </h2>

                <p className="text-sm text-muted-foreground mt-2">
                  Select all amenities that are
                  available at your property.
                </p>

              </div>


              <div className="flex items-center gap-3">

                <div className="border rounded-xl px-4 py-3 bg-orange-50 border-orange-100">

                  <span className="text-2xl font-bold text-orange-600">
                    {formData.amenities.length}
                  </span>

                  <span className="ml-2 text-sm text-muted-foreground">
                    Selected
                  </span>

                </div>


                {formData.amenities.length > 0 && (

                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearAllAmenities}
                    className="text-orange-600 border-orange-200"
                  >
                    <Trash2
                      size={16}
                      className="mr-2"
                    />

                    Clear All
                  </Button>

                )}

              </div>

            </div>



            {/* SEARCH */}

            <div className="relative mb-6">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                value={amenitySearch}
                onChange={(e) =>
                  setAmenitySearch(
                    e.target.value
                  )
                }
                placeholder="Search amenities e.g. WiFi, Pool, Kitchen, Parking..."
                className="pl-12 h-12"
              />

            </div>



            {/* AMENITY CATEGORIES */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {filteredCategories.map(
                (category) => {
                  const Icon =
                    category.icon;

                  const selectedCount =
                    category.amenities.filter(
                      (amenity) =>
                        formData.amenities.includes(
                          amenity
                        )
                    ).length;

                  const isOpen =
                    amenitySearch.trim() !== ""
                      ? true
                      : openCategories[
                          category.id
                        ] || false;


                  return (

                    <div
                      key={category.id}
                      className="border rounded-2xl overflow-hidden"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          toggleCategory(
                            category.id
                          )
                        }
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-orange-50 transition"
                      >

                        <div className="w-11 h-11 shrink-0 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">

                          <Icon size={22} />

                        </div>


                        <div className="flex-1">

                          <h3 className="font-semibold">
                            {category.title}
                          </h3>

                          <p className="text-xs text-muted-foreground mt-1">
                            {category.description}
                          </p>

                        </div>


                        <div className="flex items-center gap-2">

                          <span className="min-w-8 text-center px-2 py-1 rounded-lg bg-orange-50 text-orange-600 text-sm font-bold">

                            {selectedCount}

                          </span>


                          {isOpen ? (
                            <ChevronUp
                              size={18}
                            />
                          ) : (
                            <ChevronDown
                              size={18}
                            />
                          )}

                        </div>

                      </button>



                      {isOpen && (

                        <div className="border-t p-4 bg-muted/20">

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                            {category.amenities.map(
                              (amenity) => {

                                const selected =
                                  formData.amenities.includes(
                                    amenity
                                  );


                                return (

                                  <button
                                    type="button"
                                    key={amenity}
                                    onClick={() =>
                                      toggleAmenity(
                                        amenity
                                      )
                                    }
                                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-sm text-left transition ${
                                      selected
                                        ? "border-orange-400 bg-orange-50 text-orange-700"
                                        : "bg-white hover:border-orange-300"
                                    }`}
                                  >

                                    <span>
                                      {amenity}
                                    </span>


                                    {selected && (

                                      <CheckCircle2
                                        size={17}
                                        className="text-orange-500 shrink-0"
                                      />

                                    )}

                                  </button>

                                );

                              }
                            )}

                          </div>

                        </div>

                      )}

                    </div>

                  );

                }
              )}

            </div>



            {/* CUSTOM AMENITY */}

            <div className="mt-6 border rounded-2xl p-5 bg-orange-50/30">

              <h3 className="font-semibold text-lg">
                Add Custom Amenity
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                Can't find an amenity? Add your own.
              </p>


              <div className="flex flex-col sm:flex-row gap-3 mt-4">

                <Input
                  value={customAmenity}
                  onChange={(e) =>
                    setCustomAmenity(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {

                    if (
                      e.key === "Enter"
                    ) {
                      e.preventDefault();

                      addCustomAmenity();
                    }

                  }}
                  placeholder="Enter custom amenity name"
                />


                <Button
                  type="button"
                  onClick={
                    addCustomAmenity
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >

                  <Plus
                    size={18}
                    className="mr-2"
                  />

                  Add Amenity

                </Button>

              </div>

            </div>



            {/* SELECTED AMENITIES */}

            <div className="mt-6 border rounded-2xl p-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h3 className="font-semibold text-lg">

                    Selected Amenities (
                    {formData.amenities.length}
                    )

                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">

                    These amenities will be shown
                    on your property page.

                  </p>

                </div>

              </div>


              {formData.amenities.length === 0 ? (

                <div className="py-8 text-center text-sm text-muted-foreground">

                  No amenities selected yet.

                </div>

              ) : (

                <div className="mt-5 flex flex-wrap gap-2">

                  {formData.amenities.map(
                    (amenity) => (

                      <div
                        key={amenity}
                        className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg px-3 py-2 text-sm"
                      >

                        <span>
                          {amenity}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            removeAmenity(
                              amenity
                            )
                          }
                          className="hover:text-red-600"
                        >

                          <X size={16} />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>



          {/* IMAGES */}

          <section className="border rounded-2xl p-6 bg-white">

            <h2 className="text-xl font-semibold mb-2">
              Property Photos
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              Upload up to 100 photos.
              These images will be uploaded
              to Cloudinary.
            </p>


            <Input
              required
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImageChange
              }
            />


            {selectedImages.length > 0 && (

              <p className="text-sm mt-3">

                {selectedImages.length} image(s)
                selected

              </p>

            )}

          </section>



          {/* CHECK-IN */}

          <section className="border rounded-2xl p-6 space-y-5 bg-white">

            <h2 className="text-xl font-semibold">
              Things to Know
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="text-sm font-medium">
                  Check-in Time
                </label>

                <Input
                  value={
                    formData.checkInTime
                  }
                  onChange={(e) =>
                    updateField(
                      "checkInTime",
                      e.target.value
                    )
                  }
                  placeholder="2:00 PM"
                />

              </div>


              <div>

                <label className="text-sm font-medium">
                  Check-out Time
                </label>

                <Input
                  value={
                    formData.checkOutTime
                  }
                  onChange={(e) =>
                    updateField(
                      "checkOutTime",
                      e.target.value
                    )
                  }
                  placeholder="11:00 AM"
                />

              </div>

            </div>


            <div>

              <label className="text-sm font-medium">
                House Rules
              </label>

              <textarea
                rows={4}
                value={
                  formData.houseRules
                }
                onChange={(e) =>
                  updateField(
                    "houseRules",
                    e.target.value
                  )
                }
                className="w-full mt-2 rounded-md border border-input bg-transparent px-3 py-3 text-sm"
                placeholder="Please respect the property and follow the host's guidelines."
              />

            </div>

          </section>



          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(-1)
              }
            >
              Cancel
            </Button>


            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >

              {loading
                ? "Submitting..."
                : "Submit Property"}

            </Button>

          </div>

        </form>

      </div>

    </HostDashboardLayout>
  );
};


export default HostAddPropertyPage;


