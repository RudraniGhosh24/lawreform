import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta */}
        <meta name="description" content="LawReformer AI — Free voice-enabled legal rights assistant for India. Speak in Hindi, Bengali, Tamil, Telugu or any Indian language and understand your legal rights instantly. Powered by Gemma 4." />
        <meta name="keywords" content="legal rights India, free legal aid, know your rights, RTI, MGNREGA, domestic violence help, minimum wage India, tenant rights, consumer rights, legal assistant AI, Gemma 4, LawReformer, Rudrani Ghosh" />
        <meta name="author" content="Rudrani Ghosh" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#9333ea" />
        <link rel="canonical" href="https://ai.lawreformer.com" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai.lawreformer.com" />
        <meta property="og:title" content="LawReformer AI — Know Your Legal Rights in India" />
        <meta property="og:description" content="Free voice-enabled legal rights assistant. Speak in any Indian language — get plain-language explanations of your rights, grounded in real Indian law. Powered by Gemma 4." />
        <meta property="og:site_name" content="LawReformer AI" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LawReformer AI — Know Your Legal Rights in India" />
        <meta name="twitter:description" content="Free voice-enabled legal rights assistant for India. Speak in Hindi, Bengali, Tamil or any language. Powered by Gemma 4." />

        {/* Structured Data — WebApplication */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "LawReformer AI",
          "url": "https://ai.lawreformer.com",
          "description": "Free voice-enabled legal rights assistant for underserved communities in India. Supports Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Odia, Urdu, and English.",
          "applicationCategory": "LegalService",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
          "author": { "@type": "Person", "name": "Rudrani Ghosh", "url": "https://lawreformer.com" },
          "inLanguage": ["en", "hi", "bn", "ta", "te", "kn", "ml", "mr", "gu", "pa", "or", "ur"],
          "isAccessibleForFree": true
        })}} />

        {/* Structured Data — FAQPage for common queries */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How do I file an RTI in India?", "acceptedAnswer": { "@type": "Answer", "text": "File an RTI application at rtionline.gov.in with a fee of Rs 10. Response must come within 30 days under the Right to Information Act, 2005." }},
            { "@type": "Question", "name": "What are my rights if my landlord won't return my deposit?", "acceptedAnswer": { "@type": "Answer", "text": "Under the Rent Control Act, your landlord cannot withhold your security deposit without valid reason. You can file a complaint with the Rent Controller of your district." }},
            { "@type": "Question", "name": "What is the minimum wage in India?", "acceptedAnswer": { "@type": "Answer", "text": "Under the Code on Wages 2019, every employer must pay at least the minimum wage. Rates vary by state. Complaint: Labour Commissioner, helpline 14434." }},
            { "@type": "Question", "name": "How to get free legal aid in India?", "acceptedAnswer": { "@type": "Answer", "text": "Under the Legal Services Authorities Act 1987, free legal aid is available for SC/ST, women, children, disabled, and low-income individuals. Contact your District Legal Services Authority (DLSA) or call 15100." }}
          ]
        })}} />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
