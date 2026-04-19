import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 text-center text-sm text-text-muted border-t border-brand-100 dark:border-brand-900 bg-white dark:bg-[#0f0a1a]">
      <p>
        Built by{' '}
        <a
          href="https://lawreformer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:underline font-medium"
        >
          Rudrani Ghosh
        </a>
        {' · owner of '}
        <a
          href="https://lawreformer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:underline"
        >
          lawreformer.com
        </a>
        {' for '}
        <a
          href="https://www.kaggle.com/competitions/gemma-4-good-hackathon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:underline"
        >
          The Gemma 4 Good Hackathon
        </a>
        {' · '}
        <a
          href="https://github.com/RudraniGhosh24/lawreform"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:underline"
        >
          GitHub Code
        </a>
      </p>
    </footer>
  )
}
