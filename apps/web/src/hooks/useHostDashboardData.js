import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { buildApiUrl } from "@/lib/api.js";

export const useHostDashboardData = () => {
  const { currentUser } = useAuth();

  const hostId = currentUser?.id;

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const earnings = bookings
    .filter(
      (b) =>
        b.status === "completed" ||
        b.status === "confirmed"
    )
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

        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${buildApiUrl('/api/dashboard')}?hostId=${hostId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setProperties(data.properties || []);
        setBookings(data.bookings || []);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
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