import { useState, useEffect } from "react";
import api from "@/lib/api.js";
import { useAuth } from "@/contexts/AuthContext.jsx";

export const useHostDashboardData = () => {
  const { currentUser } = useAuth();

  const hostId = currentUser?.id;

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const earnings = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const totalBookings = bookings.length;

  const occupancyRate =
    properties.length === 0
      ? 0
      : Math.round((bookings.length / properties.length) * 100);

  useEffect(() => {
    if (!hostId) return;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/dashboard", {
          params: { hostId },
        });

        setProperties(data.properties || []);
        setBookings(data.bookings || []);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [hostId]);

  return {
    properties,
    bookings,
    reviews,
    metrics: {
      earnings,
      totalBookings,
      occupancyRate,
      averageRating: 0,
    },
    loading,
    error,
  };
};
