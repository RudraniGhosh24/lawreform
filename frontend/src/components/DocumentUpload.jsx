import React, { useRef } from 'react'

export default function DocumentUpload({ onUpload, disabled }) {
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Max 4MB
    if (file.size > 4 * 1024 * 1024) {
      alert('File too large. Please upload an image under 4MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onUpload(reader.result, file.name)
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be re-uploaded
    e.target.value = ''
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        aria-hidden="true"
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={disabled}
        className="p-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900 disabled:opacity-50 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Upload document photo"
        title="Upload a document (rental agreement, salary slip, notice)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <circle cx="10" cy="13" r="2" />
          <path d="m20 17-1.1-1.1a2 2 0 0 0-2.8 0L10 22" />
        </svg>
      </button>
    </>
  )
}
