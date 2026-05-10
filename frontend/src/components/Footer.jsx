import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full py-3 px-4 text-center border-t border-brand-100 dark:border-brand-900 bg-white dark:bg-[#0f0a1a]">
      <p className="text-sm text-text-muted">
        Built by{' '}
        <a href="https://lawreformer.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-medium">
          Rudrani Ghosh
        </a>
        {' · owner of '}
        <a href="https://lawreformer.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
          lawreformer.com
        </a>
        {' for '}
        <a href="https://www.kaggle.com/competitions/gemma-4-good-hackathon" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
          Kaggle Hackathon
        </a>
        {' · '}
        <a href="https://github.com/RudraniGhosh24/lawreform" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
          GitHub Code
        </a>
      </p>
      <p className="text-[9px] text-text-light mt-1">
        AI-powered legal information assistant.
      </p>
    </footer>
  )
}
