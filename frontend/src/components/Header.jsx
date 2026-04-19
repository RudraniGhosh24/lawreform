import React, { useState } from 'react'
import LanguageSelector from './LanguageSelector'

export default function Header({ language, setLanguage, onAboutClick, darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Floating menu button — always visible, top-left */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-3 left-3 z-50 p-2 rounded-xl bg-white/90 dark:bg-[#0f0a1a]/90 backdrop-blur border border-brand-200 dark:border-brand-800 shadow-md hover:shadow-lg transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Floating language + dark mode — top-right */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5">
        <LanguageSelector language={language} setLanguage={setLanguage} />
        <button onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-white/90 dark:bg-[#0f0a1a]/90 backdrop-blur border border-brand-200 dark:border-brand-800 shadow-md hover:shadow-lg transition-all min-w-[40px] min-h-[40px] flex items-center justify-center text-sm"
          aria-label={darkMode ? 'Light mode' : 'Dark mode'}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Side menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <nav
            className="relative w-64 max-w-[80vw] bg-white dark:bg-[#0f0a1a] h-full shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-100 dark:border-brand-900">
              <a href="https://lawreformer.com" className="font-bold text-text dark:text-white flex items-center gap-1.5">
                <span>⚖️</span> LawReformer <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">AI</span>
              </a>
              <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 text-text-muted" aria-label="Close menu">✕</button>
            </div>

            <div className="flex-1 py-2 overflow-y-auto">
              <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-light font-semibold">AI Tools</p>
              <a href="https://ai.lawreformer.com" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30">🤖 AI Assistant</a>

              <p className="px-4 py-2 mt-3 text-[10px] uppercase tracking-wider text-text-light font-semibold">LawReformer Tools</p>
              <a href="https://lawreformer.com/situation-advisor" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">📋 Situation Advisor</a>
              <a href="https://lawreformer.com/simulator" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">🚨 Emergency Simulator</a>
              <a href="https://lawreformer.com/clause-analyser" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">📝 Clause Analyser</a>
              <a href="https://lawreformer.com/legal-reality-engine" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">⚙️ Legal Reality Engine</a>
              <a href="https://lawreformer.com/limitation-engine" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">⏰ Deadlines</a>
              <a href="https://lawreformer.com/weird-laws" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">🤪 Weird Laws</a>

              <p className="px-4 py-2 mt-3 text-[10px] uppercase tracking-wider text-text-light font-semibold">Info</p>
              <button onClick={() => { onAboutClick(); setMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-left">ℹ️ About</button>
              <a href="https://lawreformer.com" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">🏠 lawreformer.com</a>
            </div>

            <div className="px-4 py-3 border-t border-brand-100 dark:border-brand-900 text-[10px] text-text-light">
              Powered by Gemma 4 · Built by Rudrani Ghosh
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
