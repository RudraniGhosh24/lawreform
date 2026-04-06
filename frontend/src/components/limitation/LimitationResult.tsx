'use client'
import { Clock, AlertTriangle, CheckCircle, XCircle, Scale, RotateCcw, Info, Calendar, Shield, MapPin, BookOpen } from 'lucide-react'

interface Props { result: any; onReset: () => void }

const urgencyConfig: Record<string, { color: string; bg: string; icon: any }> = {
  EXPIRED: { color: 'text-red-700', bg: 'bg-red-50 border-red-300', icon: XCircle },
  CRITICAL: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: AlertTriangle },
  URGENT: { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', icon: AlertTriangle },
  WARNING: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', icon: Clock },
  CAUTION: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Clock },
  SAFE: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
  None: { color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: Info },
}

export default function LimitationResult({ result, onReset }: Props) {
  const primary = result.primary_analysis || {}
  const rule = primary.rule || {}
  const urgency = urgencyConfig[primary.urgency] || urgencyConfig.None
  const UrgencyIcon = urgency.icon
  const alternatives = result.alternative_analyses || []
  const jurInfo = result.jurisdiction_info || {}
  const covid = result.covid_extension || {}

  return (
    <div className="space-y-5">
      {/* Urgency banner */}
      <div className={`card border-2 ${urgency.bg}`}>
        <div className="flex items-center gap-3 mb-3">
          <UrgencyIcon className={`w-8 h-8 ${urgency.color}`} />
          <div>
            <div className={`text-xl sm:text-2xl font-bold ${urgency.color}`}>{primary.status}</div>
            {primary.has_limitation && primary.days_remaining !== null && (
              <div className="text-sm text-gray-600">
                {primary.days_remaining >= 0
                  ? <><span className={`font-bold ${urgency.color}`}>{primary.days_remaining}</span> days remaining</>
                  : <><span className="font-bold text-red-700">{Math.abs(primary.days_remaining)}</span> days overdue</>}
              </div>
            )}
          </div>
        </div>
        {primary.has_limitation && (
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/60 rounded-lg p-2">
              <div className="text-xs text-gray-500">Base Deadline</div>
              <div className="font-bold text-gray-800 text-sm">{primary.base_deadline}</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2">
              <div className="text-xs text-gray-500">Effective Deadline</div>
              <div className={`font-bold text-sm ${urgency.color}`}>{primary.effective_deadline}</div>
            </div>
          </div>
        )}
      </div>

      {/* Governing law & explanation */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><Scale className="w-5 h-5 text-rose-600" /> Legal Basis</h3>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge-purple">{rule.category}</span>
            <span className="badge-blue">{rule.subcategory}</span>
          </div>
          <div className="text-sm font-semibold text-gray-800">{rule.case_type}</div>
          <div className="text-xs text-purple-700 font-medium">{rule.governing_law}</div>
          <p className="text-sm text-gray-600 mt-2">{primary.explanation}</p>
          {rule.accrual_rule && (
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 mt-2">
              <div className="text-xs font-medium text-purple-700 mb-1">Accrual Rule (When Limitation Starts)</div>
              <p className="text-xs text-gray-600">{rule.accrual_rule}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {primary.timeline && primary.timeline.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><Calendar className="w-5 h-5 text-rose-600" /> Timeline</h3>
          <div className="space-y-2">
            {primary.timeline.map((t: any, i: number) => (
              <div key={i} className={`flex items-start gap-3 text-sm rounded-lg p-2 ${t.type === 'final' ? 'bg-rose-50 border border-rose-200 font-medium' : t.type === 'today' ? 'bg-blue-50 border border-blue-200' : t.type === 'extension' ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${t.type === 'start' ? 'bg-green-500' : t.type === 'deadline' ? 'bg-orange-500' : t.type === 'final' ? 'bg-red-500' : t.type === 'today' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                <div>
                  {t.date && <span className="text-xs text-gray-500 mr-2">{t.date}</span>}
                  <span className="text-gray-700">{t.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extensions applied */}
      {primary.extensions_applied?.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><Shield className="w-5 h-5 text-rose-600" /> Extensions Applied</h3>
          {primary.extensions_applied.map((ext: any, i: number) => (
            <div key={i} className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 mb-2">
              <div className="text-xs font-semibold text-yellow-800">{ext.type} (+{ext.days_added} days)</div>
              <p className="text-xs text-gray-600 mt-1">{ext.explanation}</p>
              {ext.precedent && <p className="text-[10px] text-purple-600 italic mt-1">{ext.precedent}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Condonation */}
      {primary.condonation && (
        <div className="card bg-orange-50 border-orange-200">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> Condonation of Delay</h3>
          <p className="text-sm text-gray-700">{primary.condonation}</p>
        </div>
      )}

      {/* Available extensions from the rule */}
      {rule.extensions?.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><BookOpen className="w-5 h-5 text-rose-600" /> Available Extension Provisions</h3>
          {rule.extensions.map((ext: string, i: number) => (
            <div key={i} className="text-xs text-gray-600 mb-1 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5" /> {ext}
            </div>
          ))}
        </div>
      )}

      {/* Key precedents */}
      {rule.key_precedents?.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><Scale className="w-5 h-5 text-rose-600" /> Key Precedents</h3>
          {rule.key_precedents.map((p: string, i: number) => (
            <div key={i} className="text-xs text-purple-700 italic mb-1.5 bg-purple-50 rounded-lg p-2 border border-purple-100">{p}</div>
          ))}
        </div>
      )}

      {/* Jurisdiction & Forum */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><MapPin className="w-5 h-5 text-rose-600" /> Jurisdiction & Forum</h3>
        <p className="text-sm text-gray-700 mb-3">{jurInfo.appropriate_forum}</p>
        {jurInfo.filing_requirements && (
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">Filing Requirements</div>
            {jurInfo.filing_requirements.map((r: string, i: number) => (
              <div key={i} className="text-xs text-gray-500 mb-0.5">• {r}</div>
            ))}
          </div>
        )}
      </div>

      {/* Conflict of laws */}
      {result.conflict_of_laws && (
        <div className="card bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2"><Info className="w-5 h-5 text-gray-500" /> Conflict of Laws</h3>
          <p className="text-xs text-gray-600">{result.conflict_of_laws}</p>
        </div>
      )}

      {/* Alternative analyses */}
      {alternatives.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3">Alternative Matching Rules</h3>
          {alternatives.map((alt: any, i: number) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-2">
              <div className="text-sm font-medium text-gray-800">{alt.rule?.case_type}</div>
              <div className="text-xs text-purple-600">{alt.rule?.governing_law}</div>
              {alt.has_limitation ? (
                <div className="text-xs text-gray-500 mt-1">Deadline: {alt.effective_deadline} · {alt.days_remaining >= 0 ? `${alt.days_remaining} days remaining` : `${Math.abs(alt.days_remaining)} days overdue`}</div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">No limitation period</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Methodology */}
      {result.methodology && (
        <div className="text-[10px] text-gray-400 italic bg-gray-50 rounded-lg p-2 border border-gray-100">
          <span className="font-medium text-gray-500">Methodology: </span>{result.methodology}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-500">
        <Info className="w-3.5 h-3.5 inline mr-1" />{result.disclaimer}
      </div>

      <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-2">
        <RotateCcw className="w-4 h-4" /> Calculate Another Deadline
      </button>
    </div>
  )
}
