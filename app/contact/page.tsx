import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Phone, Mail, MapPin } from "lucide-react"
import { CurvedHeader } from "@/components/curved-header";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+234 (0) 123 456 7890",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@cosgroveafrica.com",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Luxury Avenue, Lagos, Nigeria",
    },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      {/* Curved Header */}
      <CurvedHeader
        title="Contact"
        subtitle="contact us"
        height="medium"
        backgroundImage="M6.jpg"
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

        {/* Hero Section with Video Background */}
        <section className="relative py-20 bg-linear-to-b from-primary/10 to-background overflow-hidden">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          >
            <source
              src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-6">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get in touch with our team for inquiries and support
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 mb-16 items-stretch">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="group bg-muted/50 rounded-xl p-6 text-center border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-start"
                    >
                      <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">
                        {info.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto bg-muted/30 rounded-2xl p-8 border border-border">
              <ContactForm />
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}
