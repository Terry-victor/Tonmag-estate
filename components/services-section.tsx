"use client"

import Image from "next/image"
import { PenTool, Zap, Hammer, LayoutGrid } from "lucide-react"

const services = [
  {
    icon: PenTool,
    title: "Consultation",
  },
  {
    icon: Zap,
    title: "Design & Automation",
  },
  {
    icon: Hammer,
    title: "Construction",
  },
  {
    icon: LayoutGrid,
    title: "Project Management",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-6 max-w-3xl">
          <h2 className="text-amber-500 text-lg font-medium">Our Services</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
            What we offer our clients
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Step into a world where your needs shape our services. Offering bespoke consultations, innovative design & automation, meticulous construction, and strategic project management, we make your journey seamless. Plus, unlock smart investment avenues for unparalleled ROI. With Cosgrove, it's more than a home—it's a lifetime investment.
          </p>
        </div>

        {/* Services Grid with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Services List */}
          <div className="space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-6 p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {service.title}
                  </h4>
                </div>
              )
            })}
          </div>

          {/* Image */}
          <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden">
            <Image
              src="worker.jpg"
              alt="Construction worker on building site"
              fill
              className="object-cover"
              priority
            />
            {/* Yellow accent stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
          </div>
        </div>
      </div>
    </section>
  )
}
