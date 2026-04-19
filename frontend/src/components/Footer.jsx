import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal">
      <p>
        Built by{' '}
        <a
          href="https://lawreformer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-saffron-500 hover:underline font-medium"
        >
          Rudrani Ghosh
        </a>
        {' · '}
        <a
          href="https://lawreformer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-saffron-500 hover:underline"
        >
          lawreformer.com
        </a>
        {' · © 2026 Rudrani Ghosh. All rights reserved.'}
      </p>
    </footer>
  )
}
