'use client'
import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Eye, Shield, Zap, FileText, RotateCcw, Info, ToggleLeft, ToggleRight } from 'lucide-react'

interface ClauseResultData {
  clause_type: string
  plain_english: string
  risk_level: 'Low' | 'Medium' | 'High'
  red_flags: string[]
  deep_analysis: { sentence: string; issues: { category: string; explanation: string; severity: string }[] }[]
  hidden_implications: string[]
  legal_validity: string
  validity_notes: string
  why_this_matters: string
  suggested_fix: string
  confidence: number
  tone_mode: { normal: string; brutal_honesty: string }
  disclaimer: string
}

interface Props {
  result: ClauseResultData
  onReset: () => void
  clauseText: string
}

const riskConfig = {
  Low: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', badge: 'badge-green', icon: CheckCircle },
  Medium: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', badge: 'badge-yellow', icon: AlertTriangle },
  High: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', badge: 'badge-red', icon: XCircle },
}

const validityConfig: Record<string, { color: string; icon: any }> = {
  'Likely enforceable': { color: 'text-green-600', icon: CheckCircle },
  'Questionable': { color: 'text-yellow-600', icon: AlertTriangle },
  'Possibly unenforceable': { color: 'text-red-600', icon: XCircle },
}

export default function ClauseResult({ result, onReset, clauseText }: Props) {
  const [brutalMode, setBrutalMode] = useState(false)
  const risk = riskConfig[result.risk_level] || riskConfig.Medium
  const validity = validityConfig[result.legal_validity] || validityConfig['Questionable']
  const RiskIcon = risk.icon
  const ValidityIcon = validity.icon

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className={`card border ${risk.bg}`}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="badge-purple">{result.clause_type}</span>
          <span className={`badge ${risk.badge}`}>
            <RiskIcon className="w-3 h-3 mr-1" /> {result.risk_level} Risk
          </span>
          <span className={`badge bg-gray-100 ${validity.color}`}>
            <ValidityIcon className="w-3 h-3 mr-1" /> {result.legal_validity}
          </span>
          <span className="badge bg-gray-100 text-gray-600">{result.confidence}% confidence</span>
        </div>

        {/* Tone toggle */}
        <button onClick={() => setBrutalMode(!brutalMode)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-purple-600 mb-3 transition-colors">
          {brutalMode ? <ToggleRight className="w-4 h-4 text-purple-600" /> : <ToggleLeft className="w-4 h-4" />}
          {brutalMode ? 'Brutal Honesty Mode ON' : 'Enable Brutal Honesty Mode'}
        </button>

        <p className="text-gray-700 leading-relaxed text-sm">
          {brutalMode ? result.tone_mode.brutal_honesty : result.tone_mode.normal}
        </p>
      </div>

      {/* Original clause */}
      <div className="card bg-gray-50 border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Original Clause</span>
        </div>
        <p className="text-sm text-gray-600 italic leading-relaxed">"{clauseText}"</p>
      </div>

      {/* Deep sentence-level analysis */}
      {result.deep_analysis && result.deep_analysis.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-gray-800">Line-by-Line Analysis</h3>
            <span className="badge bg-orange-100 text-orange-700 text-xs">{result.deep_analysis.length} sentences flagged</span>
          </div>
          <div className="space-y-4">
            {result.deep_analysis.map((finding: any, i: number) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700 italic mb-3 leading-relaxed">"{finding.sentence}"</p>
                <div className="space-y-2">
                  {finding.issues.map((issue: any, j: number) => (
                    <div key={j} className={`flex items-start gap-2 text-sm rounded-lg p-2 ${issue.severity === 'High' ? 'bg-red-50 border border-red-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                      <span className="text-xs font-medium whitespace-nowrap mt-0.5">{issue.category}</span>
                      <span className="text-gray-700">{issue.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red flags */}
      {result.red_flags.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-800">Red Flags ({result.red_flags.length})</h3>
          </div>
          <ul className="space-y-2">
            {result.red_flags.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.red_flags.length === 0 && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-700 font-medium">No major red flags detected in this clause.</span>
          </div>
        </div>
      )}

      {/* Hidden implications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-800">Hidden Implications</h3>
        </div>
        <ul className="space-y-2">
          {result.hidden_implications.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* Why this matters */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-gray-800">Why This Matters</h3>
        </div>
        <p className="text-sm text-gray-700">{result.why_this_matters}</p>
      </div>

      {/* Legal validity */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-800">Legal Validity</h3>
        </div>
        <div className={`flex items-center gap-2 mb-2 ${validity.color}`}>
          <ValidityIcon className="w-4 h-4" />
          <span className="font-semibold text-sm">{result.legal_validity}</span>
        </div>
        {result.validity_notes && (
          <p className="text-xs text-gray-500 leading-relaxed">{result.validity_notes}</p>
        )}
      </div>

      {/* Suggested fix */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-800">Suggested Fix</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{result.suggested_fix}</p>
      </div>

      {/* Verdict */}
      <div className={`card border-2 ${result.risk_level === 'High' ? 'border-red-300 bg-red-50' : result.risk_level === 'Medium' ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'} text-center`}>
        <RiskIcon className={`w-8 h-8 mx-auto mb-2 ${risk.color}`} />
        <p className={`text-lg font-bold ${risk.color}`}>
          {result.risk_level === 'High' ? 'Do NOT sign this without changes.' : result.risk_level === 'Medium' ? 'Proceed with caution — negotiate changes.' : 'Relatively safe — but read the full contract.'}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
        {result.disclaimer}
      </div>

      <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-2">
        <RotateCcw className="w-4 h-4" /> Analyze Another Clause
      </button>
    </div>
  )
}
