'use client'
import { useState, useMemo } from 'react'
import { Globe, Shuffle, Search, Share2, CheckCircle, XCircle } from 'lucide-react'
import { weirdLaws, type WeirdLaw } from '@/data/weirdLaws'

const categories = ['All', 'Funny', 'Outdated', 'Still Enforced', 'Bizarre', 'Food & Drink', 'Animals', 'Clothing']
const countries = ['All', ...Array.from(new Set(weirdLaws.map(l => l.country))).sort()]

export default function WeirdLawsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [country, setCountry] = useState('All')
  const [highlighted, setHighlighted] = useState<WeirdLaw | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return weirdLaws.filter(l => {
      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase()) ||
        l.country.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || l.category === category
      const matchCountry = country === 'All' || l.country === country
      return matchSearch && matchCat && matchCountry
    })
  }, [search, category, country])

  const randomLaw = () => {
    const r = weirdLaws[Math.floor(Math.random() * weirdLaws.length)]
    setHighlighted(r)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const share = (law: WeirdLaw) => {
    const text = `Did you know? In ${law.country}: "${law.title}" — ${law.description} | lawreformer.com`
    navigator.clipboard.writeText(text)
    setCopied(law.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Globe className="w-4 h-4" /> Weird Laws Explorer
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">The World's Strangest Laws</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Real laws from around the world — some funny, some outdated, some still very much in force.</p>
        <button onClick={randomLaw}
          className="mt-6 btn-primary inline-flex items-center gap-2">
          <Shuffle className="w-4 h-4" /> Random Law
        </button>
      </div>

      {/* Highlighted random law */}
      {highlighted && (
        <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-purple">{highlighted.country}</span>
                <span className="badge-blue">{highlighted.category}</span>
                {highlighted.still_active
                  ? <span className="badge bg-red-100 text-red-700">Still Active</span>
                  : <span className="badge bg-gray-100 text-gray-500">Outdated</span>}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{highlighted.title}</h3>
              <p className="text-gray-600 mb-3">{highlighted.description}</p>
              <p className="text-sm text-purple-700 italic">{highlighted.implication}</p>
            </div>
            <div className="text-5xl">{highlighted.emoji}</div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => share(highlighted)} className="btn-secondary text-sm py-2 flex items-center gap-2">
              {copied === highlighted.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {copied === highlighted.id ? 'Copied!' : 'Share'}
            </button>
            <button onClick={() => setHighlighted(null)} className="text-sm text-gray-400 hover:text-gray-600">Dismiss</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6 sm:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search laws, countries..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select-field sm:w-48" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="select-field sm:w-48" value={country} onChange={e => setCountry(e.target.value)}>
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="mt-3 text-sm text-gray-400">{filtered.length} laws found</div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map(law => (
          <div key={law.id} className="card-hover flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{law.emoji}</span>
              <div className="flex flex-col items-end gap-1">
                {law.still_active
                  ? <span className="badge bg-red-100 text-red-700 text-xs">Still Active</span>
                  : <span className="badge bg-gray-100 text-gray-500 text-xs">Outdated</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="badge-purple text-xs">{law.country}</span>
              <span className="badge-blue text-xs">{law.category}</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-sm">{law.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed flex-1">{law.description}</p>
            <p className="text-xs text-purple-600 italic mt-2">{law.implication}</p>
            <button onClick={() => share(law)}
              className="mt-3 text-xs text-gray-400 hover:text-purple-600 flex items-center gap-1 self-start transition-colors">
              {copied === law.id ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Share2 className="w-3 h-3" />}
              {copied === law.id ? 'Copied!' : 'Share'}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No laws found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
