"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Zap, Award, DollarSign, Clock } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function InvestmentPlansPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const plans = [
    {
      name: "Starter Plan",
      minInvestment: "₦5M",
      expectedReturn: "12-15%",
      duration: "3 years",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      badgeImage: "/badge-starter-plan.jpg",
      features: ["Guaranteed returns", "Professional management", "Quarterly reports", "Flexible withdrawal"],
    },
    {
      name: "Premium Plan",
      minInvestment: "₦20M",
      expectedReturn: "15-18%",
      duration: "5 years",
      icon: Award,
      color: "from-amber-500 to-orange-500",
      badgeImage: "/badge-premium-plan.jpg",
      features: ["Higher returns", "Priority support", "Monthly reports", "Property visits", "Tax benefits"],
      highlighted: true,
    },
    {
      name: "Elite Plan",
      minInvestment: "₦50M+",
      expectedReturn: "18-22%",
      duration: "7 years",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      badgeImage: "/badge-elite-plan.jpg",
      features: [
        "Maximum returns",
        "Dedicated manager",
        "Weekly reports",
        "VIP access",
        "Custom portfolio",
        "Estate planning",
      ],
    },
  ]

  const faqs = [
    {
      question: "How are returns calculated?",
      answer:
        "Returns are based on property appreciation and rental income, calculated quarterly and paid directly to your account.",
    },
    {
      question: "Can I withdraw early?",
      answer:
        "Yes, early withdrawal is possible with minimal penalties depending on your plan and investment duration.",
    },
    {
      question: "What are the risks?",
      answer:
        "Real estate investments carry market risks. We mitigate these through diversification and professional management.",
    },
    {
      question: "How do I get started?",
      answer:
        "Contact our investment team, complete KYC verification, and sign the investment agreement. Funds are held in escrow.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Video Background */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        >
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">Investment Plans</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Grow your wealth with our proven real estate investment opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <div
                  key={index}
                  className={`transform transition-all duration-500 hover:scale-105 ${
                    plan.highlighted ? "md:scale-105" : ""
                  }`}
                >
                  <Card
                    className={`overflow-hidden h-full backdrop-blur-sm border-2 transition-all duration-300 ${
                      plan.highlighted
                        ? "border-accent bg-gradient-to-br from-accent/10 to-accent/5 shadow-2xl"
                        : "border-border hover:border-accent/50 bg-card/50"
                    }`}
                  >
                    {/* Header with Image Badge */}
                    <div className={`bg-gradient-to-r ${plan.color} p-6 sm:p-8 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                          <Image
                            src={plan.badgeImage}
                            alt={plan.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="block text-sm font-bold text-white mb-1">{plan.name}</div>
                          {plan.highlighted && (
                            <div className="block text-xs font-semibold text-amber-200">Most Popular</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                      {/* Investment Details */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Minimum Investment</p>
                            <p className="text-lg sm:text-xl font-bold">{plan.minInvestment}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Expected Return</p>
                            <p className="text-lg sm:text-xl font-bold text-accent">{plan.expectedReturn}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Investment Duration</p>
                            <p className="text-lg sm:text-xl font-bold">{plan.duration}</p>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-8 pb-8 border-b border-border">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full py-6 sm:py-7 text-base sm:text-lg font-semibold transition-all duration-300 ${
                          plan.highlighted
                            ? "bg-gradient-to-r from-accent to-accent/80 hover:shadow-lg hover:shadow-accent/50 text-white"
                            : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        }`}
                      >
                        Invest Now
                      </Button>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Investment FAQs</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Find answers to common questions about our investment plans
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="group border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-lg"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-left">{faq.question}</h3>
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                  >
                    <span className="text-accent font-bold">+</span>
                  </div>
                </button>

                {expandedFaq === idx && (
                  <div className="px-6 sm:px-8 py-4 sm:py-6 bg-muted/50 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
