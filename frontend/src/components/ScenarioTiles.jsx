import React from 'react'

const SCENARIOS = {
  English: [
    { icon: '🏠', label: 'My landlord won\'t return my deposit', query: 'My landlord is refusing to return my security deposit. What are my rights?' },
    { icon: '💰', label: 'My employer hasn\'t paid me', query: 'My employer has not paid my wages for two months. What can I do?' },
    { icon: '📋', label: 'How do I file an RTI?', query: 'How do I file a Right to Information application? What is the process?' },
    { icon: '👷', label: 'What is minimum wage in West Bengal?', query: 'What is the current minimum wage in West Bengal for daily wage workers?' },
    { icon: '🌾', label: 'I was denied MGNREGA work', query: 'The gram panchayat is not giving me MGNREGA work even though I have a job card. What are my rights?' },
    { icon: '🛡️', label: 'I\'m facing domestic abuse', query: 'I am facing domestic violence at home. What legal protections do I have and where can I get help?' },
  ],
  Hindi: [
    { icon: '🏠', label: 'मकान मालिक मेरा जमा वापस नहीं कर रहा', query: 'मकान मालिक मेरा सिक्योरिटी डिपॉजिट वापस नहीं कर रहा। मेरे क्या अधिकार हैं?' },
    { icon: '💰', label: 'मालिक ने वेतन नहीं दिया', query: 'मेरे मालिक ने दो महीने से वेतन नहीं दिया है। मैं क्या कर सकता हूँ?' },
    { icon: '📋', label: 'RTI कैसे दाखिल करें?', query: 'सूचना का अधिकार (RTI) आवेदन कैसे दाखिल करें? प्रक्रिया क्या है?' },
    { icon: '👷', label: 'पश्चिम बंगाल में न्यूनतम वेतन क्या है?', query: 'पश्चिम बंगाल में दैनिक मजदूरी करने वालों के लिए न्यूनतम वेतन क्या है?' },
    { icon: '🌾', label: 'मनरेगा का काम नहीं मिला', query: 'ग्राम पंचायत मुझे मनरेगा का काम नहीं दे रही है जबकि मेरे पास जॉब कार्ड है। मेरे क्या अधिकार हैं?' },
    { icon: '🛡️', label: 'घरेलू हिंसा का सामना कर रही हूँ', query: 'मैं घर पर घरेलू हिंसा का सामना कर रही हूँ। मेरे पास क्या कानूनी सुरक्षा है और मुझे कहाँ मदद मिल सकती है?' },
  ],
  Bengali: [
    { icon: '🏠', label: 'বাড়িওয়ালা আমার জমা ফেরত দিচ্ছে না', query: 'বাড়িওয়ালা আমার সিকিউরিটি ডিপোজিট ফেরত দিচ্ছে না। আমার কী অধিকার আছে?' },
    { icon: '💰', label: 'মালিক বেতন দেয়নি', query: 'আমার মালিক দুই মাস ধরে বেতন দেয়নি। আমি কী করতে পারি?' },
    { icon: '📋', label: 'RTI কীভাবে দাখিল করব?', query: 'তথ্যের অধিকার (RTI) আবেদন কীভাবে দাখিল করব? প্রক্রিয়া কী?' },
    { icon: '👷', label: 'পশ্চিমবঙ্গে ন্যূনতম মজুরি কত?', query: 'পশ্চিমবঙ্গে দৈনিক মজুরি শ্রমিকদের জন্য ন্যূনতম মজুরি কত?' },
    { icon: '🌾', label: 'মনরেগার কাজ পাইনি', query: 'গ্রাম পঞ্চায়েত আমাকে মনরেগার কাজ দিচ্ছে না যদিও আমার জব কার্ড আছে। আমার কী অধিকার আছে?' },
    { icon: '🛡️', label: 'গৃহ নির্যাতনের সম্মুখীন', query: 'আমি বাড়িতে গৃহ নির্যাতনের সম্মুখীন। আমার কী আইনি সুরক্ষা আছে এবং কোথায় সাহায্য পাব?' },
  ],
}

export default function ScenarioTiles({ language, onSelect }) {
  const tiles = SCENARIOS[language] || SCENARIOS.English

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg mx-auto">
      {tiles.map((tile, i) => (
        <button
          key={i}
          onClick={() => onSelect(tile.query)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-brand-950 border border-brand-100 dark:border-brand-800 hover:border-brand-400 hover:shadow-md hover:shadow-brand-100 transition-all text-center min-h-[100px]"
        >
          <span className="text-3xl" role="img" aria-hidden="true">{tile.icon}</span>
          <span className="text-xs sm:text-sm font-medium text-text dark:text-brand-100 leading-tight">
            {tile.label}
          </span>
        </button>
      ))}
    </div>
  )
}
