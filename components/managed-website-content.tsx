"use client"

import { useEffect, useState } from "react"

type PublicContent = { id: string; type: "announcement" | "banner" | "testimonial"; title: string; body: string; imageUrl: string }

export function ManagedWebsiteContent() {
  const [content, setContent] = useState<PublicContent[]>([])
  useEffect(() => {
    const controller = new AbortController()
    void fetch("/api/public/content", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (Array.isArray(result?.content)) setContent(result.content) })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])
  if (!content.length) return null
  const notices = content.filter((item) => item.type !== "testimonial")
  const testimonials = content.filter((item) => item.type === "testimonial")
  return <section className="bg-background px-5 py-16 sm:px-8"><div className="mx-auto max-w-[1440px]">{notices.length > 0 && <div className="grid gap-4 md:grid-cols-2">{notices.map((item) => <article key={item.id} className="rounded-2xl border border-primary/20 bg-primary/5 p-6"><p className="luxury-eyebrow">{item.type}</p><h2 className="mt-3 font-serif text-3xl">{item.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p></article>)}</div>}{testimonials.length > 0 && <div className="mt-12"><p className="luxury-eyebrow mb-3">Client stories</p><div className="grid gap-4 md:grid-cols-3">{testimonials.map((item) => <blockquote key={item.id} className="rounded-2xl bg-card p-6"><p className="text-sm leading-7">“{item.body}”</p><footer className="mt-4 font-bold">{item.title}</footer></blockquote>)}</div></div>}</div></section>
}
