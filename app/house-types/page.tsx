import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CarouselHouseTypes } from "@/components/carousel-house-types";
import { CurvedHeader } from "@/components/curved-header";

export default function HouseTypesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Curved Header */}
      <CurvedHeader
        title="House Types"
        subtitle="Welcome to the TONMAG way of life"
        height="medium"
        backgroundImage="M1.jpg"
      />
      {/* The TONMAG Way Section with Video Background */}
      <section className="py-16 bg-background relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="oport estate_1.mp4" type="video/mp4" />
        </video>

        {/* Carousel Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-background">
          <CarouselHouseTypes />
        </section>
      </section>
      <Footer />
    </main>
  );
}
