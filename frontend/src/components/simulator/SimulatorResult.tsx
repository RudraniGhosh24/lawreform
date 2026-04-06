'use client'
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, Scale, BookOpen, Info } from 'lucide-react'

interface SimResult {
  score: number
  max_score: number
  grade: 'Excellent' | 'Good' | 'Needs Improvement' | 'Dangerous'
  step_feedback: {
    step: number
    situation: string
    your_choice: string
    correct_choice: string
    was_correct: boolean
    explanation: string
    legal_consequence: string
    ethical_note: string
  }[]
  omission_liability: string | null
  applicable_laws: string[]
  correct_sequence: string[]
  what_not_to_do: string[]
  summary: string
}

interface Props {
  result: SimResult
  onReset: () => void
}

const gradeConfig = {
  Excellent: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', bar: 'bg-green-500' },
  Good: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', bar: 'bg-blue-500' },
  'Needs Improvement': { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', bar: 'bg-yellow-500' },
  Dangerous: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', bar: 'bg-red-500' },
}

export default function SimulatorResult({ result, onReset }: Props) {
  const grade = gradeConfig[result.grade] || gradeConfig['Good']
  const pct = Math.round((result.score / result.max_score) * 100)

  return (
    <div className="space-y-6">
      {/* 1. Score */}
      <div className={`card border ${grade.bg}`}>
        <div className="text-center mb-4">
          <div className={`text-5xl font-bold ${grade.color}`}>{pct}%</div>
          <div className={`text-xl font-semibold mt-1 ${grade.color}`}>{result.grade}</div>
          <div className="text-gray-500 text-sm mt-1">{result.score} / {result.max_score} correct decisions</div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className={`${grade.bar} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-gray-600 text-sm mt-4 text-center">{result.summary}</p>
      </div>

      {/* 2. Your Decision Breakdown */}
      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" /> Your Decision Breakdown
        </h3>
        <div className="space-y-4">
          {result.step_feedback.map((f, i) => (
            <div key={i} className={`rounded-xl border p-4 ${f.was_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                {f.was_correct
                  ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Situation {i + 1}</div>
                  <div className="text-sm mb-1">
                    <span className="font-medium text-gray-700">You chose: </span>
                    <span className={f.was_correct ? 'text-green-700' : 'text-red-700'}>{f.your_choice}</span>
                  </div>
                  {!f.was_correct && f.correct_choice && (
                    <div className="text-sm mb-1">
                      <span className="font-medium text-gray-700">Ideal choice: </span>
                      <span className="text-green-700">{f.correct_choice}</span>
                    </div>
                  )}
                  {f.explanation && <p className="text-sm text-gray-600 mt-2">{f.explanation}</p>}
                  {f.legal_consequence && (
                    <div className="text-xs bg-white/70 rounded-lg p-2 border border-gray-200 mt-2">
                      <span className="font-medium text-purple-700">Legal consequence: </span>{f.legal_consequence}
                    </div>
                  )}
                  {f.ethical_note && (
                    <div className="text-xs bg-white/70 rounded-lg p-2 border border-gray-200 mt-1">
                      <span className="font-medium text-blue-700">Ethical note: </span>{f.ethical_note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Correct Response Sequence — built from actual steps */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-800">The Correct Response Sequence</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Here is what you should have done at each step you encountered, based on legal obligations, ethical duties, and best practices.</p>
        <ol className="space-y-3">
          {result.step_feedback.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <div className="text-sm text-gray-700">
                <span className="text-xs text-gray-400 block mb-0.5">Situation {i + 1}</span>
                <span className="text-green-700 font-medium">{f.correct_choice || f.your_choice}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 4. What NOT to do */}
      <div className="card bg-red-50 border-red-200">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-gray-800">What NOT To Do</h3>
        </div>
        <ul className="space-y-2">
          {result.what_not_to_do.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Omission liability */}
      {result.omission_liability && (
        <div className="card bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-gray-800">Omission Liability Note</h3>
          </div>
          <p className="text-sm text-gray-700">{result.omission_liability}</p>
        </div>
      )}

      {/* 5. Applicable laws */}
      {result.applicable_laws?.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-gray-800">Applicable Laws</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.applicable_laws.map((l, i) => <span key={i} className="badge-purple text-xs">{l}</span>)}
          </div>
        </div>
      )}

      {/* 7. Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-500 space-y-1">
            <p>This simulation is for educational purposes only and does not constitute legal advice. Laws vary by jurisdiction and change over time. The "correct" responses are based on general legal principles and best practices — actual situations may require different actions depending on specific circumstances.</p>
            <p>In any real emergency, always call your local emergency services first (100/112 in India, 999 in UK, 911 in US). Consult a qualified legal professional for advice specific to your situation.</p>
          </div>
        </div>
      </div>

      <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-2">
        <RotateCcw className="w-4 h-4" /> Try Another Scenario
      </button>
    </div>
  )
}
