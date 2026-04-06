import { Scale, Shield, BookOpen, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">About LawReformer</h1>
        <p className="text-gray-500">A legal education and research platform built for everyone.</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">What is LawReformer?</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            LawReformer is an interactive legal education and research platform. It is not a chatbot and not a law firm. It uses rule-based engines built on actual legal statutes to help you understand legal scenarios, rights, and potential outcomes across India, UK, and US jurisdictions.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Legal literacy is a right, not a privilege. Most people — especially younger generations — don't know their rights, don't know what to do in emergencies, and can't afford legal counsel. LawReformer bridges that gap with structured, educational, and actionable legal tools.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Important Disclaimer</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            LawReformer is for educational and informational purposes only. It does not constitute legal advice and does not create a lawyer-client relationship. For serious legal matters, always consult a qualified legal professional in your jurisdiction.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Jurisdictions Covered</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { flag: '🇮🇳', name: 'India', laws: ['Bharatiya Nyaya Sanhita (BNS) 2023', 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023', 'Indian Contract Act', 'Hindu Marriage Act', 'Protection of Women from DV Act'] },
              { flag: '🇬🇧', name: 'United Kingdom', laws: ['Tort Law (Common Law)', 'Theft Act 1968', 'Family Law Act 1996', 'Contracts Act', 'Sexual Offences Act 2003'] },
              { flag: '🇺🇸', name: 'United States', laws: ['Federal Criminal Code', 'UCC (Contract Law)', 'State Family Codes', 'Tort Reform Acts', 'Good Samaritan Laws'] },
            ].map(j => (
              <div key={j.name} className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl mb-2">{j.flag}</div>
                <div className="font-semibold text-gray-800 mb-2">{j.name}</div>
                <ul className="space-y-1">
                  {j.laws.map(l => <li key={l} className="text-xs text-gray-500">• {l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
