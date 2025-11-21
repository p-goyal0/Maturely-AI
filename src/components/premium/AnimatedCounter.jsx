import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export function AnimatedCounter({ from, to, duration = 2, suffix = "", prefix = "", format }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(from + (to - from) * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
    >
      {prefix}
      {format ? format(count) : count}
      {suffix}
    </motion.div>
  );
}
