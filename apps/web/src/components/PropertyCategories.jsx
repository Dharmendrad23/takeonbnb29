import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Building,
  Tent,
  Tractor,
  Ship,
  Trees,
  Building2,
  Palmtree,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api.js";

const categoryConfig = [
  { name: "Villas", icon: Home, types: ["villa", "villas"] },
  { name: "Apartments", icon: Building, types: ["apartment", "apartments"] },
  { name: "Cabins", icon: Tent, types: ["cabin", "cabins"] },
  {
    name: "Farm Houses",
    icon: Tractor,
    types: ["farm house", "farmhouse", "farm houses"],
  },
  { name: "Houseboats", icon: Ship, types: ["houseboat", "houseboats"] },
  { name: "Treehouses", icon: Trees, types: ["treehouse", "treehouses"] },
  { name: "Penthouses", icon: Building2, types: ["penthouse", "penthouses"] },
  { name: "Cottages", icon: Palmtree, types: ["cottage", "cottages"] },
];

const PropertyCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(
    categoryConfig.map((category) => ({
      ...category,
      count: 0,
    }))
  );

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await api.get("/properties");

        const approvedProperties = (data || []).filter(
          (property) =>
            !property.status ||
            property.status.toLowerCase() === "approved"
        );

        const updatedCategories = categoryConfig.map((category) => {
          const count = approvedProperties.filter((property) => {
            const propertyType = (
              property.propertyType || ""
            ).toLowerCase().trim();

            return category.types.includes(propertyType);
          }).length;

          return {
            ...category,
            count,
          };
        });

        setCategories(updatedCategories);
      } catch (error) {
        console.error("Failed to load property categories:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(
      `/search?propertyType=${encodeURIComponent(
        category.types[0]
      )}`
    );
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="relative inline-block pb-2">
            Browse by Category

            <span className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-primary rounded-full"></span>
          </h2>

          <p className="mt-4 text-muted-foreground">
            Explore stays that match your travel style
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.button
                type="button"
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card hover:bg-primary group cursor-pointer border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 bg-muted group-hover:bg-white/20 rounded-full transition-colors">
                  <Icon
                    className="w-8 h-8 text-foreground group-hover:text-white transition-colors"
                    strokeWidth={1.5}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-sm group-hover:text-white transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-xs text-muted-foreground group-hover:text-white/80 transition-colors mt-1">
                    {category.count}{" "}
                    {category.count === 1 ? "Property" : "Properties"}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;