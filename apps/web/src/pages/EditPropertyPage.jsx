import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import api from "@/lib/api.js";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useAdminAuth } from "@/contexts/AdminAuthContext.jsx";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const { adminUser, isAdmin } = useAdminAuth();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "villa",
    pricePerNight: "",
    bedrooms: "1",
    bathrooms: "1",
    guestCapacity: "1",
    houseRules: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    status: "pending",
  });

  /* ============================================
     LOAD PROPERTY
  ============================================ */

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setInitialLoading(true);

        const response = await api.get(`/properties/${id}`);

        const property =
          response.data?.property ||
          response.data?.data ||
          response.data;

        if (!property) {
          throw new Error("Property not found");
        }

        /* Host security */

        if (
          !isAdmin &&
          currentUser &&
          property.hostId &&
          String(property.hostId) !==
            String(currentUser.id || currentUser._id)
        ) {
          toast.error("You can only edit your own properties");

          navigate("/host/properties");

          return;
        }

        setFormData({
          title: property.title || "",
          description: property.description || "",
          location: property.location || "",

          propertyType:
            property.propertyType ||
            property.type ||
            "villa",

          pricePerNight:
            property.pricePerNight?.toString() ||
            property.price?.toString() ||
            "",

          bedrooms:
            property.bedrooms?.toString() || "1",

          bathrooms:
            property.bathrooms?.toString() || "1",

          guestCapacity:
            property.guestCapacity?.toString() ||
            property.guests?.toString() ||
            "1",

          houseRules:
            property.houseRules || "",

          checkInTime:
            property.checkInTime || "14:00",

          checkOutTime:
            property.checkOutTime || "11:00",

          status:
            property.status || "pending",
        });

      } catch (error) {
        console.error("FAILED TO LOAD PROPERTY:", error);

        toast.error(
          error?.response?.data?.message ||
          "Failed to load property"
        );

        navigate(
          isAdmin
            ? "/admin/properties"
            : "/host/properties"
        );

      } finally {
        setInitialLoading(false);
      }
    };

    loadProperty();

  }, [id, isAdmin, currentUser, navigate]);

  /* ============================================
     INPUT CHANGE
  ============================================ */

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ============================================
     UPDATE PROPERTY
  ============================================ */

  const handleSubmit = async (
    e,
    submitForReview = false
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,

        propertyType:
          formData.propertyType,

        pricePerNight:
          Number(formData.pricePerNight) || 0,

        bedrooms:
          Number(formData.bedrooms) || 1,

        bathrooms:
          Number(formData.bathrooms) || 1,

        guestCapacity:
          Number(formData.guestCapacity) || 1,

        houseRules:
          formData.houseRules,

        checkInTime:
          formData.checkInTime,

        checkOutTime:
          formData.checkOutTime,

        status:
          isAdmin
            ? formData.status
            : submitForReview
              ? "pending"
              : formData.status,
      };

      console.log(
        "UPDATING PROPERTY:",
        id,
        payload
      );

      await api.put(
        `/properties/${id}`,
        payload
      );

      toast.success(
        isAdmin
          ? "Property updated successfully"
          : submitForReview
            ? "Property submitted for review!"
            : "Property saved successfully"
      );

      navigate(
        isAdmin
          ? "/admin/properties"
          : "/host/properties"
      );

    } catch (error) {
      console.error(
        "PROPERTY UPDATE ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to update property"
      );

    } finally {
      setLoading(false);
    }
  };

  /* ============================================
     LOADING
  ============================================ */

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Edit Property | Take On BnB
        </title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">

        {!isAdmin && <Header />}

        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >

            <div>
              <h1 className="text-3xl font-bold">
                {isAdmin
                  ? "Admin Edit Property"
                  : "Edit Property"}
              </h1>

              <p className="text-muted-foreground mt-2">
                Update property information and save changes.
              </p>
            </div>

            {saveStatus && (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Save className="w-4 h-4" />
                {saveStatus}
              </span>
            )}

          </motion.div>

          <form className="space-y-8">

            {/* BASIC DETAILS */}

            <Card>
              <CardHeader>
                <CardTitle>
                  Basic Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Property Title
                  </label>

                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      handleInputChange(
                        "title",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>

                  <Textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange(
                        "description",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>

                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange(
                          "location",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Property Type
                    </label>

                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) =>
                        handleInputChange(
                          "propertyType",
                          value
                        )
                      }
                    >

                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>

                        <SelectItem value="apartment">
                          Apartment
                        </SelectItem>

                        <SelectItem value="house">
                          House
                        </SelectItem>

                        <SelectItem value="villa">
                          Villa
                        </SelectItem>

                        <SelectItem value="room">
                          Private Room
                        </SelectItem>

                      </SelectContent>

                    </Select>

                  </div>

                </div>

              </CardContent>

            </Card>


            {/* CAPACITY */}

            <Card>

              <CardHeader>
                <CardTitle>
                  Capacity & Pricing
                </CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Price Per Night
                  </label>

                  <Input
                    type="number"
                    value={formData.pricePerNight}
                    onChange={(e) =>
                      handleInputChange(
                        "pricePerNight",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Guests
                  </label>

                  <Input
                    type="number"
                    value={formData.guestCapacity}
                    onChange={(e) =>
                      handleInputChange(
                        "guestCapacity",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Bedrooms
                  </label>

                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "bedrooms",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Bathrooms
                  </label>

                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "bathrooms",
                        e.target.value
                      )
                    }
                  />

                </div>

              </CardContent>

            </Card>


            {/* RULES */}

            <Card>

              <CardHeader>
                <CardTitle>
                  Rules & Check-in
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Check-in Time
                    </label>

                    <Input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) =>
                        handleInputChange(
                          "checkInTime",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Check-out Time
                    </label>

                    <Input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) =>
                        handleInputChange(
                          "checkOutTime",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    House Rules
                  </label>

                  <Textarea
                    rows={4}
                    placeholder="Example: No smoking, no pets..."
                    value={formData.houseRules}
                    onChange={(e) =>
                      handleInputChange(
                        "houseRules",
                        e.target.value
                      )
                    }
                  />

                </div>

              </CardContent>

            </Card>


            {/* ADMIN STATUS */}

            {isAdmin && (

              <Card>

                <CardHeader>
                  <CardTitle>
                    Admin Controls
                  </CardTitle>
                </CardHeader>

                <CardContent>

                  <label className="block text-sm font-medium mb-2">
                    Property Status
                  </label>

                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange(
                        "status",
                        value
                      )
                    }
                  >

                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="pending">
                        Pending
                      </SelectItem>

                      <SelectItem value="approved">
                        Approved
                      </SelectItem>

                      <SelectItem value="rejected">
                        Rejected
                      </SelectItem>

                      <SelectItem value="draft">
                        Draft
                      </SelectItem>

                    </SelectContent>

                  </Select>

                </CardContent>

              </Card>

            )}


            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={loading}
                onClick={() =>
                  navigate(
                    isAdmin
                      ? "/admin/properties"
                      : "/host/properties"
                  )
                }
              >
                Cancel
              </Button>


              {!isAdmin && (

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                  onClick={(e) =>
                    handleSubmit(e, false)
                  }
                >
                  {loading && (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  )}

                  Save Details

                </Button>

              )}


              <Button
                type="button"
                size="lg"
                className="flex-1"
                disabled={loading}
                onClick={(e) =>
                  handleSubmit(
                    e,
                    !isAdmin
                  )
                }
              >

                {loading && (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                )}

                {isAdmin
                  ? "Save Property"
                  : "Submit for Review"}

              </Button>

            </div>

          </form>

        </main>

        {!isAdmin && <Footer />}

      </div>
    </>
  );
};

export default EditPropertyPage;
