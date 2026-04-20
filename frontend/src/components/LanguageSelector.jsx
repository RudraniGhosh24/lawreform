import React, { useState } from 'react'

const LANGUAGES = [
  { code: 'Auto', label: '🔍 Auto', full: 'Auto-detect' },
  { code: 'English', label: 'EN', full: 'English' },
  { code: 'Hindi', label: 'हिंदी', full: 'Hindi' },
  { code: 'Bengali', label: 'বাংলা', full: 'Bengali' },
  { code: 'Tamil', label: 'தமிழ்', full: 'Tamil' },
  { code: 'Telugu', label: 'తెలుగు', full: 'Telugu' },
  { code: 'Kannada', label: 'ಕನ್ನಡ', full: 'Kannada' },
  { code: 'Malayalam', label: 'മലയാളം', full: 'Malayalam' },
  { code: 'Marathi', label: 'मराठी', full: 'Marathi' },
  { code: 'Gujarati', label: 'ગુજરાતી', full: 'Gujarati' },
  { code: 'Punjabi', label: 'ਪੰਜਾਬੀ', full: 'Punjabi' },
  { code: 'Odia', label: 'ଓଡ଼ିଆ', full: 'Odia' },
  { code: 'Urdu', label: 'اردو', full: 'Urdu' },
]

export default function LanguageSelector({ language, setLanguage }) {
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors min-h-[36px]"
        aria-label="Select language"
      >
        {current.label} <span className="text-[10px] opacity-60">▼</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-[100] bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-xl shadow-lg py-1 min-w-[140px] max-h-[300px] overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  language === lang.code
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium'
                    : 'text-text-muted hover:bg-brand-50 dark:hover:bg-brand-900/20'
                }`}
              >
                {lang.label} <span className="text-xs text-text-light ml-1">{lang.full}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
