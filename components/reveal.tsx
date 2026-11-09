"use client"

import { motion } from "framer-motion"
import { fadeUp, viewportOnce } from "@/lib/animations"

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay: delay / 1000 }} className={className}>{children}</motion.div>
}
