'use client'
import { useState, useEffect } from 'react'
import { Scale, X } from 'lucide-react'

export default function LegalDisclaimer() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('lr_disclaimer_accepted')
    if (!accepted) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('lr_disclaimer_accepted', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto border border-purple-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Disclaimer & Confirmation</h2>
              <p className="text-xs text-gray-400">Please read carefully before proceeding</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              As per the rules of the Bar Council of India, advocates and law firms are not permitted to solicit work or advertise. By accessing this website (<span className="font-medium text-gray-800">lawreformer.com</span>), the user acknowledges the following:
            </p>

            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
                <span>There has been no advertisement, personal communication, solicitation, invitation, or inducement of any sort whatsoever from LawReformer or any of its members to solicit any work through this website.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
                <span>The user wishes to gain more information about LawReformer for their own information and use, and has accessed this website of their own accord and volition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
                <span>The information provided on this website is solely for informational and educational purposes. It does not constitute legal advice and should not be interpreted as such.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
                <span>Use of this website does not create an attorney-client relationship or any form of lawyer-client privilege between the user and LawReformer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
                <span>LawReformer is not a law firm and does not provide legal representation. For any legal matter, users are advised to consult a qualified legal professional in their jurisdiction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
                <span>The content on this website may not reflect the most current legal developments. Laws and regulations vary across jurisdictions and change over time.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={accept}
              className="flex-1 btn-primary text-sm py-3">
              I Agree — Proceed to Website
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-400 text-center">
            By clicking "I Agree," you confirm that you have read and understood this disclaimer and that you are accessing this website voluntarily.
          </p>
        </div>
      </div>
    </div>
  )
}
