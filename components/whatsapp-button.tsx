"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const phoneNumber = "2348151916956"
  const message = "Hello! I'm interested in learning more about TONMAG properties."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-xl transition hover:scale-105 hover:bg-[#8d682f]"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
