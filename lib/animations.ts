import type { Variants } from "framer-motion"

const easeOut = [0.22, 1, 0.36, 1] as const

export const heroEntrance: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -45 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

export const floatingAnimation = {
  y: [0, -20, 0],
  transition: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" as const },
}

export const floatingText = {
  opacity: [0.25, 1, 0.25],
  transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" as const },
}

export const cardHover = { y: -8, transition: { duration: 0.25, ease: easeOut } }
export const iconHover = { scale: 1.1, rotate: 2, transition: { duration: 0.25, ease: easeOut } }

export const viewportOnce = { once: true, amount: 0.16 } as const
