import React from 'react'
import LanguageSelector from './LanguageSelector'

export default function Header({ language, setLanguage, onAboutClick, darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f0a1a]/90 backdrop-blur border-b border-brand-100 dark:border-brand-900">
      <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-between">
        <a href="https://lawreformer.com" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <span className="text-lg" role="img" aria-label="scales of justice">⚖️</span>
          <span className="text-base font-bold text-text dark:text-white">
            LawReformer <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">AI</span>
          </span>
        </a>

        <div className="flex items-center gap-1.5">
          <LanguageSelector language={language} setLanguage={setLanguage} />

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center text-sm"
            aria-label={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            onClick={onAboutClick}
            className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center text-sm font-bold text-brand-600"
            aria-label="About"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  )
}
