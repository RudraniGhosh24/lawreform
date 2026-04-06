import Link from 'next/link'
import { Scale, AlertTriangle, Globe, ArrowRight, Shield, BookOpen, Zap, FileText, Brain } from 'lucide-react'

const tools = [
  {
    icon: Scale,
    title: 'Situation Advisor',
    desc: 'Structured scenario analysis across Tort, Criminal, Family & Contract law for India, UK, and US. Get classified outcomes, risk levels, and actionable steps.',
    href: '/situation-advisor',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'Core Tool',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Simulator',
    desc: 'Interactive real-world scenario simulations. Learn exactly what to do in accidents, fraud, harassment, drowning, and more — with legal + ethical consequences.',
    href: '/simulator',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'Simulation',
  },
  {
    icon: FileText,
    title: 'Clause Analyser',
    desc: 'Paste any contract clause and get instant risk detection, red flags, hidden implications, legal validity checks, and suggested fixes — by jurisdiction.',
    href: '/clause-analyser',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'Contract Tool',
  },
  {
    icon: Brain,
    title: 'Legal Reality Engine',
    desc: 'Predictive legal analysis for India. Outcome prediction, precedent matching, judge behavior, counterfactual simulation, trends, and fairness — all in one.',
    href: '/legal-reality-engine',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'India Only',
  },
  {
    icon: Scale,
    title: 'Limitation Engine',
    desc: 'Calculate exact legal deadlines with statutory citations, COVID extensions, disability tolling, condonation rules, and jurisdiction mapping across India, UK, and US.',
    href: '/limitation-engine',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'Deadline Tool',
  },
  {
    icon: Globe,
    title: 'Weird Laws Explorer',
    desc: 'Discover bizarre, funny, and outdated laws from around the world. Shareable cards, random generator, and real-world implications.',
    href: '/weird-laws',
    color: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    badge: 'Educational',
  },
]

const stats = [
  { label: 'Jurisdictions', value: '3', sub: 'India · UK · US' },
  { label: 'Law Areas', value: '4', sub: 'Tort · Criminal · Family · Contract' },
  { label: 'Scenarios', value: '20+', sub: 'Emergency simulations' },
  { label: 'Laws Catalogued', value: '410+', sub: 'Weird laws worldwide' },
]

const features = [
  { icon: Shield, title: 'Rule-Based Engine', desc: 'Decision trees built on actual legal statutes, not guesswork.' },
  { icon: Zap, title: 'Instant Analysis', desc: 'Structured inputs produce structured, actionable outputs in seconds.' },
  { icon: BookOpen, title: 'Educational First', desc: 'Teaches legal literacy to everyone, including younger generations.' },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="pt-12 sm:pt-20 pb-10 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Legal Education & Research Platform
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
          Know Your Rights.<br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Make the Right Call.
          </span>
        </h1>
        <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-4">
          Interactive legal education across India, UK, and US. Not a chatbot — a research-grade engine that helps you understand legal scenarios, rights, and outcomes through structured analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link href="/situation-advisor" className="btn-primary flex items-center justify-center gap-2">
            Explore a Scenario <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/simulator" className="btn-secondary flex items-center justify-center gap-2">
            Run Emergency Simulation
          </Link>
        </div>
        <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400">For educational purposes only · Not a law firm · No attorney-client relationship</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-12 sm:mb-20">
        {stats.map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{s.value}</div>
            <div className="font-semibold text-gray-700 mt-1">{s.label}</div>
            <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* Tools */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Six Powerful Tools</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Each tool is purpose-built for a different kind of legal need — from formal analysis to emergency response to contract review to legal curiosity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map(t => (
            <Link key={t.href} href={t.href}
              className={`card-hover ${t.bg} border ${t.border} flex flex-col`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4`}>
                <t.icon className="w-6 h-6 text-white" />
              </div>
              <span className="badge-purple text-xs mb-3 self-start">{t.badge}</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{t.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-purple-600 font-medium text-sm">
                Open Tool <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-20">
        <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Why LawReformer is Different</h2>
            <p className="text-gray-500">Built on legal logic, not language model guessing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jurisdictions */}
      <section className="mb-20 text-center">
        <h2 className="section-title mb-3">Covering Three Major Jurisdictions</h2>
        <p className="text-gray-500 mb-8">Each jurisdiction has its own legal framework, statutes, and precedents — we handle all three.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { flag: '🇮🇳', name: 'India', laws: 'BNS, BNSS, BSA, Hindu Marriage Act, Indian Contract Act' },
            { flag: '🇬🇧', name: 'United Kingdom', laws: 'Tort Law, Theft Act, Family Law Act, Contracts Act' },
            { flag: '🇺🇸', name: 'United States', laws: 'Federal & State law, UCC, Family Code, Penal Code' },
          ].map(j => (
            <div key={j.name} className="card text-center">
              <div className="text-5xl mb-3">{j.flag}</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{j.name}</h3>
              <p className="text-xs text-gray-400">{j.laws}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="mb-20 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-2xl md:text-3xl font-light text-gray-800 italic leading-relaxed">
            "There are no facts, only interpretations."
          </p>
          <p className="text-sm text-gray-600 mt-3">— Friedrich Nietzsche</p>
          <p className="text-xs text-gray-700 mt-4 max-w-md mx-auto">The law is no different. Every situation has multiple perspectives. We help you understand yours.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-20">
        <div className="card bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center border-0">
          <h2 className="text-3xl font-bold mb-3">Ready to learn about your legal situation?</h2>
          <p className="text-purple-100 mb-6">Understand your rights. Learn the law. Make informed decisions.</p>
          <Link href="/situation-advisor" className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all">
            Start Exploring <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
