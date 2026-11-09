import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { CurvedHeader } from "@/components/curved-header"

export default function ContactPage() {
  return <main className="min-h-screen bg-background">
    <Header />
    <CurvedHeader title="Contact" subtitle="Contact us" height="medium" backgroundImage="M6.jpg" />
    <ContactForm />
    <Footer />
  </main>
}
