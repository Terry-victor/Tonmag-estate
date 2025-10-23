"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Award,
  Shield,
  CheckCircle,
  FileText,
  Lock,
  Zap,
  TrendingUp,
  Users,
  Download,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

export default function CredibilityLegalPage() {
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null)

  const certifications = [
    {
      icon: Award,
      title: "ISO 9001:2015",
      description: "Quality Management System Certified",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Real Estate Board Member",
      description: "Registered with National Real Estate Board",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: CheckCircle,
      title: "Tax Compliant",
      description: "Fully registered and tax compliant with all authorities",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Lock,
      title: "Licensed Developer",
      description: "Licensed by State Urban Development Board",
      color: "from-amber-500 to-orange-500",
    },
  ]

  const documents = [
    {
      title: "Terms of Service",
      description: "Our terms and conditions for all services",
      icon: FileText,
    },
    {
      title: "Privacy Policy",
      description: "How we protect your personal information",
      icon: Lock,
    },
    {
      title: "Investment Agreement",
      description: "Standard investment contract template",
      icon: CheckCircle,
    },
    {
      title: "Property Purchase Agreement",
      description: "Standard property purchase terms",
      icon: FileText,
    },
  ]

  const complianceItems = [
    {
      icon: TrendingUp,
      title: "Regulatory Compliance",
      description:
        "Cosgrove Africa operates in full compliance with all federal, state, and local regulations governing real estate development and investment in Nigeria and across Africa.",
    },
    {
      icon: Users,
      title: "Financial Transparency",
      description:
        "We maintain transparent financial records and provide regular audited statements to all stakeholders. All investment funds are held in escrow accounts with licensed financial institutions.",
    },
    {
      icon: Shield,
      title: "Customer Protection",
      description:
        "All properties are insured, and customer funds are protected through our comprehensive insurance and guarantee programs. We maintain a dedicated customer protection fund.",
    },
    {
      icon: Zap,
      title: "Dispute Resolution",
      description:
        "Any disputes are handled through our professional dispute resolution process, with options for mediation and arbitration in accordance with international standards.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">Credibility & Legal</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparency and trust are the foundation of our business
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Our Certifications & Licenses</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Recognized and certified by leading industry bodies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon
              return (
                <div key={index} className="group transform transition-all duration-500 hover:scale-105">
                  <Card className="h-full overflow-hidden backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl">
                    <div className={`bg-gradient-to-br ${cert.color} p-6 sm:p-8 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                      <Icon className="w-10 h-10 sm:w-12 sm:h-12 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6 sm:p-8">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{cert.description}</p>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Legal Documents</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Download our official documents and agreements</p>
          </div>

          <div className="space-y-4">
            {documents.map((doc, idx) => {
              const Icon = doc.icon
              return (
                <div key={idx} className="group">
                  <Card className="overflow-hidden backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === idx ? null : idx)}
                      className="w-full px-6 sm:px-8 py-4 sm:py-6 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold group-hover:text-accent transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{doc.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Download className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ChevronRight
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                            expandedDoc === idx ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {expandedDoc === idx && (
                      <div className="px-6 sm:px-8 py-4 sm:py-6 bg-muted/50 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-muted-foreground text-sm sm:text-base mb-4">
                          This document contains important legal information. Please read carefully before proceeding.
                        </p>
                        <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compliance Info */}
      <section className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Compliance & Transparency</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Our commitment to regulatory excellence and customer protection
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {complianceItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="group transform transition-all duration-500 hover:scale-105">
                  <Card className="h-full overflow-hidden backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl p-6 sm:p-8">
                    <div className="flex gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-accent group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </Card>
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
