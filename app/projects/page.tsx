import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectsList } from "@/components/carousel-projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-[58svh] overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[url('/M4.JPG')] bg-cover bg-center opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071924] via-[#071924]/65 to-transparent" />
        <div className="relative mx-auto flex min-h-[58svh] max-w-[1440px] items-end px-5 py-14 sm:px-8 lg:py-20">
          <div className="max-w-3xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#e4bd79]">TONMAG collections</p><h1 className="font-serif text-6xl leading-[0.88] sm:text-8xl">Built for how you want to live.</h1><p className="mt-6 max-w-xl text-base leading-7 text-white/72">Title-verified residences in Nigeria&apos;s most considered neighbourhoods, with a clear path from discovery to ownership.</p></div>
        </div>
      </section>
      <section className="w-full overflow-x-clip bg-[#eee8dc] py-8 lg:py-12 dark:bg-background">
        <div className="w-full overflow-hidden bg-card">
          <ProjectsList />
          <ProjectsList filter="lagos" eyebrow="Lagos collections" title="Waterfront and city addresses." />
          <ProjectsList filter="premium" eyebrow="Signature tier" title="Our most exceptional homes." />
        </div>
      </section>
      <Footer />
    </main>
  );
}
