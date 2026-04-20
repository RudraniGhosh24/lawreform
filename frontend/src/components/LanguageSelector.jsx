import React, { useState } from 'react'

const LANGUAGES = [
  { code: 'English', label: 'EN', flag: '🇺🇸' },
  { code: 'Hindi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'Bengali', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'Tamil', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'Telugu', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'Marathi', label: 'मराठी', flag: '🇮🇳' },
  { code: 'Kannada', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'Gujarati', label: 'ગુજરાતી', flag: '🇮🇳' },
]

export default function LanguageSelector({ language, setLanguage }) {
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative z-[60]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors min-h-[36px] shadow-sm"
        aria-label="Select language"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-[10px] opacity-60">▼</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[59]" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-[60] bg-white dark:bg-[#1a1025] border border-brand-200 dark:border-brand-800 rounded-xl shadow-2xl py-1 w-[180px] max-h-[70vh] overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false) }}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                  language === lang.code
                    ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-200 font-semibold'
                    : 'text-text dark:text-brand-100 hover:bg-brand-50 dark:hover:bg-brand-900/30'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                <span className="text-[10px] text-text-muted ml-auto">{lang.code}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
