import React from 'react'

const LANGUAGES = [
  { code: 'English', label: 'EN', full: 'English' },
  { code: 'Hindi', label: 'हिंदी', full: 'Hindi' },
  { code: 'Bengali', label: 'বাংলা', full: 'Bengali' },
]

export default function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600" role="radiogroup" aria-label="Select language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-2 text-sm font-medium transition-colors min-w-[48px] min-h-[44px] ${
            language === lang.code
              ? 'bg-saffron-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
