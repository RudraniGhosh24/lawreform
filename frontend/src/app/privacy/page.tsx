export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="card space-y-4 text-gray-600 leading-relaxed">
        <p>LawReformer.com takes your privacy seriously. This policy explains what data we collect and how we use it.</p>
        <h2 className="text-lg font-bold text-gray-800">Data We Collect</h2>
        <p>We collect only the information you provide through our tools — your scenario inputs, jurisdiction selections, and answers. We do not collect personally identifiable information unless you voluntarily provide it.</p>
        <h2 className="text-lg font-bold text-gray-800">How We Use Data</h2>
        <p>Scenario data is used solely to generate your legal analysis. We may use anonymised, aggregated data to improve our decision engines. We do not sell your data to third parties.</p>
        <h2 className="text-lg font-bold text-gray-800">Cookies</h2>
        <p>We use minimal session cookies to maintain your analysis session. No tracking cookies are used.</p>
        <h2 className="text-lg font-bold text-gray-800">Contact</h2>
        <p>For privacy concerns, contact us at privacy@lawreformer.com</p>
      </div>
    </div>
  )
}
