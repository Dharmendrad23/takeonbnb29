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
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

  /* ===============================
     FETCH ALL PROPERTIES
  =============================== */

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

  /* ===============================
     SEARCH
  =============================== */

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

  /* ===============================
     CREATE SUCCESS
  =============================== */

  const handleCreateSuccess = () => {
    toast.success("Property created successfully");

    setIsCreateModalOpen(false);

    fetchProperties();
  };

  /* ===============================
     INPUT CHANGE
  =============================== */

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

  /* ===============================
     OPEN EDIT PAGE
  =============================== */

  const openEditModal = (property) => {
    const id = property._id || property.id;

    if (!id) {
      toast.error("Property ID not found");
      return;
    }

    navigate(`/admin/properties/edit/${id}`);
  };

  /* ===============================
     UPDATE PROPERTY
  =============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId) {
      toast.error("Property ID not found");
      return;
    }

    try {
      const data = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        guestCapacity: Number(formData.guestCapacity),
      };

      await api.put(`/properties/${editingId}`, data);

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

  /* ===============================
     APPROVE PROPERTY
  =============================== */

  const handleApprove = async (property) => {
    try {
      const id = property._id || property.id;

      if (!id) {
        toast.error("Property ID not found");
        return;
      }

      await api.patch(`/properties/${id}/status`, {
        status: "approved",
      });

      toast.success("Property approved successfully");

      fetchProperties();
    } catch (err) {
      console.error("Approve property error:", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to approve property"
      );
    }
  };

  /* ===============================
     REJECT PROPERTY
  =============================== */

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

      if (!confirmed) return;

      await api.patch(`/properties/${id}/status`, {
        status: "rejected",
      });

      toast.success("Property rejected successfully");

      fetchProperties();
    } catch (err) {
      console.error("Reject property error:", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to reject property"
      );
    }
  };

  /* ===============================
     DELETE PROPERTY
  =============================== */

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Property ID not found");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/properties/${id}`);

      toast.success("Property deleted successfully");

      fetchProperties();
    } catch (err) {
      console.error("Delete property error:", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to delete property"
      );
    }
  };

  /* ===============================
     STATUS BADGE
  =============================== */

  const getStatusBadge = (status) => {
    const normalized = String(status || "pending").toLowerCase();

    if (
      normalized === "approved" ||
      normalized === "live"
    ) {
      return (
        <Badge className="border border-green-200 bg-green-100 text-green-700">
          Approved
        </Badge>
      );
    }

    if (normalized === "rejected") {
      return (
        <Badge className="border border-red-200 bg-red-100 text-red-700">
          Rejected
        </Badge>
      );
    }

    return (
      <Badge className="border border-yellow-200 bg-yellow-100 text-yellow-700">
        Pending
      </Badge>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Helmet>
        <title>Property Management | Admin</title>
      </Helmet>

      {/* HEADER */}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Property Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage, approve and review property listings
          </p>
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card pl-9"
            />
          </div>

          <Dialog
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Create New Property</DialogTitle>
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

      {/* EDIT PROPERTY MODAL */}

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                className="min-h-[100px] w-full rounded-md border border-input bg-background p-3 text-sm text-foreground"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
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

      {/* PROPERTY TABLE */}

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
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-8 text-center"
                >
                  Loading properties...
                </td>
              </tr>
            ) : filteredProperties.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-8 text-center text-muted-foreground"
                >
                  No properties found.
                </td>
              </tr>
            ) : (
              filteredProperties.map((property) => {
                const id =
                  property._id ||
                  property.id;

                const status = String(
                  property.status || "pending"
                ).toLowerCase();

                return (
                  <tr key={id}>
                    <td className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                          {property.photos?.length > 0 ? (
                            <img
                              src={property.photos[0]}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Home className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <span className="max-w-[200px] truncate">
                          {property.title || "Untitled Property"}
                        </span>
                      </div>
                    </td>

                    <td className="text-muted-foreground">
                      {property.hostId || "Unknown"}
                    </td>

                    <td>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-1 h-3.5 w-3.5" />

                        {property.location || "N/A"}
                      </div>
                    </td>

                    <td>
                      {property.propertyType || "N/A"}
                    </td>

                    <td className="font-semibold">
                      {formatCurrency(
                        Number(property.pricePerNight || 0)
                      )}
                    </td>

                    <td className="whitespace-nowrap text-muted-foreground">
                      {property.bedrooms || 0} Bed ·{" "}
                      {property.bathrooms || 0} Bath ·{" "}
                      {property.guestCapacity || 0} Guests
                    </td>

                    <td>
                      {getStatusBadge(property.status)}
                    </td>

                    <td className="whitespace-nowrap text-right">
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
                            <CheckCircle className="h-5 w-5" />
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
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </>
                      )}

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
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          openEditModal(property)
                        }
                        title="Edit Property"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() =>
                          handleDelete(id)
                        }
                        title="Delete Property"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPropertyManagement;