import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { StatisticsShowcase } from "@/components/statistics-showcase"
import { ServicesSection } from "@/components/services-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { Footer } from "@/components/footer"
import { EstateFeatures } from "@/components/estate-features"
import { PressFeatured } from "@/components/press-featured"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <StatisticsShowcase />
      <ServicesSection />
      <ProjectsShowcase />
      <EstateFeatures />
      <PressFeatured />
      <Footer />
    </main>
  )
}
