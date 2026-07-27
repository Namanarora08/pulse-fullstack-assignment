"use client";

import { motion } from "framer-motion";

type AnimatedPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedPanel({ children, className }: AnimatedPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
