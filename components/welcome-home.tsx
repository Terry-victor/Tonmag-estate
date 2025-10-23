"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export function WelcomeHome() {
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      },
      { threshold: 0.1 },
    )

    if (imageRef.current) observer.observe(imageRef.current)
    if (textRef.current) observer.observe(textRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-16 text-amber-400">Welcome Home</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            ref={imageRef}
            className="opacity-0 translate-x-[-50px] transition-all duration-1000"
            style={{
              animation: "none",
            }}
          >
            <style>{`
              @keyframes slideInLeft {
                from {
                  opacity: 0;
                  transform: translateX(-50px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              .animate-in {
                animation: slideInLeft 0.8s ease-out forwards !important;
              }
            `}</style>
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/modern-luxury-apartment-building-with-yellow-accen.jpg"
                alt="Modern luxury apartment building"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div
            ref={textRef}
            className="opacity-0 translate-x-[50px] transition-all duration-1000"
            style={{
              animation: "none",
            }}
          >
            <style>{`
              @keyframes slideInRight {
                from {
                  opacity: 0;
                  transform: translateX(50px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              .animate-in-right {
                animation: slideInRight 0.8s ease-out forwards !important;
              }
            `}</style>
            <div className="animate-in-right">
              <p className="text-amber-400 text-sm font-semibold mb-4">About Us</p>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                We are Building the Future of Africa's Real Estate
              </h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                At Cosgrove, we don't just develop properties – we envision the future. As leaders in the real estate
                industry in Africa, we masterfully shape residential and commercial spaces that marry unparalleled
                luxury with cutting-edge technology.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our commitment to sustainability breathes life into each of our projects, creating environments that are
                as eco-conscious as they are exquisite. Here, we design the extraordinary. Here, we set the standard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
