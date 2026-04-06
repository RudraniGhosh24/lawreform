'use client'
import { Brain, Scale, Users, GitBranch, TrendingUp, ShieldAlert, AlertTriangle, CheckCircle, XCircle, RotateCcw, Info, Clock } from 'lucide-react'

interface Props { result: any; onReset: () => void }

export default function LREResult({ result, onReset }: Props) {
  const pred = result.prediction || {}
  const prec = result.precedents || []
  const judge = result.judge_behavior || {}
  const cf = result.counterfactual_base || {}
  const trends = result.trends || []
  const fair = result.fairness || {}
  const hurdles = result.hurdles || []
  const caseInfo = result.case_info || {}

  const riskColor = pred.success_probability >= 60 ? 'text-green-600' : pred.success_probability >= 40 ? 'text-yellow-600' : 'text-red-600'
  const riskBg = pred.success_probability >= 60 ? 'bg-green-50 border-green-200' : pred.success_probability >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  return (
    <div className="space-y-5">
      {/* ===== SUMMARY ===== */}
      <div className={`card border ${riskBg}`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge-purple">{caseInfo.case_type?.toUpperCase()}</span>
          <span className="badge bg-gray-100 text-gray-600">{caseInfo.max_severity} severity</span>
          {caseInfo.has_non_bailable && <span className="badge bg-red-100 text-red-700">Non-Bailable</span>}
          {caseInfo.sections_found?.length > 0 && (
            <span className="badge bg-violet-100 text-violet-700">{caseInfo.sections_found.length} section(s) detected</span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className={`text-2xl sm:text-3xl font-bold ${riskColor}`}>{pred.success_probability}%</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{pred.outcome_label}</div>
          </div>
          {pred.bail_probability !== undefined && (
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${pred.bail_probability >= 50 ? 'text-green-600' : 'text-red-600'}`}>{pred.bail_probability}%</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{pred.bail_label}</div>
            </div>
          )}
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600"><Clock className="w-5 h-5 sm:w-6 sm:h-6 inline" /></div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{pred.estimated_duration}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">{hurdles.length}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Legal Hurdles</div>
          </div>
        </div>
        {caseInfo.key_facts?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {caseInfo.key_facts.map((f: string, i: number) => <span key={i} className="badge-blue text-xs">{f}</span>)}
          </div>
        )}
        {caseInfo.sections_found?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {caseInfo.section_details?.map((s: any, i: number) => (
              <span key={i} className="badge-purple text-xs">S.{caseInfo.sections_found[i]} — {s.title}</span>
            ))}
          </div>
        )}
      </div>

      {/* ===== 1. PREDICTION ===== */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Brain className="w-5 h-5 text-violet-600" /> Outcome Prediction</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Success Probability</div>
            <div className={`text-3xl sm:text-4xl font-bold ${riskColor}`}>{pred.success_probability}%</div>
            {pred.confidence_interval && <div className="text-xs text-gray-400 mt-1">95% CI: {pred.confidence_interval}</div>}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div className={`h-3 rounded-full ${pred.success_probability >= 60 ? 'bg-green-500' : pred.success_probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${pred.success_probability}%` }} />
            </div>
            <div className="text-sm text-gray-600 mt-2">{pred.outcome_label}</div>
          </div>
          {pred.bail_probability !== undefined && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Bail Probability</div>
              <div className={`text-3xl sm:text-4xl font-bold ${pred.bail_probability >= 50 ? 'text-green-600' : 'text-red-600'}`}>{pred.bail_probability}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div className={`h-3 rounded-full ${pred.bail_probability >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${pred.bail_probability}%` }} />
              </div>
              <div className="text-sm text-gray-600 mt-2">{pred.bail_label}</div>
            </div>
          )}
        </div>

        {/* Duration breakdown */}
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 mt-3">
          <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-blue-500" /><span className="text-sm font-medium text-gray-700">Estimated Duration: <span className="text-blue-700">{pred.estimated_duration}</span></span></div>
          {pred.duration_breakdown && (
            <div className="mt-2 space-y-0.5">
              {pred.duration_breakdown.map((d: string, i: number) => (
                <div key={i} className="text-[10px] text-gray-500">• {d}</div>
              ))}
            </div>
          )}
        </div>

        {/* Factor breakdown */}
        {pred.factors && pred.factors.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-700 mb-2">Factor Analysis (8 factors)</div>
            <div className="space-y-2">
              {pred.factors.map((f: any, i: number) => (
                <details key={i} className="bg-gray-50 rounded-lg border border-gray-200">
                  <summary className="p-2.5 cursor-pointer flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">{f.factor}: {f.value}</span>
                    <span className={`font-mono text-xs ${f.effect >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {f.effect >= 0 ? '+' : ''}{(f.effect * 100).toFixed(1)}%
                    </span>
                  </summary>
                  <div className="px-2.5 pb-2.5 border-t border-gray-200 pt-2 space-y-1">
                    <p className="text-[11px] text-gray-600">{f.reasoning}</p>
                    <p className="text-[10px] text-purple-600 italic">{f.legal_basis}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Bail factors */}
        {pred.bail_factors && (
          <div className="mt-3 bg-violet-50 rounded-xl p-3 border border-violet-200">
            <div className="text-xs font-semibold text-violet-700 mb-1">Bail Factor Breakdown</div>
            {pred.bail_factors.map((f: string, i: number) => (
              <div key={i} className="text-[10px] text-gray-600">• {f}</div>
            ))}
            {pred.bail_legal_framework && (
              <div className="text-[10px] text-purple-600 italic mt-1">{pred.bail_legal_framework}</div>
            )}
          </div>
        )}

        {/* Methodology */}
        {pred.methodology && (
          <div className="mt-3 text-[10px] text-gray-400 italic bg-gray-50 rounded-lg p-2 border border-gray-100">
            <span className="font-medium text-gray-500">Methodology: </span>{pred.methodology}
          </div>
        )}
      </div>

      {/* ===== 2. PRECEDENTS ===== */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Scale className="w-5 h-5 text-violet-600" /> Similar Precedents ({prec.cases?.length || 0})</h3>
        {prec.methodology && <p className="text-[10px] text-gray-400 italic mb-3">{prec.methodology}</p>}
        {(!prec.cases || prec.cases.length === 0) && <p className="text-gray-500 text-sm">No closely matching precedents found.</p>}
        <div className="space-y-3">
          {(prec.cases || []).map((p: any, i: number) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3 sm:p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{p.title}</div>
                  <div className="text-xs text-gray-400">{p.court} · {p.year} · {p.state}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`badge text-xs ${p.outcome === 'conviction' || p.outcome === 'granted' || p.outcome === 'decreed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.outcome}
                  </span>
                  <span className="text-[10px] text-gray-400">{p.applicability}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">{p.key_facts}</p>
              {p.ratio_decidendi && (
                <div className="text-[11px] text-purple-700 italic bg-purple-50 rounded-lg p-2 border border-purple-100 mb-2">
                  <span className="font-medium not-italic">Ratio Decidendi: </span>{p.ratio_decidendi}
                </div>
              )}
              {p.relevance_reasons && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {p.relevance_reasons.map((r: string, j: number) => <span key={j} className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{r}</span>)}
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{p.duration_months} months</span>
                <span>Relevance: {p.relevance_score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 3. JUDGE BEHAVIOR ===== */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-violet-600" /> Judge Behavior — {judge.court}</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-violet-600">{judge.bail_grant_rate}%</div>
            <div className="text-xs text-gray-500 mt-1">Bail Grant Rate</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{judge.avg_decision_days}d</div>
            <div className="text-xs text-gray-500 mt-1">Avg Decision Time</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-xl p-3 border border-red-100">
            <div className="text-xs font-medium text-red-700 mb-1">Strict On</div>
            {judge.strict_on?.map((s: string, i: number) => <div key={i} className="text-xs text-gray-700">• {s}</div>)}
          </div>
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <div className="text-xs font-medium text-green-700 mb-1">Lenient On</div>
            {judge.lenient_on?.map((s: string, i: number) => <div key={i} className="text-xs text-gray-700">• {s}</div>)}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">Interpretation style: <span className="font-medium text-gray-700 capitalize">{judge.interpretation_style}</span></div>
      </div>

      {/* ===== 4. COUNTERFACTUAL ===== */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><GitBranch className="w-5 h-5 text-violet-600" /> Counterfactual — "What If?"</h3>
        <p className="text-xs text-gray-500 mb-3">How would the outcome change if key factors were different?</p>
        <div className="bg-violet-50 rounded-xl p-3 border border-violet-200 mb-3">
          <div className="text-sm font-medium text-violet-700">Current: {cf.current_success}% success · {cf.current_duration} months est.</div>
          {cf.current_bail != null && <div className="text-xs text-violet-600 mt-1">Bail: {cf.current_bail}%</div>}
        </div>
        <div className="space-y-2">
          {cf.modifiable_factors?.map((f: any, i: number) => (
            <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <GitBranch className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-gray-800">{f.label}</div>
                <div className="text-[10px] text-gray-500">{f.impact}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 italic mt-2">Modify your inputs and re-analyze to see how outcomes change.</p>
      </div>

      {/* ===== 5. TRENDS ===== */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-violet-600" /> Legal Trends</h3>
        <div className="space-y-4">
          {trends.map((t: any, i: number) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3 bg-gray-50">
              <span className={`badge text-xs mb-2 inline-block ${t.trend === 'liberalizing' || t.trend === 'strengthening' ? 'bg-green-100 text-green-700' : t.trend === 'slow_resolution' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {t.trend.replace(/_/g, ' ')}
              </span>
              <p className="text-xs text-gray-700 mb-3">{t.description}</p>
              <div className="flex items-end gap-1 h-14">
                {t.values.map((v: number, j: number) => (
                  <div key={j} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-violet-400 rounded-t transition-all" style={{ height: `${Math.max(v * 0.5, 4)}px` }} />
                    <span className="text-[8px] text-gray-400 mt-1">{t.years[j]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 6. FAIRNESS ===== */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><ShieldAlert className="w-5 h-5 text-violet-600" /> Bias & Fairness — {fair.state}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Bail Rate', state: fair.state_stats?.bail_rate, nat: fair.national_avg?.bail_rate, suffix: '%' },
            { label: 'Avg Duration', state: fair.state_stats?.avg_duration_months, nat: fair.national_avg?.avg_duration_months, suffix: ' mo' },
            { label: 'Conviction', state: fair.state_stats?.conviction_rate, nat: fair.national_avg?.conviction_rate, suffix: '%' },
            { label: 'Pendency', state: fair.state_stats?.pendency_rate, nat: fair.national_avg?.pendency_rate, suffix: '%' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-gray-500">{s.label}</div>
              <div className="text-lg font-bold text-gray-800">{s.state}{s.suffix}</div>
              <div className="text-[9px] text-gray-400">Nat: {s.nat}{s.suffix}</div>
            </div>
          ))}
        </div>
        {fair.disparities?.length > 0 && (
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
            <div className="text-xs font-medium text-orange-700 mb-1">Regional Disparities</div>
            {fair.disparities.map((d: string, i: number) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700 mb-1.5">
                <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" /> {d}
              </div>
            ))}
          </div>
        )}
        {fair.statistical_notes && (
          <div className="mt-2 space-y-0.5">
            <div className="text-[10px] font-medium text-gray-500">Statistical Summary</div>
            {fair.statistical_notes.map((n: string, i: number) => (
              <div key={i} className="text-[10px] text-gray-400 font-mono">• {n}</div>
            ))}
          </div>
        )}
        {fair.methodology && (
          <div className="mt-2 text-[10px] text-gray-400 italic bg-gray-50 rounded-lg p-2 border border-gray-100">
            <span className="font-medium text-gray-500">Methodology: </span>{fair.methodology}
          </div>
        )}
      </div>

      {/* ===== 7. HURDLES ===== */}
      <div className="card">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-violet-600" /> Legal Hurdles ({hurdles.length})</h3>
        <div className="space-y-2">
          {hurdles.map((h: any, i: number) => (
            <div key={i} className={`rounded-xl border p-3 ${h.severity === 'High' ? 'bg-red-50 border-red-200' : h.severity === 'Medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge text-[10px] ${h.severity === 'High' ? 'bg-red-100 text-red-700' : h.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{h.severity}</span>
                <span className="font-semibold text-gray-800 text-xs">{h.hurdle}</span>
              </div>
              <p className="text-[11px] text-gray-600 mb-1.5">{h.description}</p>
              <div className="text-[11px] bg-white/70 rounded-lg p-2 border border-gray-200">
                <span className="font-medium text-green-700">Suggestion: </span>{h.suggestion}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-500">
        <Info className="w-3.5 h-3.5 inline mr-1" />{result.disclaimer}
      </div>

      <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-2">
        <RotateCcw className="w-4 h-4" /> Analyze Another Case
      </button>
    </div>
  )
}
