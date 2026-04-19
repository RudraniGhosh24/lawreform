import React from 'react'
import LanguageSelector from './LanguageSelector'

export default function Header({ language, setLanguage, onAboutClick, darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-charcoal/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="scales of justice">⚖️</span>
          <h1 className="text-xl font-bold text-charcoal dark:text-offwhite">
            Lawreformer <span className="text-saffron-500">AI</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector language={language} setLanguage={setLanguage} />

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            onClick={onAboutClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center text-lg font-bold text-saffron-500"
            aria-label="About Lawreformer AI"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  )
}
