import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarouselHouseTypes } from "@/components/carousel-house-types"

export default function HouseTypesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Video Background */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        >
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-muted-foreground">Welcome to the TONMAG way of life.</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">House Types</h1>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <CarouselHouseTypes />
      </section>

      <Footer />
    </main>
  )
}
