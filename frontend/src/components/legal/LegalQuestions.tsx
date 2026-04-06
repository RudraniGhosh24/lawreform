'use client'
import { useState, useEffect } from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'
import type { Jurisdiction, LawArea } from '@/app/situation-advisor/page'

interface Question {
  id: string
  text: string
  type: 'boolean' | 'choice' | 'text' | 'date'
  options?: string[]
  required?: boolean
  hint?: string
}

interface Props {
  jurisdiction: Jurisdiction
  area: LawArea
  onSubmit: (answers: Record<string, string | boolean | string[]>) => void
  onBack: () => void
  loading: boolean
}

// Static question bank — rule-based, no LLM needed for questions
const questionBank: Record<LawArea, Question[]> = {
  tort: [
    { id: 'role', text: 'What is your role in this situation?', type: 'choice', options: ['Claimant (victim)', 'Defendant (accused)', 'Witness / Third party'], required: true },
    { id: 'harm_type', text: 'What type of harm occurred?', type: 'choice', options: ['Physical injury', 'Property damage', 'Financial loss', 'Reputational damage', 'Emotional distress', 'Privacy violation'], required: true },
    { id: 'duty_existed', text: 'Did the other party owe you a duty of care?', type: 'boolean', hint: 'E.g., doctor-patient, employer-employee, road user to others', required: true },
    { id: 'breach', text: 'Did the other party act below the standard of a reasonable person?', type: 'boolean', required: true },
    { id: 'causation', text: 'Was the harm directly caused by the other party\'s action or inaction?', type: 'boolean', required: true },
    { id: 'contributory', text: 'Did you contribute to the harm in any way?', type: 'boolean', required: true },
    { id: 'harm_category', text: 'Which best describes the situation?', type: 'choice', options: ['Negligence', 'Defamation / Libel / Slander', 'Nuisance', 'Trespass', 'Product liability', 'Occupier\'s liability', 'Not sure'], required: true },
    { id: 'time_since', text: 'How long ago did the incident occur?', type: 'choice', options: ['Less than 6 months', '6 months – 1 year', '1–3 years', 'More than 3 years'], required: true },
    { id: 'evidence', text: 'Do you have evidence (photos, witnesses, documents)?', type: 'boolean', required: true },
    { id: 'description', text: 'Briefly describe what happened', type: 'text', required: true },
  ],
  criminal: [
    { id: 'role', text: 'What is your role?', type: 'choice', options: ['Victim', 'Accused / Suspect', 'Witness', 'Family of victim', 'Family of accused'], required: true },
    { id: 'offence_type', text: 'What type of offence is involved?', type: 'choice', options: ['Assault / Battery', 'Theft / Robbery', 'Fraud / Cheating', 'Sexual offence', 'Murder / Culpable homicide', 'Drug offence', 'Cybercrime', 'Domestic violence', 'Other'], required: true },
    { id: 'reported', text: 'Has this been reported to the police?', type: 'boolean', required: true },
    { id: 'arrested', text: 'Has anyone been arrested?', type: 'boolean', required: true },
    { id: 'in_custody', text: 'Is the accused currently in custody?', type: 'boolean', required: true },
    { id: 'evidence', text: 'Is there physical or digital evidence?', type: 'boolean', required: true },
    { id: 'witnesses', text: 'Are there independent witnesses?', type: 'boolean', required: true },
    { id: 'time_since', text: 'When did the incident occur?', type: 'choice', options: ['Within 24 hours', '1–7 days ago', '1–4 weeks ago', '1–6 months ago', 'More than 6 months ago'], required: true },
    { id: 'self_defence', text: 'Was any action taken in self-defence?', type: 'boolean', required: true },
    { id: 'description', text: 'Briefly describe the incident', type: 'text', required: true },
  ],
  family: [
    { id: 'matter_type', text: 'What is the family law matter?', type: 'choice', options: ['Divorce / Separation', 'Child custody', 'Maintenance / Alimony', 'Domestic violence', 'Adoption', 'Inheritance / Succession', 'Marriage validity'], required: true },
    { id: 'married', text: 'Are you legally married?', type: 'boolean', required: true },
    { id: 'duration', text: 'How long have you been married?', type: 'choice', options: ['Less than 1 year', '1–3 years', '3–10 years', 'More than 10 years', 'Not applicable'], required: true },
    { id: 'children', text: 'Are there children involved?', type: 'boolean', required: true },
    { id: 'children_age', text: 'If yes, are any children under 18?', type: 'boolean', required: false },
    { id: 'violence', text: 'Is there any history of domestic violence or abuse?', type: 'boolean', required: true },
    { id: 'mutual_consent', text: 'Is the separation/divorce by mutual consent?', type: 'boolean', required: true },
    { id: 'property', text: 'Is there shared property or assets involved?', type: 'boolean', required: true },
    { id: 'description', text: 'Briefly describe your situation', type: 'text', required: true },
  ],
  contract: [
    { id: 'role', text: 'What is your role?', type: 'choice', options: ['Party who wants to enforce the contract', 'Party accused of breach', 'Third party affected'], required: true },
    { id: 'contract_type', text: 'What type of contract?', type: 'choice', options: ['Employment', 'Sale of goods', 'Service agreement', 'Lease / Rental', 'Loan / Finance', 'Business partnership', 'Online / E-commerce', 'Other'], required: true },
    { id: 'written', text: 'Is the contract in writing?', type: 'boolean', required: true },
    { id: 'signed', text: 'Was it signed by both parties?', type: 'boolean', required: true },
    { id: 'breach_type', text: 'What is the nature of the issue?', type: 'choice', options: ['Non-payment', 'Non-performance', 'Misrepresentation / Fraud', 'Termination dispute', 'Unfair terms', 'Force majeure claim', 'Other'], required: true },
    { id: 'loss_suffered', text: 'Have you suffered a financial loss?', type: 'boolean', required: true },
    { id: 'notice_given', text: 'Was a formal notice of breach given?', type: 'boolean', required: true },
    { id: 'time_since', text: 'When did the breach occur?', type: 'choice', options: ['Less than 1 month', '1–6 months', '6 months – 2 years', 'More than 2 years'], required: true },
    { id: 'consideration', text: 'Was there valid consideration (payment/exchange) agreed?', type: 'boolean', required: true },
    { id: 'description', text: 'Briefly describe the contract dispute', type: 'text', required: true },
  ],
}

export default function LegalQuestions({ jurisdiction, area, onSubmit, onBack, loading }: Props) {
  const questions = questionBank[area]
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({})
  const [current, setCurrent] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const q = questions[current]
  const isLast = current === questions.length - 1

  const setAnswer = (id: string, val: string | boolean) => {
    setAnswers(prev => ({ ...prev, [id]: val }))
    setErrors(prev => { const e = { ...prev }; delete e[id]; return e })
  }

  const next = () => {
    if (q.required && answers[q.id] === undefined) {
      setErrors({ [q.id]: 'This field is required' }); return
    }
    if (isLast) {
      onSubmit(answers)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const prev = () => {
    if (current === 0) onBack()
    else setCurrent(c => c - 1)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Question {current + 1} of {questions.length}</span>
        <span className="badge-purple text-xs">{area.charAt(0).toUpperCase() + area.slice(1)} Law · {jurisdiction.toUpperCase()}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">{q.text}</h3>
      {q.hint && <p className="text-sm text-gray-400 mb-4 italic">{q.hint}</p>}

      <div className="mt-4 mb-6">
        {q.type === 'boolean' && (
          <div className="flex gap-4">
            {['Yes', 'No'].map(opt => (
              <button key={opt} onClick={() => setAnswer(q.id, opt === 'Yes')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all
                  ${answers[q.id] === (opt === 'Yes') ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300 text-gray-600'}`}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === 'choice' && (
          <div className="grid grid-cols-1 gap-2">
            {q.options?.map(opt => (
              <button key={opt} onClick={() => setAnswer(q.id, opt)}
                className={`py-3 px-4 rounded-xl border-2 text-left font-medium transition-all
                  ${answers[q.id] === opt ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300 text-gray-600'}`}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === 'text' && (
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="Describe in your own words..."
            value={(answers[q.id] as string) || ''}
            onChange={e => setAnswer(q.id, e.target.value)}
          />
        )}

        {errors[q.id] && <p className="text-red-500 text-sm mt-2">{errors[q.id]}</p>}
      </div>

      <div className="flex gap-3">
        <button onClick={prev} className="btn-secondary flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Back
        </button>
        <button onClick={next} disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : isLast ? 'See Analysis' : 'Next Question'}
        </button>
      </div>
    </div>
  )
}
