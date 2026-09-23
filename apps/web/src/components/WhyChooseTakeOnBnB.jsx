import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  Headphones,
  Lock,
  Plane,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Verified Hosts",
    description:
      "Every host and property undergoes a strict vetting process to ensure your safety and comfort.",
    icon: ShieldCheck,
    label: "STAY WITH CONFIDENCE",
  },
  {
    title: "Best Price Guarantee",
    description:
      "We match any lower price found online so you always get the best deal for your stay.",
    icon: TrendingUp,
    label: "ALWAYS THE BEST DEAL",
  },
  {
    title: "24/7 Support",
    description:
      "Our global concierge team is available around the clock to assist you before, during, and after your trip.",
    icon: Headphones,
    label: "WE'RE ALWAYS HERE",
  },
  {
    title: "Secure Payments",
    description:
      "Industry-leading encryption keeps your payment details and personal information completely safe.",
    icon: Lock,
    label: "YOUR DATA, OUR PRIORITY",
  },
];

const WhyChooseTakeOnBnB = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#fffaf2] py-20 sm:py-24 lg:py-28">

      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Saffron glow */}
        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#d88900]/10 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full bg-[#f59e0b]/10 blur-3xl"
        />

        {/* Small decorative dots */}
        <div className="absolute left-[5%] top-[22%] grid grid-cols-4 gap-2 opacity-30">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#d88900]"
            />
          ))}
        </div>

        <div className="absolute right-[5%] bottom-[20%] grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#d88900]"
            />
          ))}
        </div>

        {/* Floating plane */}
        <motion.div
          animate={{
            x: [0, 90, 180, 90, 0],
            y: [0, -20, -5, -25, 0],
            rotate: [-4, 5, 8, 3, -4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-16 hidden sm:block"
        >
          <div className="relative">
            <div className="absolute -left-20 top-7 h-px w-24 border-t-2 border-dashed border-[#d88900]/40" />
            <Plane className="h-10 w-10 rotate-[-18deg] text-[#d88900]" />
          </div>
        </motion.div>

        {/* Floating travel bubble */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[8%] top-20 hidden sm:block"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d88900]/30 bg-[#d88900]/10 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-7 w-7 text-[#d88900]" />
          </div>
        </motion.div>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#d88900]/10 to-transparent" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#d88900]/25 bg-white px-4 py-2 shadow-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d88900]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d88900] sm:text-xs">
              Your Trusted Travel Partner
            </span>

            <Sparkles className="h-3.5 w-3.5 text-[#d88900]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-4xl font-extrabold tracking-tight text-[#171717] sm:text-5xl lg:text-6xl"
          >
            Why Choose{" "}
            <span className="relative inline-block text-[#d88900]">
              Take on BnB

              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full bg-[#d88900]"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg"
          >
            We set the standard for luxury travel with uncompromising quality
            and service.
          </motion.p>
        </div>

        {/* ================= FEATURE CARDS ================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.25 },
                }}
                className="group relative overflow-hidden rounded-3xl border border-[#eadfce] bg-white p-7 shadow-[0_10px_35px_rgba(80,45,0,0.07)] transition-shadow duration-300 hover:border-[#d88900]/50 hover:shadow-[0_18px_45px_rgba(216,137,0,0.16)] sm:p-8"
              >

                {/* Card glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#d88900]/10 blur-2xl transition-all duration-500 group-hover:bg-[#d88900]/20" />

                {/* Icon */}
                <motion.div
                  whileHover={{
                    rotate: [0, -5, 5, 0],
                    scale: 1.08,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d88900]/10 text-[#d88900]"
                >
                  <Icon className="h-7 w-7" strokeWidth={2} />

                  <span className="absolute inset-0 rounded-2xl border border-[#d88900]/20" />
                </motion.div>

                {/* Title */}
                <h3 className="relative text-xl font-bold leading-tight text-[#171717]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="relative mt-4 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>

                {/* Bottom */}
                <div className="relative mt-7 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">

                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#d88900]">
                    {feature.label}
                  </span>

                  <motion.div
                    whileHover={{ scale: 1.12, rotate: -8 }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d88900] text-white shadow-md"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Animated saffron line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.25 + index * 0.1,
                  }}
                  className="absolute bottom-0 left-0 h-1 w-full origin-left bg-[#d88900]"
                />
              </motion.article>
            );
          })}
        </div>

        {/* Bottom travel line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mx-auto mt-14 flex max-w-xl items-center justify-center gap-3"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d88900]/40" />

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d88900]/10">
            <Plane className="h-4 w-4 rotate-[-15deg] text-[#d88900]" />
          </div>

          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d88900]/40" />
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseTakeOnBnB;
