"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Calendar, MapPin, User, Mail, Phone as PhoneIcon, Car, Clock } from "lucide-react"

interface BookingForm {
  fullName: string
  email: string
  phone: string
  appointmentDate: string
  appointmentTime: string
  property: string
  propertyType: string
  agentFee: string
  transportation: boolean
  additionalNotes: string
}

const properties = [
  { id: "1", name: "The Nouveau by TONMAG - Maitama" },
  { id: "2", name: "TONMAG Heights - Ikoyi" },
  { id: "3", name: "The Residences - Victoria Island" },
  { id: "4", name: "Acacia - 4BR Terrace" },
  { id: "5", name: "Oak - 5BR Fully Detached" },
]

export default function BookATourPage() {
  const [formData, setFormData] = useState<BookingForm>({
    fullName: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
    property: "",
    propertyType: "",
    agentFee: "standard",
    transportation: false,
    additionalNotes: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, transportation: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        appointmentDate: "",
        appointmentTime: "",
        property: "",
        propertyType: "",
        agentFee: "standard",
        transportation: false,
        additionalNotes: "",
      })
    }, 3000)
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section with Video Background */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        >
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">Book a Tour</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Schedule your private tour of our premium properties and experience luxury living
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-accent" />
                    Schedule Your Tour
                  </h2>

                  {submitted && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-600">
                      <p className="font-semibold">✓ Tour booking submitted successfully!</p>
                      <p className="text-sm">Our team will contact you shortly to confirm your appointment.</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4 pb-6 border-b border-border">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-accent" />
                        Your Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                            className="mt-2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+234 (0) 123 456 7890"
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4 pb-6 border-b border-border">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-accent" />
                        Appointment Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="appointmentDate">Preferred Date *</Label>
                          <Input
                            id="appointmentDate"
                            name="appointmentDate"
                            type="date"
                            value={formData.appointmentDate}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="appointmentTime">Preferred Time *</Label>
                          <Input
                            id="appointmentTime"
                            name="appointmentTime"
                            type="time"
                            value={formData.appointmentTime}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property Selection */}
                    <div className="space-y-4 pb-6 border-b border-border">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent" />
                        Property Selection
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="property">Select Property *</Label>
                          <Select value={formData.property} onValueChange={(value) => handleSelectChange("property", value)}>
                            <SelectTrigger id="property" className="mt-2">
                              <SelectValue placeholder="Choose a property" />
                            </SelectTrigger>
                            <SelectContent>
                              {properties.map((prop) => (
                                <SelectItem key={prop.id} value={prop.id}>
                                  {prop.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="propertyType">Property Type</Label>
                          <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange("propertyType", value)}>
                            <SelectTrigger id="propertyType" className="mt-2">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="terrace">Terrace</SelectItem>
                              <SelectItem value="detached">Fully Detached</SelectItem>
                              <SelectItem value="semi-detached">Semi-Detached</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Services */}
                    <div className="space-y-4 pb-6 border-b border-border">
                      <h3 className="text-lg font-semibold">Additional Services</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="transportation"
                            checked={formData.transportation}
                            onCheckedChange={handleCheckboxChange}
                          />
                          <Label htmlFor="transportation" className="flex items-center gap-2 cursor-pointer">
                            <Car className="w-4 h-4 text-accent" />
                            Arrange transportation from hotel/airport
                          </Label>
                        </div>
                        <div>
                          <Label htmlFor="agentFee">Agent Fee Preference</Label>
                          <Select value={formData.agentFee} onValueChange={(value) => handleSelectChange("agentFee", value)}>
                            <SelectTrigger id="agentFee" className="mt-2">
                              <SelectValue placeholder="Select fee option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Fee</SelectItem>
                              <SelectItem value="premium">Premium Consultation</SelectItem>
                              <SelectItem value="vip">VIP Concierge</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-4">
                      <Label htmlFor="additionalNotes">Additional Notes or Requirements</Label>
                      <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        placeholder="Share any specific requirements or preferences for your tour..."
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-white py-6 text-base">
                      Book Your Tour
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Sidebar - Tour Information */}
            <div className="space-y-6">
              <Card className="border-border bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-bold mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Personalized tour of your selected property</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Professional agent guidance and consultation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Information on financing and payment plans</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Refreshments and comfortable meeting space</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Flexible scheduling to suit your convenience</span>
                  </li>
                </ul>
              </Card>

              <Card className="border-border bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-accent" />
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is ready to assist you with any questions about our properties or the booking process.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Call Us</p>
                    <p className="text-accent">+234 (0) 123 456 7890</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Us</p>
                    <p className="text-accent">tours@tonmag.com</p>
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-bold mb-4">Tour Duration</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Standard tours typically last 60-90 minutes, including:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Property walkthrough</li>
                  <li>• Amenities demonstration</li>
                  <li>• Investment discussion</li>
                  <li>• Q&A session</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
