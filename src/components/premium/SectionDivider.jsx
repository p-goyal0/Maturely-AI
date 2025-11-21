import React from "react";
import { motion } from "motion/react";

export function SectionDivider({ gradient = "from-blue-500 via-cyan-400 to-purple-500", animated = true }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className={`h-0.5 bg-gradient-to-r ${gradient} opacity-30 ${animated ? "animate-pulse" : ""}`}
    />
  );
}
