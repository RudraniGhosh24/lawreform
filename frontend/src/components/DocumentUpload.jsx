import React, { useRef, useState } from 'react'

export default function DocumentUpload({ onUpload, disabled }) {
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const [showOptions, setShowOptions] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      alert('File too large. Please upload an image under 4MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      onUpload(reader.result, file.name)
      setShowOptions(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="relative">
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />

      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={disabled}
        className="p-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900 disabled:opacity-50 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Scan or upload document"
        title="Scan contract, agreement, or legal notice"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
        </svg>
      </button>

      {showOptions && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
          <div className="absolute bottom-full mb-2 left-0 z-50 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-xl shadow-lg py-1 w-[200px]">
            <button
              onClick={() => { cameraRef.current?.click(); }}
              className="w-full text-left px-3 py-2.5 text-sm text-text dark:text-brand-100 hover:bg-brand-50 dark:hover:bg-brand-900/30 flex items-center gap-2"
            >
              📷 Scan with Camera
              <span className="text-[10px] text-text-muted ml-auto">Live</span>
            </button>
            <button
              onClick={() => { fileRef.current?.click(); }}
              className="w-full text-left px-3 py-2.5 text-sm text-text dark:text-brand-100 hover:bg-brand-50 dark:hover:bg-brand-900/30 flex items-center gap-2"
            >
              📄 Upload from Gallery
            </button>
            <div className="border-t border-brand-100 dark:border-brand-800 mx-2 my-1" />
            <p className="px-3 py-1.5 text-[10px] text-text-light">
              Scan contracts, agreements, salary slips, notices, or any legal document to understand your rights.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
