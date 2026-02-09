"use client"

import { ChevronRight } from "lucide-react"

const pressArticles = [
  {
    id: 1,
    title: "TONMAG boosts housing market with Abuja estate project",
    publication: "The Guardian",
    url: "#",
  },
  {
    id: 2,
    title: "Relief as firm donates accommodation to Abuja displaced orphans",
    publication: "The Nation",
    url: "#",
  },
  {
    id: 3,
    title: "TONMAG gets NITP, COREN, commendations for CSR",
    publication: "This Day",
    url: "#",
  },
  {
    id: 4,
    title: "AI in home security",
    publication: "The Business Year",
    url: "#",
  },
]

export function PressFeatured() {
  return (
    <section className="bg-background py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-primary font-semibold mb-2">Press</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Featured</h2>
        </div>

        {/* Articles List */}
        <div className="space-y-8">
          {pressArticles.map((article, index) => (
            <div key={article.id}>
              <a
                href={article.url}
                className="flex items-center justify-between group cursor-pointer py-4 hover:opacity-80 transition-opacity"
              >
                <div className="flex-1">
                  <p className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {article.title} - <span className="text-gray-400">{article.publication}</span>
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-primary ml-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
              {index < pressArticles.length - 1 && <div className="h-px bg-gray-700" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
