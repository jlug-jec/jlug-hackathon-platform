"use client"

import { useState, useEffect } from "react"
import { Menu, X, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            CodeKumbh<span className="text-primary">2.0</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a href="#register" className="hidden md:block">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            Register Now
          </Button>
        </a>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#register" onClick={() => setMobileOpen(false)}>
              <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Register Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
