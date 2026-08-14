import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Check,
  X,
  Search,
  FileText,
  MapPin,
  Users,
  Bath,
  Bed,
  Eye,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "@/lib/api.js";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/bookingUtils.js";

const AdminPropertyApprovalPage = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [rejectionModalOpen, setRejectionModalOpen] =
    useState(false);

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  /* ============================================
     FETCH ALL PROPERTIES FROM DATABASE
  ============================================ */

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);

    try {
      console.log(
        "[Admin Approval] Fetching all properties..."
      );

      const response = await api.get("/properties");

      console.log(
        "[Admin Approval] API Response:",
        response.data
      );

      /*
        Support different backend response formats:

        []
        { properties: [] }
        { data: [] }
      */

      let propertyList = [];

      if (Array.isArray(response.data)) {
        propertyList = response.data;
      } else if (
        Array.isArray(response.data?.properties)
      ) {
        propertyList = response.data.properties;
      } else if (
        Array.isArray(response.data?.data)
      ) {
        propertyList = response.data.data;
      }

      console.log(
        "[Admin Approval] Total properties:",
        propertyList.length
      );

      console.table(propertyList);

      setAllProperties(propertyList);

    } catch (error) {
      console.error(
        "[Admin Approval] Failed to load properties:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to load properties"
      );

      setAllProperties([]);

    } finally {
      setIsLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);


  /* ============================================
     FILTER ONLY PENDING PROPERTIES
  ============================================ */

  useEffect(() => {

    let filtered = allProperties.filter(
      (property) => {
        const status = String(
          property.status || "pending"
        ).toLowerCase();

        return status === "pending";
      }
    );

    if (search.trim()) {

      const searchText =
        search.toLowerCase().trim();

      filtered = filtered.filter(
        (property) =>
          property.title
            ?.toLowerCase()
            .includes(searchText) ||

          property.location
            ?.toLowerCase()
            .includes(searchText) ||

          property.propertyType
            ?.toLowerCase()
            .includes(searchText)
      );
    }

    console.log(
      "[Admin Approval] Pending properties:",
      filtered.length
    );

    setProperties(filtered);

  }, [allProperties, search]);


  /* ============================================
     APPROVE PROPERTY
  ============================================ */

  const handleApprove = async (property) => {

    const id =
      property._id ||
      property.id;

    if (!id) {
      toast.error("Property ID not found");
      return;
    }

    try {

      setActionLoading(true);

      console.log(
        "[Admin Approval] Approving property:",
        id
      );

      await api.patch(
        `/properties/${id}/status`,
        {
          status: "approved",
          rejectionReason: "",
        }
      );

      toast.success(
        "Property approved successfully"
      );

      await fetchProperties();

    } catch (error) {

      console.error(
        "[Admin Approval] Approval failed:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Approval failed"
      );

    } finally {

      setActionLoading(false);

    }
  };


  /* ============================================
     OPEN REJECTION MODAL
  ============================================ */

  const openRejectionModal = (
    property
  ) => {

    setSelectedProperty(property);

    setRejectionReason("");

    setRejectionModalOpen(true);

  };


  /* ============================================
     REJECT PROPERTY
  ============================================ */

  const handleReject = async () => {

    const id =
      selectedProperty?._id ||
      selectedProperty?.id;

    if (!id) {
      toast.error("Property ID not found");
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error(
        "Please provide a reason for rejection"
      );
      return;
    }

    try {

      setActionLoading(true);

      await api.patch(
        `/properties/${id}/status`,
        {
          status: "rejected",
          rejectionReason:
            rejectionReason.trim(),
        }
      );

      toast.success(
        "Property rejected successfully"
      );

      setRejectionModalOpen(false);

      setSelectedProperty(null);

      setRejectionReason("");

      await fetchProperties();

    } catch (error) {

      console.error(
        "[Admin Approval] Rejection failed:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Rejection failed"
      );

    } finally {

      setActionLoading(false);

    }
  };


  return (

    <div className="space-y-8 max-w-7xl mx-auto pb-12">

      <Helmet>
        <title>
          Property Approvals | Take On BnB Admin
        </title>
      </Helmet>


      {/* HEADER */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>

          <h1 className="text-3xl font-bold text-foreground">
            Property Approvals
          </h1>

          <p className="text-muted-foreground mt-1">
            Review and approve property listings submitted by hosts.
          </p>

          {!isLoading && (

            <p className="text-xs text-muted-foreground mt-2">

              Total Database Properties:
              {" "}
              <strong>
                {allProperties.length}
              </strong>

              {" • "}

              Pending Approval:
              {" "}

              <strong>
                {properties.length}
              </strong>

            </p>

          )}

        </div>


        <div className="flex gap-3 w-full sm:w-auto">

          <div className="relative flex-1 sm:w-72">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder="Search pending properties..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="pl-9 bg-card border-border h-11 rounded-xl shadow-sm"
            />

          </div>


          <Button
            variant="outline"
            size="icon"
            onClick={fetchProperties}
            disabled={isLoading}
            title="Refresh Properties"
          >

            <RefreshCw
              className={`w-4 h-4 ${
                isLoading
                  ? "animate-spin"
                  : ""
              }`}
            />

          </Button>

        </div>

      </div>


      {/* LOADING */}

      {isLoading ? (

        <div className="text-center py-12 text-muted-foreground">

          Loading properties from database...

        </div>


      ) : properties.length === 0 ? (

        <div className="text-center py-24 bg-card border border-border border-dashed rounded-3xl shadow-sm">

          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />

          <h3 className="text-xl font-bold text-foreground">

            No Pending Properties

          </h3>

          <p className="text-muted-foreground">

            Database has {allProperties.length} total properties,
            but none are currently pending approval.

          </p>

        </div>


      ) : (

        <div className="grid grid-cols-1 gap-6">

          {properties.map(
            (property) => {

              const id =
                property._id ||
                property.id;

              return (

                <Card
                  key={id}
                  className="bg-card border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >

                  <div className="flex flex-col md:flex-row">


                    {/* IMAGE */}

                    <div className="w-full md:w-72 h-48 md:h-auto bg-muted shrink-0 relative">

                      {property.photos?.length > 0 ? (

                        <img
                          src={property.photos[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">

                          No Image

                        </div>

                      )}


                      <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">

                        Awaiting Review

                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-6 flex-1 flex flex-col">

                      <div className="flex justify-between items-start mb-2 gap-4">

                        <div>

                          <h3 className="text-xl font-bold text-foreground line-clamp-1">

                            {property.title}

                          </h3>


                          <p className="text-sm text-muted-foreground flex items-center mt-1">

                            <MapPin className="w-4 h-4 mr-1 shrink-0 text-primary/70" />

                            {property.location || "Location not provided"}

                          </p>

                        </div>


                        <div className="text-right shrink-0">

                          <div className="text-lg font-extrabold text-primary">

                            {formatCurrency(
                              property.pricePerNight || 0
                            )}

                          </div>

                          <div className="text-xs text-muted-foreground">

                            per night

                          </div>

                        </div>

                      </div>


                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-foreground/80 mb-4 bg-muted/50 p-2.5 rounded-xl border border-border w-fit">

                        <span className="flex items-center">

                          <Bed className="w-4 h-4 mr-1.5" />

                          {property.bedrooms || 0} Bed

                        </span>


                        <span className="flex items-center">

                          <Bath className="w-4 h-4 mr-1.5" />

                          {property.bathrooms || 0} Bath

                        </span>


                        <span className="flex items-center">

                          <Users className="w-4 h-4 mr-1.5" />

                          {property.guestCapacity || 0} Guests

                        </span>


                        <span className="capitalize">

                          {property.propertyType || "Property"}

                        </span>

                      </div>


                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">

                        {property.description ||
                          "No description provided."}

                      </p>


                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-border">

                        <div className="text-sm">

                          <span className="text-muted-foreground">

                            Host:

                          </span>

                          <span className="font-bold text-foreground ml-2">

                            {property.hostId ||
                              property.host?._id ||
                              property.host?.name ||
                              "Unknown"}

                          </span>

                        </div>


                        <div className="flex items-center gap-2">

                          <Button
                            variant="outline"
                            className="h-10 px-4 rounded-xl"
                            asChild
                          >

                            <Link
                              to={`/property/${id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >

                              <Eye className="w-4 h-4 mr-2" />

                              View

                            </Link>

                          </Button>


                          <Button
                            variant="outline"
                            className="border-destructive/30 text-destructive hover:bg-destructive/10 h-10 px-5 rounded-xl"
                            onClick={() =>
                              openRejectionModal(
                                property
                              )
                            }
                            disabled={actionLoading}
                          >

                            <X className="w-4 h-4 mr-2" />

                            Reject

                          </Button>


                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white h-10 px-5 rounded-xl"
                            onClick={() =>
                              handleApprove(
                                property
                              )
                            }
                            disabled={actionLoading}
                          >

                            <Check className="w-4 h-4 mr-2" />

                            {actionLoading
                              ? "Processing..."
                              : "Approve"}

                          </Button>

                        </div>

                      </div>

                    </div>

                  </div>

                </Card>

              );

            }
          )}

        </div>

      )}


      {/* REJECTION MODAL */}

      <Dialog
        open={rejectionModalOpen}
        onOpenChange={setRejectionModalOpen}
      >

        <DialogContent className="sm:max-w-[500px]">

          <DialogHeader>

            <DialogTitle className="text-xl">

              Reject Listing

            </DialogTitle>

            <DialogDescription>

              Provide a reason for rejecting "
              {selectedProperty?.title}".

            </DialogDescription>

          </DialogHeader>


          <div className="my-4">

            <Textarea
              placeholder="Enter rejection reason..."
              className="min-h-[120px] resize-none"
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(
                  e.target.value
                )
              }
            />

          </div>


          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setRejectionModalOpen(false)
              }
              disabled={actionLoading}
            >

              Cancel

            </Button>


            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading}
            >

              {actionLoading
                ? "Processing..."
                : "Confirm Rejection"}

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>

  );
};

export default AdminPropertyApprovalPage;