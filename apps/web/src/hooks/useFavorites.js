import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { toast } from "sonner";
import pb from "@/lib/pocketbaseClient";

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let cancelled = false;

    if (!currentUser?.id) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const records = await pb
          .collection("favorites")
          .getFullList({
            filter: `guestId = "${currentUser.id}"`,
            $autoCancel: false,
          });

        const safeRecords = Array.isArray(records)
          ? records
          : [];

        const favoriteIds = safeRecords
          .map((record) => record?.propertyId)
          .filter(Boolean);

        if (!cancelled) {
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);

        if (!cancelled) {
          setFavorites([]);
        }
      }
    };

    fetchFavorites();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);

  const toggleFavorite = useCallback(
    async (propertyId) => {
      if (!currentUser?.id || !propertyId) {
        toast.error("Please log in to save favorites");
        return false;
      }

      const safeFavorites = Array.isArray(favorites)
        ? favorites
        : [];

      const isFav = safeFavorites.includes(propertyId);

      try {
        if (isFav) {
          const record =
            await pb
              .collection("favorites")
              .getFirstListItem(
                `guestId="${currentUser.id}" && propertyId="${propertyId}"`,
                { $autoCancel: false }
              );

          if (record?.id) {
            await pb
              .collection("favorites")
              .delete(record.id, {
                $autoCancel: false,
              });
          }

          setFavorites((prev) =>
            Array.isArray(prev)
              ? prev.filter((id) => id !== propertyId)
              : []
          );

          toast.success("Removed from favorites");
          return false;
        }

        await pb.collection("favorites").create(
          {
            guestId: currentUser.id,
            propertyId,
          },
          { $autoCancel: false }
        );

        setFavorites((prev) => {
          const current = Array.isArray(prev)
            ? prev
            : [];

          return current.includes(propertyId)
            ? current
            : [...current, propertyId];
        });

        toast.success("Saved to favorites");
        return true;
      } catch (error) {
        console.error(
          "Error toggling favorite:",
          error
        );

        toast.error(
          "Failed to update favorites"
        );

        return isFav;
      }
    },
    [currentUser?.id, favorites]
  );

  return {
    favorites: Array.isArray(favorites)
      ? favorites
      : [],
    toggleFavorite,
  };
}
