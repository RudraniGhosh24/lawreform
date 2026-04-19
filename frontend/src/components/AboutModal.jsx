import React from 'react'

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="About Lawreformer AI"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-charcoal dark:text-offwhite">
            About Lawreformer AI
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-w-[44px] min-h-[44px] flex items-center justify-center text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <p>
            <strong>Lawreformer AI</strong> is created and owned by{' '}
            <a href="https://lawreformer.com" target="_blank" rel="noopener noreferrer" className="text-saffron-500 hover:underline font-medium">
              Rudrani Ghosh
            </a>
            , an Indian developer building tools for legal access.
          </p>

          <p>
            This tool was submitted to the{' '}
            <strong>Kaggle Gemma 4 Good Hackathon 2026</strong> under the
            Digital Equity &amp; Inclusivity track.
          </p>

          <p>
            It helps people in India who cannot afford lawyers understand their
            legal rights in plain language — using voice input in English, Hindi,
            and Bengali, powered by Gemma 4 and grounded in real Indian law.
          </p>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by Gemma 4 · RAG with ChromaDB · Web Speech API
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Website:{' '}
              <a href="https://lawreformer.com" target="_blank" rel="noopener noreferrer" className="text-saffron-500 hover:underline">
                lawreformer.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
