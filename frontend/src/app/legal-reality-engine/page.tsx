'use client'
import { useState } from 'react'
import { Brain, Loader2, AlertTriangle, Scale, BarChart3, Users, GitBranch, TrendingUp, ShieldAlert } from 'lucide-react'
import LREResult from '@/components/lre/LREResult'

const courts = [
  { id: 'magistrate', label: 'Magistrate Court' },
  { id: 'sessions_court', label: 'Sessions Court' },
  { id: 'district_court', label: 'District Court' },
  { id: 'family_court', label: 'Family Court' },
  { id: 'consumer_forum', label: 'Consumer Forum' },
  { id: 'high_court', label: 'High Court' },
  { id: 'supreme_court', label: 'Supreme Court' },
  { id: 'tribunal', label: 'Tribunal' },
]

const states = [
  'Delhi', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'Kerala',
  'West Bengal', 'Gujarat', 'Rajasthan', 'Bihar', 'Punjab', 'Haryana',
  'Madhya Pradesh', 'Telangana', 'Jharkhand', 'Andhra Pradesh', 'Odisha',
  'Chhattisgarh', 'Uttarakhand', 'Goa', 'Himachal Pradesh', 'Assam',
]

const commonSections = [
  { id: '101', label: 'S.101 — Murder' },
  { id: '105', label: 'S.105 — Culpable Homicide' },
  { id: '106', label: 'S.106 — Death by Negligence' },
  { id: '115', label: 'S.115 — Voluntarily Causing Hurt' },
  { id: '117', label: 'S.117 — Grievous Hurt' },
  { id: '63', label: 'S.63 — Rape' },
  { id: '74', label: 'S.74 — Assault on Woman' },
  { id: '78', label: 'S.78 — Stalking' },
  { id: '85', label: 'S.85 — Cruelty by Husband' },
  { id: '303', label: 'S.303 — Theft' },
  { id: '309', label: 'S.309 — Robbery' },
  { id: '318', label: 'S.318 — Cheating' },
  { id: '329', label: 'S.329 — Criminal Trespass' },
  { id: '356', label: 'S.356 — Defamation' },
]

const features = [
  { icon: Brain, label: 'Outcome Prediction' },
  { icon: Scale, label: 'Precedent Matching' },
  { icon: Users, label: 'Judge Behavior' },
  { icon: GitBranch, label: 'Counterfactual Sim' },
  { icon: TrendingUp, label: 'Legal Trends' },
  { icon: ShieldAlert, label: 'Bias Detection' },
  { icon: AlertTriangle, label: 'Legal Hurdles' },
]

export default function LREPage() {
  const [caseDesc, setCaseDesc] = useState('')
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [court, setCourt] = useState('district_court')
  const [state, setState] = useState('Delhi')
  const [hasEvidence, setHasEvidence] = useState(true)
  const [isFirstOffence, setIsFirstOffence] = useState(true)
  const [accusedGender, setAccusedGender] = useState('male')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleSection = (id: string) => {
    setSelectedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const analyze = async () => {
    if (caseDesc.trim().length < 30) { setError('Please describe the case in at least 30 characters.'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/lre/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_description: caseDesc, sections: selectedSections,
          court, state, has_evidence: hasEvidence,
          is_first_offence: isFirstOffence, accused_gender: accusedGender,
        }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      setResult(await res.json())
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Brain className="w-4 h-4" /> Legal Reality Engine
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Legal Reality Engine</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Predictive legal analysis for India. Enter your case facts and get outcome predictions, precedent matching, judge behavior insights, counterfactual simulations, legal trends, and fairness analysis — all in one place.
        </p>
      </div>

      {!result && (
        <>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-8">
            {features.map(f => (
              <div key={f.label} className="card text-center py-3 px-1">
                <f.icon className="w-4 h-4 mx-auto mb-1 text-violet-500" />
                <span className="text-[10px] text-gray-600 font-medium leading-tight block">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="card space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Case Description / FIR Text</label>
              <textarea className="input-field min-h-[140px] resize-none text-sm"
                placeholder="Describe the case facts, FIR details, parties involved, what happened, when, where..."
                value={caseDesc} onChange={e => { setCaseDesc(e.target.value); setError(null) }} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">BNS Sections Involved (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {commonSections.map(s => (
                  <button key={s.id} onClick={() => toggleSection(s.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium
                      ${selectedSections.includes(s.id) ? 'bg-violet-100 border-violet-400 text-violet-700' : 'bg-white border-gray-200 text-gray-600 hover:border-violet-300'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Court</label>
                <select className="select-field" value={court} onChange={e => setCourt(e.target.value)}>
                  {courts.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">State / Jurisdiction</label>
                <select className="select-field" value={state} onChange={e => setState(e.target.value)}>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Evidence Available?</label>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setHasEvidence(v)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all
                        ${hasEvidence === v ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500'}`}>
                      {v ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">First Offence?</label>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setIsFirstOffence(v)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all
                        ${isFirstOffence === v ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500'}`}>
                      {v ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Accused Gender</label>
                <div className="flex gap-3">
                  {['male', 'female', 'other'].map(v => (
                    <button key={v} onClick={() => setAccusedGender(v)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all capitalize
                        ${accusedGender === v ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}

            <button onClick={analyze} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Running Full Analysis...</> : <><Brain className="w-4 h-4" /> Analyze Case</>}
            </button>
          </div>
        </>
      )}

      {result && <LREResult result={result} onReset={() => { setResult(null); setCaseDesc('') }} />}
    </div>
  )
}
