"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function CountUp({ end, duration = 2000, suffix = "", prefix = "" }: CountUpProps) {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          const startTime = Date.now()

          const animateCount = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const currentCount = Math.floor(end * progress)
            setCount(currentCount)

            if (progress < 1) {
              requestAnimationFrame(animateCount)
            }
          }

          animateCount()
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration])

  return (
    <div ref={elementRef} className="text-4xl font-bold text-accent">
      {prefix}
      {count}
      {suffix}
    </div>
  )
}
