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
  Eye,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CurvedHeader } from "@/components/curved-header";
import { motion } from "framer-motion"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function CredibilityLegalPage() {
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null)
  const [previewDoc, setPreviewDoc] = useState<number | null>(null)

  const certifications = [
    {
      title: "ISO 9001:2015",
      description: "Quality Management System Certified",
      badgeImage: "/M1.JPG",
    },
    {
      title: "Real Estate Board Member",
      description: "Registered with National Real Estate Board",
      badgeImage: "/M2.JPG",
    },
    {
      title: "Tax Compliant",
      description: "Fully registered and tax compliant with all authorities",
      badgeImage: "/M4.JPG",
    },
    {
      title: "Licensed Developer",
      description: "Licensed by State Urban Development Board",
      badgeImage: "/M6.JPG",
    },
  ]

  const documents = [
    {
      title: "Terms of Service",
      description: "Our terms and conditions for all services",
      icon: FileText,
      url: process.env.NEXT_PUBLIC_TERMS_PDF_URL || "",
    },
    {
      title: "Privacy Policy",
      description: "How we protect your personal information",
      icon: Lock,
      url: process.env.NEXT_PUBLIC_PRIVACY_PDF_URL || "",
    },
    {
      title: "Investment Agreement",
      description: "Standard investment contract template",
      icon: CheckCircle,
      url: process.env.NEXT_PUBLIC_INVESTMENT_AGREEMENT_PDF_URL || "",
    },
    {
      title: "Property Purchase Agreement",
      description: "Standard property purchase terms",
      icon: FileText,
      url: process.env.NEXT_PUBLIC_PURCHASE_AGREEMENT_PDF_URL || "",
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
      {/* Curved Header */}
      <CurvedHeader
        title="Credibility & Legal"
        subtitle="Grow your wealth with our proven real estate investment opportunities"
        height="medium"
        backgroundImage="M6.jpg"
      />

      {/* The TONMAG Way Section with Video Background */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/NICE.JPG')] bg-cover bg-center opacity-10" aria-hidden="true" />

        {/* Hero Section with Video Background */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
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
            <div className="text-center space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
                Credibility & Legal
              </h1>
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Our Certifications & Licenses
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Recognized and certified by leading industry bodies
              </p>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert, index) => {
                return (
                  <motion.div variants={fadeUp}
                    key={index}
                    className="group transform transition-all duration-500 hover:scale-105"
                  >
                    <Card className="h-full overflow-hidden backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 text-white relative overflow-hidden h-32 flex items-center justify-center">
                        <Image
                          src={cert.badgeImage}
                          alt={cert.title}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {cert.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {cert.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Legal Documents */}
        <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Legal Documents
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Download our official documents and agreements
              </p>
            </div>

            <div className="space-y-4">
              {documents.map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <div key={idx} className="group">
                    <Card className="overflow-hidden backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                      <button
                        onClick={() =>
                          setExpandedDoc(expandedDoc === idx ? null : idx)
                        }
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
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              {doc.description}
                            </p>
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
                            This document contains important legal information.
                            Please read carefully before proceeding.
                          </p>
                          <div className="flex flex-col gap-2 sm:flex-row"><Button variant="outline" onClick={() => setPreviewDoc(idx)} className="w-full sm:w-auto"><Eye className="mr-2 size-4" />View</Button><Button asChild={Boolean(doc.url)} disabled={!doc.url} className="w-full bg-accent text-white hover:bg-accent/90 sm:w-auto">
                            {doc.url ? <a href={doc.url} download><Download className="mr-2 size-4" />Download PDF</a> : <span><Download className="mr-2 size-4" />PDF pending</span>}
                          </Button></div>
                        </div>
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compliance Info */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Compliance & Transparency
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Our commitment to regulatory excellence and customer protection
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {complianceItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="group transform transition-all duration-500 hover:scale-105"
                  >
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
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </section>

      <Dialog open={previewDoc !== null} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-h-[90dvh] max-w-4xl overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl">{previewDoc !== null ? documents[previewDoc].title : "Document preview"}</DialogTitle>
            <DialogDescription>{previewDoc !== null ? documents[previewDoc].description : ""}</DialogDescription>
          </DialogHeader>
          {previewDoc !== null && documents[previewDoc].url ? <iframe title={`${documents[previewDoc].title} preview`} src={documents[previewDoc].url} className="h-[65dvh] w-full rounded-xl border border-border" /> : <div className="grid min-h-64 place-items-center rounded-xl bg-muted p-8 text-center text-sm text-muted-foreground">The official PDF URL has not been configured yet. The document can be previewed here as soon as its Firebase CDN URL is added.</div>}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
