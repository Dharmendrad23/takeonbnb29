import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";
import HostDashboardLayout from "@/components/HostDashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AMENITIES = [
  "WiFi",
  "Kitchen",
  "Free parking",
  "Pool",
  "Air conditioning",
  "TV",
  "Heating",
  "Garden",
  "Washing machine",
  "Workspace",
  "Balcony",
  "Restaurant",
];

const HostAddPropertyPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

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

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 20) {
      toast.error(
        "Maximum 20 images are allowed"
      );
      return;
    }

    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.id) {
      toast.error(
        "Please login again before submitting"
      );
      return;
    }

    if (!selectedImages.length) {
      toast.error(
        "Please upload at least one property image"
      );
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append(
        "hostId",
        currentUser.id
      );

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "propertyType",
        formData.propertyType
      );

      data.append(
        "propertyCategory",
        formData.propertyCategory
      );

      data.append(
        "maxGuests",
        formData.maxGuests || 1
      );

      data.append(
        "bedrooms",
        formData.bedrooms || 0
      );

      data.append(
        "beds",
        formData.beds || 0
      );

      data.append(
        "bathrooms",
        formData.bathrooms || 0
      );

      data.append(
        "address",
        formData.address
      );

      data.append(
        "city",
        formData.city
      );

      data.append(
        "state",
        formData.state
      );

      data.append(
        "country",
        formData.country
      );

      data.append(
        "pincode",
        formData.pincode
      );

      data.append(
        "latitude",
        formData.latitude
      );

      data.append(
        "longitude",
        formData.longitude
      );

      data.append(
        "pricePerNight",
        formData.pricePerNight
      );

      data.append(
        "amenities",
        JSON.stringify(formData.amenities)
      );

      data.append(
        "checkInTime",
        formData.checkInTime
      );

      data.append(
        "checkOutTime",
        formData.checkOutTime
      );

      data.append(
        "houseRules",
        formData.houseRules
      );

      selectedImages.forEach((image) => {
        data.append("images", image);
      });

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3001/api";

      const response = await fetch(
        `${API_URL}/properties`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to submit property"
        );
      }

      toast.success(
        "Property submitted successfully! Waiting for admin approval."
      );

      navigate("/host/properties");

    } catch (error) {
      console.error(
        "PROPERTY SUBMIT ERROR:",
        error
      );

      toast.error(
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Add New Property
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

          <section className="border rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-semibold">
              Property details
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Property title *
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
                placeholder="e.g. Luxury Villa in Dehradun"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                About this place *
              </label>

              <textarea
                required
                rows={6}
                value={formData.description}
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
                  Property type *
                </label>

                <select
                  value={formData.propertyType}
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

          <section className="border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-5">
              Guests and rooms
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

              <div>
                <label className="text-sm font-medium">
                  Guests
                </label>

                <Input
                  type="number"
                  min="1"
                  value={formData.maxGuests}
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
                  value={formData.bedrooms}
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
                  value={formData.beds}
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
                  value={formData.bathrooms}
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

          <section className="border rounded-2xl p-6 space-y-5">

            <h2 className="text-xl font-semibold">
              Property location
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Address
              </label>

              <Input
                value={formData.address}
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
                  value={formData.city}
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
                  value={formData.state}
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
                  value={formData.country}
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
                  value={formData.pincode}
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
                  value={formData.latitude}
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
                  value={formData.longitude}
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

          {/* PRICE */}

          <section className="border rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-5">
              Pricing
            </h2>

            <div className="max-w-md">
              <label className="text-sm font-medium">
                Price per night (&#8377;) *
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

          {/* AMENITIES */}

          <section className="border rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-2">
              What this place offers
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              Select all amenities available
              at your property.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              {AMENITIES.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(
                      amenity
                    )}
                    onChange={() =>
                      toggleAmenity(
                        amenity
                      )
                    }
                  />

                  <span className="text-sm">
                    {amenity}
                  </span>
                </label>
              ))}

            </div>

          </section>

          {/* IMAGES */}

          <section className="border rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-2">
              Property photos
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              Upload up to 20 photos.
              These images will be uploaded
              to Cloudinary.
            </p>

            <Input
              required
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            {selectedImages.length > 0 && (
              <p className="text-sm mt-3">
                {selectedImages.length} image(s)
                selected
              </p>
            )}

          </section>

          {/* CHECK-IN */}

          <section className="border rounded-2xl p-6 space-y-5">

            <h2 className="text-xl font-semibold">
              Things to know
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="text-sm font-medium">
                  Check-in time
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
                  Check-out time
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
                House rules
              </label>

              <textarea
                rows={4}
                value={formData.houseRules}
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

