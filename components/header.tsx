"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect } from "react"

const houseTypes = [
  { name: "Acacia", slug: "acacia" },
  { name: "Oakville", slug: "oakville" },
  { name: "Maple", slug: "maple" },
  { name: "Pine", slug: "pine" },
  { name: "Château", slug: "chateau" },
  { name: "Villa", slug: "villa" },
  { name: "Oak", slug: "oak" },
  { name: "Scarlet Oak", slug: "scarlet-oak" },
  { name: "Maple Penthouse", slug: "maple-penthouse" },
  { name: "Pine Penthouse", slug: "pine-penthouse" },
  { name: "Olive", slug: "olive" },
  { name: "The Nouveau Villa", slug: "the-nouveau-villa" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/house-types", label: "House Types", hasDropdown: true },
    { href: "/projects", label: "Projects", hasDropdown: true },
    { href: "/investment-plans", label: "Investment Plans" },
    { href: "/credibility-legal", label: "Credibility & Legal" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">TONMAG</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                <button
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href={link.href}>{link.label}</Link>
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Desktop Dropdown */}
                {link.hasDropdown && (
                  <div
                    className={`absolute left-0 top-full pt-2 hidden group-hover:block ${
                      link.label === "House Types" ? "w-96" : "w-48"
                    }`}
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="bg-background border border-border rounded-lg shadow-lg p-6">
                      {link.label === "House Types" ? (
                        <div className="grid grid-cols-2 gap-4">
                          {houseTypes.map((type) => (
                            <Link
                              key={type.slug}
                              href={`/house-types/${type.slug}`}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                            >
                              {type.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            href="/projects"
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                          >
                            All Projects
                          </Link>
                          <Link
                            href="/projects"
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                          >
                            Ongoing Projects
                          </Link>
                          <Link
                            href="/projects"
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                          >
                            Completed Projects
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <Link href="/book-a-tour">
              <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90">Book a Tour</Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book-a-tour" className="w-full block mt-4">
              <Button className="w-full bg-primary hover:bg-primary/90">Book a Tour</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
