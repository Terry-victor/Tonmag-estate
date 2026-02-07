import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Award, Users, Building2, Leaf, Users2, Trophy } from "lucide-react"
import { CountUp } from "@/components/count-up"
import { CurvedHeader } from "@/components/curved-header"

export default function AboutPage() {
  const values = [
    {
      icon: Building2,
      title: "Quality Construction",
      description: "We build with the highest standards of quality and durability",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your satisfaction is our top priority in every project",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Eco-friendly designs that respect the environment",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Award-winning designs and innovative solutions",
    },
  ]

  const teamMembers = [
    {
      name: "Umar Abdullahi, OFR.",
      role: "Chairman/Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      bio: "The TONMAG founder, Umar comes with over 2 decades varied experience in Real estate, infrastructure and technology. Notably, Umar served as the pioneer Managing Director of Brains & Hammers Ltd. for 8 years.\n\nHe directed the foundations for the company's success; and spearheaded the conceptualization, development, construction, and management of a myriad of housing estates and gated communities. He is specially adept at managing complex projects and diverse teams.\n\nUmar also brings extensive experience from his corporate banking background as well as expertise in negotiations with a commitment to compliance with corporate governance and fiscal discipline. An astute leader whose vision is achieving TONMAG strategic business goals.\n\nHis variegated International Executive Leadership training programs equip him for his new role to steer the company to achieve its long-term vision.\n\nUmar is a graduate of Bayero University, Kano and an alumnus of Cranfield University, UK and attends the Harvard Business School Executive Programs.",
    },
    {
      name: "Elizabeth Taylor",
      role: "Chief Operating Officer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
      bio: "Liz, an Arch Bishop Tutu Fellow of the African Leadership Institute is a business strategist with proven strength tactically executing strategy and delivering on organizational goals. She believes in the combined role of people driven tactics and systems in delivering excellence to all stakeholders.\n\nAfter a multidisciplinary role spanning nearly 16 years, Liz knows what truly drives business process, customer engagement, and strategy. Her strengths include knowledge management, business management, people management, customer relationship management and more.\n\nLiz is an accomplished people developer and trainer with a unique method for creating high performing teams. She is an alumnus of the Said Business School Leadership program (with African Leadership Institute) and Wharton Business School Real Estate program on Housing Finance & Securitization.\n\nIn addition to her extensive multidisciplinary experience, Liz is also a certified customer service strategist and coach; she is also a published author.\n\nLiz is a Business Administration graduate of University of Abuja, with an MSc in Knowledge Management from the Aberdeen Business School.",
    },
    {
      name: "Engr. Baba Kalli",
      role: "Chief Technical Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
      bio: "A graduate of Civil and Water Resources Engineering from the University of Maiduguri, Engr. B. Kalli brings over 20 years of experience in the construction and real estate industry. His expertise spans project management, infrastructure development, and technical oversight of large-scale residential and commercial projects.",
    },
  ]

  const stats = [
    { number: "1,000+", label: "Homes Built", icon: Building2 },
    { number: "10+", label: "Projects", icon: Award },
    { number: "30+", label: "Awards", icon: Trophy },
    { number: "1,000+", label: "Global Clients", icon: Users2 },
  ]

  return (
    <main className="min-h-screen">
      <Header />

      {/* Curved Header */}
      <CurvedHeader
        title="About TONMAG"
        subtitle="Leading Excellence in Real Estate"
        height="medium"
      />

      {/* The TONMAG Way Section with Video Background */}
      <section className="py-16 bg-background relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6">The TONMAG Way</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Established in 2017, TONMAG is at the forefront of disruption in the real estate industry, shaping new
                lifestyles with a focus on the integration of revolutionary technology into residential and commercial
                real estate using sustainable methods.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                TONMAG's leadership team is composed of the industry's highly experienced leaders with a passion for
                unswerving excellence. As we continue to grow our vision of becoming the leading real estate developer
                in Africa, the guarantee of integrity, professionalism and reliability remains equal to the best
                obtainable anywhere in the world.
              </p>
            </div>
            <div className="bg-primary/10 rounded-lg h-96 backdrop-blur-sm" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground">
                Constantly transforms urban living in Africa, blending innovative design with advanced technology, while
                steadfastly prioritising quality, sustainability, and visionary real estate solutions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-muted-foreground">
                Become the gold-standard in next-generation living across Africa. We envision a future where every
                TONMAG residence defines the benchmark for luxury, technology, and sustainability, offering homeowners
                the pinnacle of modern living.
              </p>
            </div>
          </div>

          {/* Stats Section with Animations */}
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const numberStr = stat.number.replace(/\D/g, "")
              const numberValue = parseInt(numberStr)
              const suffix = stat.number.includes("+") ? "+" : ""
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <CountUp end={numberValue} duration={2500} suffix={suffix} />
                  <p className="text-muted-foreground mt-2">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-accent font-semibold mb-2">The Core Team</p>
            <h2 className="text-5xl font-bold mb-8">Meet the Minds Behind TONMAG</h2>
          </div>

          {/* Team Members */}
          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
              >
                <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                <div className={index % 2 === 1 ? "md:col-start-1" : ""}>
                  <p className="text-accent font-semibold mb-2">{member.role}</p>
                  <h3 className="text-4xl font-bold mb-6">{member.name}</h3>
                  <div className="space-y-4 text-muted-foreground">
                    {member.bio.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-base leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-muted/50 rounded-lg p-6 text-center">
                  <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
