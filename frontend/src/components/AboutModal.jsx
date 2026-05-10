import React from 'react'

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="About LawReformer AI"
    >
      <div
        className="bg-white dark:bg-brand-950 rounded-2xl max-w-md w-full p-6 shadow-xl border border-brand-100 dark:border-brand-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text dark:text-white">
            About LawReformer AI
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900 min-w-[44px] min-h-[44px] flex items-center justify-center text-xl text-text-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-text-muted text-sm leading-relaxed">
          <p>
            <strong className="text-text dark:text-white">LawReformer AI</strong> is created and owned by{' '}
            <a href="https://lawreformer.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-medium">
              Rudrani Ghosh
            </a>
            , an Indian developer building tools for legal access.
          </p>

          <p>
            This tool was submitted to the{' '}
            <strong className="text-text dark:text-white">Kaggle Hackathon 2026</strong> under the
            Digital Equity &amp; Inclusivity track.
          </p>

          <p>
            It helps people in India who cannot afford lawyers understand their
            legal rights in plain language — using voice input in English, Hindi,
            and Bengali, powered by AI and grounded in real Indian law.
          </p>

          <div className="pt-2 border-t border-brand-100 dark:border-brand-800">
            <p className="text-xs text-text-light">
              AI-Powered · RAG · Web Speech API
            </p>
            <p className="text-xs text-text-light mt-1">
              Website:{' '}
              <a href="https://lawreformer.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                lawreformer.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
