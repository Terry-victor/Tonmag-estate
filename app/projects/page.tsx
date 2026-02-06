import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarouselProjects, ProjectsList } from "@/components/carousel-projects"

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-muted-foreground">Our Homes</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
              Smart Homes, Smarter Investments
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our portfolio of exceptional properties across Africa
            </p>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        {/* <CarouselProjects /> */}

        < ProjectsList />
      </section>

      <Footer />
    </main>
  )
}
