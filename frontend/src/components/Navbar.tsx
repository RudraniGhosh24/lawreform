'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Scale, Menu, X } from 'lucide-react'

const links = [
  { href: '/situation-advisor', label: 'Situation Advisor' },
  { href: '/simulator', label: 'Simulator' },
  { href: '/clause-analyser', label: 'Clause Analyser' },
  { href: '/legal-reality-engine', label: 'LRE' },
  { href: '/limitation-engine', label: 'Deadlines' },
  { href: '/weird-laws', label: 'Weird Laws' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl text-purple-700">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            <span>Law<span className="text-blue-500">Reformer</span></span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="px-3 py-2 rounded-lg text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-medium transition-all text-sm">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-purple-50" onClick={() => setOpen(!open)}
            aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white/95 border-t border-purple-100 px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-medium text-base">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
