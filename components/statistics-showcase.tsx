"use client"

import { useEffect, useState } from "react"
import { Building2, Building, Award, Users, Headphones, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <div className="max-w-7xl mx-auto space-y-20">
        {/* About Us Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h2 className="text-amber-500 text-lg font-medium">About Us</h2>
            <h3 className="text-4xl md:text-6xl font-bold text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
              We are Building the Future
              <br />
              of Africa's Real Estate
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-cormorant)' }}>
              At Cosgrove, we don't just develop properties – we envision the future. As leaders in the real estate industry in Africa, we masterfully shape residential and commercial spaces that marry unparalleled luxury with cutting-edge technology.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Our commitment to sustainability breathes life into each of our projects, creating environments that are as eco-conscious as they are exquisite. Here, we design the extraordinary. Here, we set the standard.
            </p>
          </div>
        </div>

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

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Talk To Us */}
          <div className="flex flex-col items-center text-center space-y-6 p-8 rounded-lg bg-muted/30">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Headphones className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
                Talk To Us
              </h4>
              <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Get started with Cosgrove by speaking to one of our experts.
              </p>
            </div>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6 text-base">
              Let's Talk
            </Button>
          </div>

          {/* Project Brochures */}
          <div className="flex flex-col items-center text-center space-y-6 p-8 rounded-lg bg-muted/30">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
                Project Brochures
              </h4>
              <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Explore our catalog through our collection of brochures.
              </p>
            </div>
            <Button className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-6 text-base">
              Download Brochures
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
