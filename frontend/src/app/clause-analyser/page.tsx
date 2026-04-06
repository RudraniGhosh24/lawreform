'use client'
import { useState } from 'react'
import { FileText, Loader2, AlertTriangle, Shield, Eye, Zap } from 'lucide-react'
import ClauseResult from '@/components/clause-analyser/ClauseResult'

const jurisdictions = [
  { id: 'india', label: '🇮🇳 India' },
  { id: 'uk', label: '🇬🇧 United Kingdom' },
  { id: 'us', label: '🇺🇸 United States' },
]

const contextTypes = [
  { id: 'employment', label: 'Employment Contract' },
  { id: 'rental', label: 'Rental / Lease Agreement' },
  { id: 'freelance', label: 'Freelance / Service Agreement' },
  { id: 'privacy', label: 'Privacy Policy / Data Terms' },
  { id: 'general', label: 'General / Other' },
]

export default function ClauseSnapPage() {
  const [clause, setClause] = useState('')
  const [jurisdiction, setJurisdiction] = useState('india')
  const [context, setContext] = useState('general')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = async () => {
    if (clause.trim().length < 20) {
      setError('Please enter at least 20 characters of clause text.')
      return
    }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/clausesnap/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clause_text: clause, jurisdiction, context_type: context }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <FileText className="w-4 h-4" /> Clause Analyser
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contract Clause Analyser</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Paste any contract clause. Get instant risk detection, red flags, hidden implications, and suggested fixes — tailored to your jurisdiction.
        </p>
      </div>

      {/* Features */}
      {!result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: AlertTriangle, label: 'Red Flag Detection', color: 'text-red-500' },
            { icon: Shield, label: 'Legal Validity Check', color: 'text-green-500' },
            { icon: Eye, label: 'Hidden Implications', color: 'text-purple-500' },
            { icon: Zap, label: 'Suggested Fixes', color: 'text-blue-500' },
          ].map(f => (
            <div key={f.label} className="card text-center py-4">
              <f.icon className={`w-5 h-5 mx-auto mb-2 ${f.color}`} />
              <span className="text-xs text-gray-600 font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      {!result && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Paste Your Clause</h2>

          <textarea
            className="input-field min-h-[160px] resize-none mb-4 text-sm"
            placeholder='e.g. "The Company reserves the right to terminate this agreement at any time, at its sole discretion, without prior notice. All fees paid are non-refundable."'
            value={clause}
            onChange={e => { setClause(e.target.value); setError(null) }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Jurisdiction</label>
              <select className="select-field" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}>
                {jurisdictions.map(j => <option key={j.id} value={j.id}>{j.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Contract Type</label>
              <select className="select-field" value={context} onChange={e => setContext(e.target.value)}>
                {contextTypes.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <button onClick={analyze} disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Clause...</> : <><FileText className="w-4 h-4" /> Analyze Clause</>}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <ClauseResult result={result} onReset={() => { setResult(null); setClause('') }} clauseText={clause} />
      )}
    </div>
  )
}
