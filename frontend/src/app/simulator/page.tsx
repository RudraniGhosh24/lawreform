'use client'
import { useState } from 'react'
import { AlertTriangle, RotateCcw, ChevronRight } from 'lucide-react'
import SimulatorScenario from '@/components/simulator/SimulatorScenario'
import SimulatorResult from '@/components/simulator/SimulatorResult'

export const scenarios = [
  { id: 'road_accident', label: 'Road Accident', icon: '🚗', desc: 'Someone is injured in a crash near you', severity: 'High' },
  { id: 'drowning', label: 'Drowning / Medical Emergency', icon: '🌊', desc: 'Person in water or unconscious', severity: 'Critical' },
  { id: 'fraud', label: 'Fraud / Scam', icon: '💳', desc: 'You or someone is being scammed', severity: 'Medium' },
  { id: 'harassment', label: 'Harassment (Public/Workplace)', icon: '🚨', desc: 'Witnessing or experiencing harassment', severity: 'High' },
  { id: 'sexual_assault', label: 'Sexual Assault / Rape', icon: '🛡️', desc: 'Victim support and immediate steps', severity: 'Critical' },
  { id: 'domestic_violence', label: 'Domestic Violence', icon: '🏠', desc: 'Escaping or witnessing domestic abuse', severity: 'Critical' },
  { id: 'theft', label: 'Theft / Robbery', icon: '🔓', desc: 'During or after a theft incident', severity: 'High' },
  { id: 'cybercrime', label: 'Cybercrime / Hacking', icon: '💻', desc: 'Account hacked or data stolen', severity: 'Medium' },
  { id: 'fire_emergency', label: 'Fire Emergency', icon: '🔥', desc: 'Building fire or someone trapped', severity: 'Critical' },
  { id: 'child_abuse', label: 'Child Abuse / Neglect', icon: '👶', desc: 'Suspecting a child is being abused', severity: 'Critical' },
  { id: 'medical_emergency', label: 'Heart Attack / Collapse', icon: '🫀', desc: 'Someone collapses in front of you', severity: 'Critical' },
  { id: 'stalking', label: 'Stalking / Following', icon: '👁️', desc: 'You or someone is being stalked', severity: 'High' },
  { id: 'hit_and_run', label: 'Hit and Run (Victim)', icon: '🚙', desc: 'You are hit by a vehicle that flees', severity: 'High' },
  { id: 'workplace_injury', label: 'Workplace Injury', icon: '🏗️', desc: 'Serious injury at a workplace', severity: 'High' },
  { id: 'kidnapping', label: 'Kidnapping / Abduction', icon: '🚐', desc: 'Witnessing or experiencing an abduction', severity: 'Critical' },
  { id: 'poisoning', label: 'Poisoning / Overdose', icon: '💊', desc: 'Someone has ingested something harmful', severity: 'Critical' },
  { id: 'earthquake', label: 'Earthquake', icon: '🌍', desc: 'During and after an earthquake', severity: 'Critical' },
  { id: 'dog_attack', label: 'Dog / Animal Attack', icon: '🐕', desc: 'Attacked by a dog or wild animal', severity: 'High' },
  { id: 'gas_leak', label: 'Gas Leak', icon: '⛽', desc: 'Smell gas in your home or building', severity: 'Critical' },
  { id: 'wrongful_arrest', label: 'Wrongful Arrest / Police Encounter', icon: '👮', desc: 'Stopped or arrested by police unfairly', severity: 'High' },
  { id: 'elder_abuse', label: 'Elder Abuse', icon: '🧓', desc: 'Suspecting an elderly person is being abused', severity: 'High' },
  { id: 'blackmail', label: 'Blackmail / Extortion', icon: '🔒', desc: 'Someone is threatening to expose you', severity: 'High' },
]

type Step = 'select' | 'jurisdiction' | 'simulate' | 'result'

export default function SimulatorPage() {
  const [step, setStep] = useState<Step>('select')
  const [scenario, setScenario] = useState<string | null>(null)
  const [jurisdiction, setJurisdiction] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const reset = () => { setStep('select'); setScenario(null); setJurisdiction(null); setResult(null) }

  const handleSimComplete = async (choices: { nodeId: string; choiceId: string; choiceText: string; wasCorrect: boolean; situation: string; correctChoiceText: string }[]) => {
    setLoading(true)
    try {
      const res = await fetch('/api/simulator/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenario,
          jurisdiction,
          choices: choices.map(c => ({ node_id: c.nodeId, choice_id: c.choiceId, choice_text: c.choiceText, was_correct: c.wasCorrect, situation: c.situation, correct_choice_text: c.correctChoiceText })),
        }),
      })
      const data = await res.json()
      setResult(data)
      setStep('result')
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const severityColor: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <AlertTriangle className="w-4 h-4" /> Emergency Simulator
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Real-World Scenario Simulator</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Interactive simulations that teach you exactly what to do — and what not to do — in real emergencies. Covers legal obligations, ethical duties, and omission liability.
        </p>
      </div>

      {step === 'select' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Choose a Scenario</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {scenarios.map(s => (
              <button key={s.id}
                onClick={() => { setScenario(s.id); setStep('jurisdiction') }}
                className="card-hover text-left flex items-start gap-4">
                <span className="text-3xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{s.label}</span>
                    <span className={`badge text-xs border ${severityColor[s.severity]}`}>{s.severity}</span>
                  </div>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'jurisdiction' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Select Your Jurisdiction</h2>
          <p className="text-gray-500 text-sm mb-6">Laws on omission and duty to assist vary by country.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { id: 'india', label: 'India 🇮🇳', note: 'BNS Section 106, 105, BNSS Section 173' },
              { id: 'uk', label: 'United Kingdom 🇬🇧', note: 'Common law duty of care' },
              { id: 'us', label: 'United States 🇺🇸', note: 'Varies by state — Good Samaritan laws' },
            ].map(j => (
              <button key={j.id}
                onClick={() => { setJurisdiction(j.id); setStep('simulate') }}
                className="p-5 rounded-xl border-2 border-blue-100 hover:border-blue-400 hover:bg-blue-50 text-left transition-all">
                <div className="font-semibold text-gray-800 mb-1">{j.label}</div>
                <div className="text-xs text-gray-400">{j.note}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('select')} className="mt-4 text-sm text-purple-600 hover:underline flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Back
          </button>
        </div>
      )}

      {step === 'simulate' && scenario && jurisdiction && (
        <SimulatorScenario
          scenarioId={scenario}
          jurisdiction={jurisdiction}
          onComplete={handleSimComplete}
          onBack={() => setStep('jurisdiction')}
          loading={loading}
        />
      )}

      {step === 'result' && result && (
        <SimulatorResult result={result} onReset={reset} />
      )}
    </div>
  )
}
