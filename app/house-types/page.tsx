import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarouselHouseTypes } from "@/components/carousel-house-types"
import { CurvedHeader } from "@/components/curved-header"

export default function HouseTypesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Curved Header */}
      <CurvedHeader
        title="House Types"
        subtitle="Welcome to the TONMAG way of life"
        height="medium"
      />

      {/* Carousel Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <CarouselHouseTypes />
      </section>

      <Footer />
    </main>
  )
}
