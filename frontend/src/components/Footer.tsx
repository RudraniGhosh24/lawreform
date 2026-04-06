import Link from 'next/link'
import { Scale } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/60 border-t border-purple-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-xl text-purple-700 mb-3">
            <Scale className="w-5 h-5 text-blue-500" />
            <span>Law<span className="text-blue-500">Reformer</span></span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            A legal education and research platform with interactive tools for understanding law across India, UK, and US jurisdictions. For educational purposes only.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Tools</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/situation-advisor" className="hover:text-purple-600">Situation Advisor</Link></li>
            <li><Link href="/simulator" className="hover:text-purple-600">Emergency Simulator</Link></li>
            <li><Link href="/clause-analyser" className="hover:text-purple-600">Clause Analyser</Link></li>
            <li><Link href="/legal-reality-engine" className="hover:text-purple-600">Legal Reality Engine</Link></li>
            <li><Link href="/limitation-engine" className="hover:text-purple-600">Limitation Engine</Link></li>
            <li><Link href="/weird-laws" className="hover:text-purple-600">Weird Laws</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/disclaimer" className="hover:text-purple-600">Disclaimer</Link></li>
            <li><Link href="/privacy" className="hover:text-purple-600">Privacy Policy</Link></li>
            <li><Link href="/about" className="hover:text-purple-600">About</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-purple-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} LawReformer.com — For educational purposes only. Not a law firm.
      </div>
    </footer>
  )
}
