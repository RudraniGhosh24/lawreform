import React from 'react'

const LANGUAGES = [
  { code: 'English', label: 'EN', full: 'English' },
  { code: 'Hindi', label: 'हिंदी', full: 'Hindi' },
  { code: 'Bengali', label: 'বাংলা', full: 'Bengali' },
]

export default function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-brand-200 dark:border-brand-800" role="radiogroup" aria-label="Select language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-2 text-sm font-medium transition-colors min-w-[48px] min-h-[44px] ${
            language === lang.code
              ? 'bg-brand-gradient text-white'
              : 'bg-white dark:bg-brand-950 text-text-muted hover:bg-brand-50 dark:hover:bg-brand-900'
          }`}
          role="radio"
          aria-checked={language === lang.code}
          aria-label={lang.full}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
