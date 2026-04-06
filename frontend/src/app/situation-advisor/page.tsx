'use client'
import { useState } from 'react'
import { Scale, ChevronRight, RotateCcw, AlertCircle } from 'lucide-react'
import LegalResult from '@/components/legal/LegalResult'
import LegalQuestions from '@/components/legal/LegalQuestions'

export type Jurisdiction = 'india' | 'uk' | 'us'
export type LawArea = 'tort' | 'criminal' | 'family' | 'contract'

export interface LegalInput {
  jurisdiction: Jurisdiction
  area: LawArea
  answers: Record<string, string | boolean | string[]>
}

const jurisdictions = [
  { id: 'india', label: 'India 🇮🇳', desc: 'BNS, BNSS, Contract Act, Hindu Marriage Act' },
  { id: 'uk', label: 'United Kingdom 🇬🇧', desc: 'Common law, Tort, Family Law Act' },
  { id: 'us', label: 'United States 🇺🇸', desc: 'Federal & State law, UCC, Penal Code' },
]

const areas = [
  { id: 'tort', label: 'Tort Law', icon: '⚖️', desc: 'Negligence, defamation, nuisance, trespass' },
  { id: 'criminal', label: 'Criminal Law', icon: '🔒', desc: 'Offences, defences, procedure, sentencing' },
  { id: 'family', label: 'Family Law', icon: '👨‍👩‍👧', desc: 'Divorce, custody, maintenance, adoption' },
  { id: 'contract', label: 'Contract Law', icon: '📄', desc: 'Breach, validity, remedies, enforcement' },
]

type Step = 'jurisdiction' | 'area' | 'questions' | 'result'

export default function LegalAdvisorPage() {
  const [step, setStep] = useState<Step>('jurisdiction')
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null)
  const [area, setArea] = useState<LawArea | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setStep('jurisdiction'); setJurisdiction(null); setArea(null)
    setResult(null); setError(null)
  }

  const handleAnswers = async (answers: Record<string, string | boolean | string[]>) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/legal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jurisdiction, area, answers }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResult(data)
      setStep('result')
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['jurisdiction', 'area', 'questions', 'result']
  const stepIdx = steps.indexOf(step)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Scale className="w-4 h-4" /> Situation Advisor
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Situation Advisor</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Answer structured questions about your situation. Get classified legal outcomes, risk levels, and actionable steps.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {['Jurisdiction', 'Law Area', 'Questions', 'Result'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${i < stepIdx ? 'bg-purple-500 text-white' : i === stepIdx ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i < stepIdx ? '✓' : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i === stepIdx ? 'text-purple-700 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < 3 && <ChevronRight className="w-4 h-4 text-gray-300" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step: Jurisdiction */}
      {step === 'jurisdiction' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Select Your Jurisdiction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jurisdictions.map(j => (
              <button key={j.id} onClick={() => { setJurisdiction(j.id as Jurisdiction); setStep('area') }}
                className="p-5 rounded-xl border-2 border-purple-100 hover:border-purple-400 hover:bg-purple-50 text-left transition-all group">
                <div className="text-2xl mb-2">{j.label.split(' ')[1]}</div>
                <div className="font-semibold text-gray-800 group-hover:text-purple-700">{j.label.split(' ')[0]}</div>
                <div className="text-xs text-gray-400 mt-1">{j.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Area */}
      {step === 'area' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Select Area of Law</h2>
            <button onClick={() => setStep('jurisdiction')} className="text-sm text-purple-600 hover:underline flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Back
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areas.map(a => (
              <button key={a.id} onClick={() => { setArea(a.id as LawArea); setStep('questions') }}
                className="p-5 rounded-xl border-2 border-purple-100 hover:border-purple-400 hover:bg-purple-50 text-left transition-all group flex items-start gap-4">
                <span className="text-3xl">{a.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800 group-hover:text-purple-700">{a.label}</div>
                  <div className="text-sm text-gray-400 mt-1">{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Questions */}
      {step === 'questions' && jurisdiction && area && (
        <LegalQuestions
          jurisdiction={jurisdiction}
          area={area}
          onSubmit={handleAnswers}
          onBack={() => setStep('area')}
          loading={loading}
        />
      )}

      {/* Step: Result */}
      {step === 'result' && result && (
        <LegalResult result={result} jurisdiction={jurisdiction!} area={area!} onReset={reset} />
      )}
    </div>
  )
}
