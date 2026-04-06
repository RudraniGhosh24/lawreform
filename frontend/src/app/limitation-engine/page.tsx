'use client'
import { useState } from 'react'
import { Clock, Loader2, AlertTriangle, Calendar } from 'lucide-react'
import LimitationResult from '@/components/limitation/LimitationResult'

const jurisdictions = [
  { id: 'india', label: '🇮🇳 India' },
  { id: 'uk', label: '🇬🇧 United Kingdom' },
  { id: 'us', label: '🇺🇸 United States' },
]

const caseTypes = {
  india: [
    'Breach of contract', 'Specific performance of contract', 'Compensation for tort/negligence',
    'Possession of immovable property', 'Possession of movable property', 'Recovery of money (debt/loan)',
    'Criminal complaint — offence up to 1 year', 'Criminal complaint — offence 1-3 years',
    'Cheque bounce (NI Act Section 138)', 'FIR for cognizable offence',
    'Consumer complaint', 'Divorce petition', 'Maintenance application',
    'Industrial dispute (wrongful termination)', 'Motor accident compensation',
    'Income tax appeal', 'Challenge to arbitral award (Section 34)', 'Writ petition',
  ],
  uk: [
    'Breach of contract (simple)', 'Personal injury claim', 'Recovery of land (adverse possession)',
    'Defamation claim', 'Summary offence prosecution', 'Indictable offence', 'Unfair dismissal claim',
  ],
  us: [
    'Breach of contract (written)', 'Personal injury', 'Employment discrimination (Title VII)',
    'Federal crime (general)', 'Murder / capital offence',
  ],
}

export default function LimitationPage() {
  const [jurisdiction, setJurisdiction] = useState('india')
  const [caseType, setCaseType] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [description, setDescription] = useState('')
  const [hasDisability, setHasDisability] = useState(false)
  const [hasAcknowledgment, setHasAcknowledgment] = useState(false)
  const [applyCovid, setApplyCovid] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentCaseTypes = caseTypes[jurisdiction as keyof typeof caseTypes] || []

  const analyze = async () => {
    if (!caseType) { setError('Please select a case type.'); return }
    if (!incidentDate) { setError('Please enter the incident date.'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/limitation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_type_query: caseType, jurisdiction, incident_date: incidentDate,
          description, has_disability: hasDisability,
          has_acknowledgment: hasAcknowledgment, apply_covid_extension: applyCovid,
        }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setResult(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Clock className="w-4 h-4" /> Limitation Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Limitation & Deadline Engine</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
          Calculate exact limitation deadlines with statutory citations, extension analysis (disability, COVID, acknowledgment), condonation rules, jurisdiction mapping, and urgency classification.
        </p>
      </div>

      {!result && (
        <div className="card space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Jurisdiction</label>
            <div className="flex gap-2">
              {jurisdictions.map(j => (
                <button key={j.id} onClick={() => { setJurisdiction(j.id); setCaseType('') }}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all
                    ${jurisdiction === j.id ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-500'}`}>
                  {j.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Case Type</label>
            <select className="select-field" value={caseType} onChange={e => setCaseType(e.target.value)}>
              <option value="">Select case type...</option>
              {currentCaseTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Date of Incident / Cause of Action</label>
            <input type="date" className="input-field" value={incidentDate} onChange={e => setIncidentDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Brief Description (optional — improves matching)</label>
            <textarea className="input-field min-h-[80px] resize-none text-sm"
              placeholder="Describe the situation briefly..."
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm
              ${hasDisability ? 'border-rose-400 bg-rose-50' : 'border-gray-200'}`}>
              <input type="checkbox" checked={hasDisability} onChange={e => setHasDisability(e.target.checked)} className="accent-rose-500" />
              <span className="text-gray-700">Disability (minor/incapacity)</span>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm
              ${hasAcknowledgment ? 'border-rose-400 bg-rose-50' : 'border-gray-200'}`}>
              <input type="checkbox" checked={hasAcknowledgment} onChange={e => setHasAcknowledgment(e.target.checked)} className="accent-rose-500" />
              <span className="text-gray-700">Written acknowledgment</span>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm
              ${applyCovid ? 'border-rose-400 bg-rose-50' : 'border-gray-200'}`}>
              <input type="checkbox" checked={applyCovid} onChange={e => setApplyCovid(e.target.checked)} className="accent-rose-500" />
              <span className="text-gray-700">Apply COVID extension</span>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          <button onClick={analyze} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</> : <><Clock className="w-4 h-4" /> Calculate Limitation</>}
          </button>
        </div>
      )}

      {result && <LimitationResult result={result} onReset={() => { setResult(null); setCaseType(''); setIncidentDate('') }} />}
    </div>
  )
}
