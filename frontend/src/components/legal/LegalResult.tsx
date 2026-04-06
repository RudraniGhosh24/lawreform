'use client'
import { RotateCcw, AlertTriangle, CheckCircle, Info, Scale, FileText, Shield } from 'lucide-react'
import type { Jurisdiction, LawArea } from '@/app/situation-advisor/page'

interface LegalResultData {
  classification: string
  summary: string
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical'
  immediate_actions: string[]
  rights: string[]
  liabilities: string[]
  jurisdiction_notes: string
  applicable_laws: string[]
  recommended_next_steps: string[]
  disclaimer: string
}

interface Props {
  result: LegalResultData
  jurisdiction: Jurisdiction
  area: LawArea
  onReset: () => void
}

const riskConfig = {
  Low: { color: 'badge-green', icon: CheckCircle, bg: 'bg-green-50 border-green-200' },
  Medium: { color: 'badge-yellow', icon: Info, bg: 'bg-yellow-50 border-yellow-200' },
  High: { color: 'badge-red', icon: AlertTriangle, bg: 'bg-red-50 border-red-200' },
  Critical: { color: 'badge-red', icon: AlertTriangle, bg: 'bg-red-50 border-red-200' },
}

export default function LegalResult({ result, jurisdiction, area, onReset }: Props) {
  const risk = riskConfig[result.risk_level] || riskConfig.Medium
  const RiskIcon = risk.icon

  const jLabel = { india: '🇮🇳 India', uk: '🇬🇧 UK', us: '🇺🇸 US' }[jurisdiction]
  const aLabel = { tort: 'Tort Law', criminal: 'Criminal Law', family: 'Family Law', contract: 'Contract Law' }[area]

  return (
    <div className="space-y-6">
      {/* Classification header */}
      <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="badge-purple">{jLabel}</span>
          <span className="badge-blue">{aLabel}</span>
          <span className={`badge ${risk.color}`}>
            <RiskIcon className="w-3 h-3 mr-1" /> {result.risk_level} Risk
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.classification}</h2>
        <p className="text-gray-600 leading-relaxed">{result.summary}</p>
      </div>

      {/* Immediate Actions */}
      <div className="card border-orange-200 bg-orange-50">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-gray-800">Immediate Actions</h3>
        </div>
        <ol className="space-y-2">
          {result.immediate_actions.map((action, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-gray-700 text-sm">{action}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Rights & Liabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card border-green-200 bg-green-50">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-800">Your Rights</h3>
          </div>
          <ul className="space-y-2">
            {result.rights.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-800">Potential Liabilities</h3>
          </div>
          <ul className="space-y-2">
            {result.liabilities.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Applicable Laws */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-800">Applicable Laws & Statutes</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.applicable_laws.map((law, i) => (
            <span key={i} className="badge-purple text-xs">{law}</span>
          ))}
        </div>
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-800 font-medium">Jurisdiction Note</p>
          <p className="text-sm text-gray-600 mt-1">{result.jurisdiction_notes}</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-800">Recommended Next Steps</h3>
        </div>
        <ol className="space-y-3">
          {result.recommended_next_steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-gray-700 text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
        <strong>Disclaimer:</strong> {result.disclaimer}
      </div>

      <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-2">
        <RotateCcw className="w-4 h-4" /> Start New Analysis
      </button>
    </div>
  )
}
