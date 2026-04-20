import React, { useState } from 'react'

const LANGUAGES = [
  { code: 'English', label: 'EN' },
  { code: 'Hindi', label: 'हिं' },
  { code: 'Bengali', label: 'বাং' },
  { code: 'Tamil', label: 'தமி' },
  { code: 'Telugu', label: 'తెలు' },
  { code: 'Marathi', label: 'मरा' },
  { code: 'Kannada', label: 'ಕನ್' },
  { code: 'Gujarati', label: 'ગુજ' },
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
        {current.label} ▾
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-50 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-xl shadow-lg py-1 min-w-[140px]">
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
                {lang.label} {lang.code}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
