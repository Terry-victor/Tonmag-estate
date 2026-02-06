"use client"

import { Card } from "@/components/ui/card"
import { Award, Users, Building2, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

const stats = [
  {
    icon: Building2,
    number: 500,
    label: "Properties Delivered",
    suffix: "+",
  },
  {
    icon: Users,
    number: 10000,
    label: "Happy Clients",
    suffix: "+",
  },
  {
    icon: Award,
    number: 25,
    label: "Industry Awards",
    suffix: "+",
  },
  {
    icon: TrendingUp,
    number: 15,
    label: "Industry Experience",
    suffix: " Yrs",
  },
]

function CountUpNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
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
  }, [target])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function About() {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-card overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      >
        <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>About Cosgrove</h2>
              <p className="text-lg text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 400 }}>
                We are pioneers in luxury real estate development, committed to creating exceptional living spaces that
                blend innovation, sustainability, and timeless elegance.
              </p>
              <p className="text-lg text-muted-foreground" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 400 }}>
                With over 15 years of industry experience, we've established ourselves as leaders in delivering premium
                properties that exceed expectations and create lasting value for our clients.
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <p className="text-foreground">Award-winning architectural designs</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <p className="text-foreground">Sustainable and eco-friendly practices</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <p className="text-foreground">Transparent and client-focused approach</p>
              </div>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary mb-1">
                    <CountUpNumber target={stat.number} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
