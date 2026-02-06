"use client"

import { useEffect, useState } from "react"
import { Building2, Building, Award, Users } from "lucide-react"

interface StatItem {
  icon: React.ComponentType<{ className?: string }>
  number: number
  suffix: string
  label: string
}

const stats: StatItem[] = [
  {
    icon: Building2,
    number: 1000,
    suffix: "+",
    label: "Homes Built",
  },
  {
    icon: Building,
    number: 10,
    suffix: "+",
    label: "Projects",
  },
  {
    icon: Award,
    number: 30,
    suffix: "+",
    label: "Awards",
  },
  {
    icon: Users,
    number: 1000,
    suffix: "+",
    label: "Global Clients",
  },
]

function CountUpNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(`stat-number-${target}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [target, isVisible])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const increment = target / 60

    const interval = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(start))
      }
    }, 30)

    return () => clearInterval(interval)
  }, [target, isVisible])

  return (
    <span id={`stat-number-${target}`}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatisticsShowcase() {
  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Grid Layout for Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Number with Count Animation */}
                <div className="text-5xl md:text-6xl font-bold text-primary" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <CountUpNumber target={stat.number} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="text-base md:text-lg text-foreground font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
