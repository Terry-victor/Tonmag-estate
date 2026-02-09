import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectsList } from "@/components/carousel-projects";
import { CurvedHeader } from "@/components/curved-header";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Curved Header */}
      <CurvedHeader
        title="Smart Homes, Smarter Investments"
        subtitle="Our Homes"
        height="medium"
        backgroundImage="M4.jpg"
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
          {/* <CarouselProjects /> */}

          <ProjectsList />
        </section>
      </section>
      <Footer />
    </main>
  );
}
