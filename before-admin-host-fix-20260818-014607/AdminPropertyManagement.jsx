import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Home,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/lib/api.js";
import { formatCurrency } from "@/lib/bookingUtils.js";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext.jsx";
import PropertyForm from "@/components/property/PropertyForm.jsx";

const PROPERTY_TYPE_OPTIONS = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "room", label: "Private Room" },
];

const AdminPropertyManagement = () => {
  const { adminUser } = useAdminAuth();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "villa",
    pricePerNight: "",
    bedrooms: "",
    bathrooms: "",
    guestCapacity: "",
    status: "pending",
  });

  /* ============================================
     FETCH ALL PROPERTIES - ADMIN ONLY
  ============================================ */

  const fetchProperties = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/properties");

      const data = response.data;

      const records = Array.isArray(data)
        ? data
        : data?.properties || data?.data || [];

      console.log("ADMIN PROPERTIES:", records);

      setProperties(records);
    } catch (err) {
      console.error("Failed to fetch properties:", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to fetch properties"
      );

      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  /* ============================================
     SEARCH
  ============================================ */

  const filteredProperties = properties.filter((property) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      property?.title?.toLowerCase().includes(query) ||
      property?.location?.toLowerCase().includes(query) ||
      String(property?.hostId || "")
        .toLowerCase()
        .includes(query)
    );
  });

  /* ============================================
     CREATE SUCCESS
  ============================================ */

  const handleCreateSuccess = () => {
    toast.success("Property created successfully");

    setIsCreateModalOpen(false);

    fetchProperties();
  };

  /* ============================================
     INPUT CHANGE
  ============================================ */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================
     OPEN EDIT MODAL
  ============================================ */

  const openEditModal = (property) => {
    setEditingId(property._id || property.id);

    setFormData({
      title: property.title || "",
      description: property.description || "",
      location: property.location || "",
      propertyType: String(
        property.propertyType || "villa"
      ).toLowerCase(),
      pricePerNight: property.pricePerNight || "",
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      guestCapacity: property.guestCapacity || 1,
      status: property.status || "pending",
    });

    setIsModalOpen(true);
  };

  /* ============================================
     UPDATE PROPERTY DETAILS
  ============================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        guestCapacity: Number(formData.guestCapacity),
      };

      await api.put(
        `/properties/${editingId}`,
        data
      );

      toast.success("Property updated successfully");

      setIsModalOpen(false);

      fetchProperties();
    } catch (err) {
      console.error("Update property error:", err);

      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update property"
      );
    }
  };

  /* ============================================
     ADMIN APPROVE PROPERTY
  ============================================ */

  const handleApprove = async (property) => {
    try {
      const id = property._id || property.id;

      if (!id) {
        toast.error("Property ID not found");
        return;
      }

      await api.patch(
        `/properties/${id}/status`,
        {
          status: "approved",
        }
      );

      toast.success(
        "Property approved successfully"
      );

      fetchProperties();
    } catch (err) {
      console.error(
        "Approve property error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to approve property"
      );
    }
  };

  /* ============================================
     ADMIN REJECT PROPERTY
  ============================================ */

  const handleReject = async (property) => {
    try {
      const id = property._id || property.id;

      if (!id) {
        toast.error("Property ID not found");
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to reject "${property.title}"?`
      );

      if (!confirmed) {
        return;
      }

      await api.patch(
        `/properties/${id}/status`,
        {
          status: "rejected",
        }
      );

      toast.success(
        "Property rejected successfully"
      );

      fetchProperties();
    } catch (err) {
      console.error(
        "Reject property error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to reject property"
      );
    }
  };

  /* ============================================
     DELETE PROPERTY
  ============================================ */

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this property?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/properties/${id}`);

      toast.success(
        "Property deleted successfully"
      );

      fetchProperties();
    } catch (err) {
      console.error(
        "Delete property error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to delete property"
      );
    }
  };

  /* ============================================
     STATUS BADGE
  ============================================ */

  const getStatusBadge = (status) => {
    const normalized = String(
      status || "pending"
    ).toLowerCase();

    if (
      normalized === "approved" ||
      normalized === "live"
    ) {
      return (
        <Badge className="bg-green-100 text-green-700 border border-green-200">
          Approved
        </Badge>
      );
    }

    if (normalized === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-700 border border-red-200">
          Rejected
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200">
        Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <Helmet>
        <title>Property Management | Admin</title>
      </Helmet>

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Property Management
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage, approve and review property listings
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">

          <div className="relative flex-1 sm:w-64">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="pl-9 bg-card"
            />

          </div>

          <Dialog
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          >

            <DialogTrigger asChild>

              <Button className="bg-primary text-primary-foreground">

                <Plus className="w-4 h-4 mr-2" />

                Add Property

              </Button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">

              <DialogHeader>

                <DialogTitle>
                  Create New Property
                </DialogTitle>

              </DialogHeader>

              <PropertyForm
                hostId={adminUser?.id}
                defaultStatus="approved"
                submitLabel="Create Property"
                submittingLabel="Creating..."
                onSuccess={handleCreateSuccess}
              />

            </DialogContent>

          </Dialog>

        </div>

      </div>

      {/* =====================================
          EDIT PROPERTY MODAL
      ====================================== */}

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >

        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">

          <DialogHeader>

            <DialogTitle>
              Edit Property
            </DialogTitle>

          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label>Title</Label>

                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />

              </div>

              <div className="space-y-2">

                <Label>Location</Label>

                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />

              </div>

              <div className="space-y-2">

                <Label>Property Type</Label>

                <Select
                  value={formData.propertyType}
                  onValueChange={(value) =>
                    handleSelectChange(
                      "propertyType",
                      value
                    )
                  }
                >

                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    {PROPERTY_TYPE_OPTIONS.map(
                      (option) => (

                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>

                      )
                    )}

                  </SelectContent>

                </Select>

              </div>

              <div className="space-y-2">

                <Label>Price per Night</Label>

                <Input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  required
                />

              </div>

              <div className="space-y-2">

                <Label>Bedrooms</Label>

                <Input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                />

              </div>

              <div className="space-y-2">

                <Label>Bathrooms</Label>

                <Input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                />

              </div>

              <div className="space-y-2">

                <Label>Guest Capacity</Label>

                <Input
                  type="number"
                  name="guestCapacity"
                  value={formData.guestCapacity}
                  onChange={handleInputChange}
                  required
                />

              </div>

            </div>

            <div className="space-y-2">

              <Label>Description</Label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-foreground text-sm"
                required
              />

            </div>

            <div className="flex justify-end gap-3 pt-4">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setIsModalOpen(false)
                }
              >
                Cancel
              </Button>

              <Button type="submit">
                Save Changes
              </Button>

            </div>

          </form>

        </DialogContent>

      </Dialog>

      {/* =====================================
          PROPERTY TABLE
      ====================================== */}

      <div className="admin-table-container overflow-x-auto">

        <table className="admin-table w-full">

          <thead>

            <tr>

              <th>Property</th>
              <th>Host</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price/Night</th>
              <th>Capacity</th>
              <th>Status</th>
              <th className="text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {isLoading ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-8"
                >
                  Loading properties...
                </td>

              </tr>

            ) : filteredProperties.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-8 text-muted-foreground"
                >
                  No properties found.
                </td>

              </tr>

            ) : (

              filteredProperties.map(
                (property) => {

                  const id =
                    property._id ||
                    property.id;

                  const status = String(
                    property.status ||
                    "pending"
                  ).toLowerCase();

                  return (

                    <tr key={id}>

                      {/* PROPERTY */}

                      <td className="font-medium">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">

                            {property.photos?.length > 0 ? (

                              <img
                                src={property.photos[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />

                            ) : (

                              <Home className="w-5 h-5 text-muted-foreground" />

                            )}

                          </div>

                          <span className="truncate max-w-[200px]">

                            {property.title}

                          </span>

                        </div>

                      </td>

                      {/* HOST */}

                      <td className="text-muted-foreground">

                        {property.hostId || "Unknown"}

                      </td>

                      {/* LOCATION */}

                      <td>

                        <div className="flex items-center text-muted-foreground">

                          <MapPin className="w-3.5 h-3.5 mr-1" />

                          {property.location}

                        </div>

                      </td>

                      {/* TYPE */}

                      <td>

                        {property.propertyType}

                      </td>

                      {/* PRICE */}

                      <td className="font-semibold">

                        {formatCurrency(
                          property.pricePerNight
                        )}

                      </td>

                      {/* CAPACITY */}

                      <td className="text-muted-foreground whitespace-nowrap">

                        {property.bedrooms} Bed ·{" "}
                        {property.bathrooms} Bath ·{" "}
                        {property.guestCapacity} Guests

                      </td>

                      {/* STATUS */}

                      <td>

                        {getStatusBadge(
                          property.status
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="text-right whitespace-nowrap">

                        {/* APPROVE / REJECT
                            ONLY FOR PENDING PROPERTIES
                            ONLY EXISTS IN ADMIN PAGE
                        */}

                        {status === "pending" && (

                          <>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700"
                              title="Approve Property"
                              onClick={() =>
                                handleApprove(property)
                              }
                            >

                              <CheckCircle className="w-5 h-5" />

                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              title="Reject Property"
                              onClick={() =>
                                handleReject(property)
                              }
                            >

                              <XCircle className="w-5 h-5" />

                            </Button>

                          </>

                        )}

                        {/* VIEW */}

                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >

                          <Link
                            to={`/property/${id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Property"
                          >

                            <Eye className="w-4 h-4" />

                          </Link>

                        </Button>

                        {/* EDIT */}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            openEditModal(property)
                          }
                          title="Edit Property"
                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        {/* DELETE */}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() =>
                            handleDelete(id)
                          }
                          title="Delete Property"
                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  );

                }
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminPropertyManagement;