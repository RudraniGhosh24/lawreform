import React from 'react'
import LanguageSelector from './LanguageSelector'

export default function Header({ language, setLanguage, onAboutClick, darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f0a1a]/90 backdrop-blur border-b border-brand-100 dark:border-brand-900">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="https://lawreformer.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl" role="img" aria-label="scales of justice">⚖️</span>
          <h1 className="text-xl font-bold text-text dark:text-white">
            LawReformer <span className="bg-brand-gradient-r bg-clip-text text-transparent">AI</span>
          </h1>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-muted">
          <a href="https://lawreformer.com/situation-advisor" className="hover:text-brand-700 transition-colors">Situation Advisor</a>
          <a href="https://lawreformer.com/simulator" className="hover:text-brand-700 transition-colors">Simulator</a>
          <a href="https://lawreformer.com/clause-analyser" className="hover:text-brand-700 transition-colors">Clause Analyser</a>
          <span className="text-brand-600 font-medium border-b-2 border-brand-500 pb-0.5">AI Assistant</span>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector language={language} setLanguage={setLanguage} />

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            onClick={onAboutClick}
            className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center text-lg font-bold text-brand-600"
            aria-label="About Lawreformer AI"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  )
}
