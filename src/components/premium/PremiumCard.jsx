import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { cn } from "../ui/utils";

export function PremiumCard({
  icon,
  title,
  description,
  children,
  gradient,
  glowColor = "glow-primary",
  interactive = false,
  onClick,
  className,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={interactive ? { scale: 1.02 } : undefined}
    >
      <Card
        className={cn(
          "glass-light border-white/10 h-full transition-all duration-500",
          interactive && "card-hover cursor-pointer",
          glowColor,
          className
        )}
        onClick={onClick}
      >
        <CardHeader>
          {icon && (
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform",
                gradient,
                interactive && "group-hover:scale-110"
              )}
            >
              {icon}
            </div>
          )}
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && (
            <CardDescription className="text-base leading-relaxed">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {children && <CardContent>{children}</CardContent>}
      </Card>
    </motion.div>
  );
}
