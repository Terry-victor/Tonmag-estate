"use client"

import { Card } from "@/components/ui/card"
import { Home, Shield, Zap, Leaf } from "lucide-react"

const features = [
  {
    icon: Home,
    title: "Smart Homes",
    description: "Cutting-edge automation technology integrated into every unit for modern living",
  },
  {
    icon: Shield,
    title: "Security",
    description: "24/7 surveillance and advanced security systems for complete peace of mind",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "State-of-the-art infrastructure and sustainable building practices",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Eco-friendly design with green spaces and energy-efficient systems",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Expertise</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine innovation with luxury to create exceptional living spaces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
