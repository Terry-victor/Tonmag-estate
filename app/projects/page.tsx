import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarouselProjects, ProjectsList } from "@/components/carousel-projects"
import { CurvedHeader } from "@/components/curved-header"

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Curved Header */}
      <CurvedHeader
        title="Smart Homes, Smarter Investments"
        subtitle="Our Homes"
        height="medium"
      />

      {/* Carousel Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        {/* <CarouselProjects /> */}

        < ProjectsList />
      </section>

      <Footer />
    </main>
  )
}
