import React from "react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function PremiumHero({ badge, title, subtitle, cta, secondaryCta, accentColor = "blue" }) {
  const colorMap = {
    blue: "from-blue-500 to-cyan-400",
    purple: "from-purple-500 to-pink-400",
    cyan: "from-cyan-500 to-blue-400",
    teal: "from-teal-500 to-cyan-500",
    emerald: "from-emerald-500 to-teal-400",
    amber: "from-amber-500 to-orange-400",
    indigo: "from-indigo-500 to-purple-400",
  };

  const gradientClass = colorMap[accentColor] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto text-center relative z-10"
    >
      {badge && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2 backdrop-blur-sm">{badge}</Badge>
        </motion.div>
      )}

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight font-bold">
        {title}
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
        {subtitle}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {cta && (
          <Button size="lg" onClick={cta.onClick} className={`h-14 px-8 text-lg bg-gradient-to-r ${gradientClass} hover:opacity-90 glow-primary`}>
            {cta.label}
          </Button>
        )}
        {secondaryCta && (
          <Button size="lg" variant="outline" onClick={secondaryCta.onClick} className="h-14 px-8 text-lg border-white/20 hover:bg-white/5">
            {secondaryCta.label}
          </Button>
        )}
      </motion.div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute -bottom-20 left-1/4 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
    </motion.div>
  );
}
