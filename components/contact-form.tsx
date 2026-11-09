"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { fadeLeft, fadeUp, staggerContainer, viewportOnce } from "@/lib/animations"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || "Unable to submit enquiry.")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      setError("Failed to send message. Please try again.")
      console.error("Error submitting form:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="bg-[#f0ece3] px-4 py-20 sm:px-8 lg:py-28 dark:bg-background">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mx-auto max-w-[1280px]">
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <p className="luxury-eyebrow mb-3">Start a conversation</p><h2 className="mb-4 font-serif text-[clamp(3rem,7vw,5rem)] leading-none">Get in touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Contact Info */}
          <motion.div variants={fadeLeft} className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">+234 (0) 800 123 4567</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">info@tonmag.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground">Abuja, Nigeria</p>
                </div>
              </div>
            </Card>

            {/* WhatsApp CTA */}
            <Card className="p-6 bg-accent/5 border-accent/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">WhatsApp Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">Chat with us on WhatsApp for instant support</p>
                  <a
                    href="https://wa.me/2348012345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-medium hover:underline"
                  >
                    Start Chat →
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <Card className="rounded-2xl border-border bg-card p-5 shadow-[0_24px_70px_rgba(8,25,39,.08)] sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 (0) 800 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                  {loading ? "Sending..." : submitted ? "Message Sent!" : "Send Message"}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
