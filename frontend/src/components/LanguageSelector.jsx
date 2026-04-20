import React, { useState } from 'react'

const LANGUAGES = [
  { code: 'English', label: 'EN' },
  { code: 'Hindi', label: 'हिंदी' },
  { code: 'Bengali', label: 'বাংলা' },
  { code: 'Tamil', label: 'தமிழ்' },
  { code: 'Telugu', label: 'తెలుగు' },
  { code: 'Marathi', label: 'मराठी' },
  { code: 'Gujarati', label: 'ગુજરાતી' },
  { code: 'Kannada', label: 'ಕನ್ನಡ' },
  { code: 'Malayalam', label: 'മലയാളം' },
  { code: 'Punjabi', label: 'ਪੰਜਾਬੀ' },
  { code: 'Odia', label: 'ଓଡ଼ିଆ' },
  { code: 'Assamese', label: 'অসমীয়া' },
  { code: 'Urdu', label: 'اردو' },
]

export default function LanguageSelector({ language, setLanguage }) {
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors min-h-[40px]"
        aria-label="Select language"
      >
        {current.label}
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-50 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-xl shadow-lg py-1 max-h-[60vh] overflow-y-auto w-36">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  language === lang.code
                    ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-medium'
                    : 'text-text-muted hover:bg-brand-50 dark:hover:bg-brand-900/30'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
