import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LegalDisclaimer from '@/components/LegalDisclaimer'

export const metadata: Metadata = {
  title: 'LawReformer — Legal Education & Research Platform',
  description: 'Interactive legal education across India, UK, and US jurisdictions. Scenario-based learning, emergency simulations, contract analysis, and legal research tools.',
  keywords: 'legal education, law, India law, UK law, US law, tort, criminal, family law, contract law, legal research',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <LegalDisclaimer />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
