import React from 'react'

const BASE = [
  { icon: '🏠', en: 'My landlord won\'t return my deposit', q: 'My landlord is refusing to return my security deposit. What are my rights?' },
  { icon: '💰', en: 'My employer hasn\'t paid me', q: 'My employer has not paid my wages for two months. What can I do?' },
  { icon: '📋', en: 'How do I file an RTI?', q: 'How do I file a Right to Information application? What is the process?' },
  { icon: '👷', en: 'What is minimum wage?', q: 'What is the current minimum wage for daily wage workers?' },
  { icon: '🌾', en: 'I was denied MGNREGA work', q: 'The gram panchayat is not giving me MGNREGA work even though I have a job card. What are my rights?' },
  { icon: '🛡️', en: 'I\'m facing domestic abuse', q: 'I am facing domestic violence at home. What legal protections do I have and where can I get help?' },
]

const LABELS = {
  English: ['My landlord won\'t return my deposit', 'My employer hasn\'t paid me', 'How do I file an RTI?', 'What is minimum wage?', 'I was denied MGNREGA work', 'I\'m facing domestic abuse'],
  Hindi: ['मकान मालिक जमा वापस नहीं कर रहा', 'मालिक ने वेतन नहीं दिया', 'RTI कैसे दाखिल करें?', 'न्यूनतम वेतन क्या है?', 'मनरेगा का काम नहीं मिला', 'घरेलू हिंसा का सामना'],
  Bengali: ['বাড়িওয়ালা জমা ফেরত দিচ্ছে না', 'মালিক বেতন দেয়নি', 'RTI কীভাবে দাখিল করব?', 'ন্যূনতম মজুরি কত?', 'মনরেগার কাজ পাইনি', 'গৃহ নির্যাতনের সম্মুখীন'],
  Tamil: ['வீட்டு உரிமையாளர் வைப்புத்தொகை திருப்பவில்லை', 'முதலாளி சம்பளம் தரவில்லை', 'RTI எப்படி தாக்கல் செய்வது?', 'குறைந்தபட்ச ஊதியம் என்ன?', 'மனரேகா வேலை மறுக்கப்பட்டது', 'குடும்ப வன்முறை எதிர்கொள்கிறேன்'],
  Telugu: ['ఇంటి యజమాని డిపాజిట్ తిరిగి ఇవ్వడం లేదు', 'యజమాని జీతం ఇవ్వలేదు', 'RTI ఎలా దాఖలు చేయాలి?', 'కనీస వేతనం ఎంత?', 'మన్రేగా పని నిరాకరించారు', 'గృహ హింసను ఎదుర్కొంటున్నాను'],
  Marathi: ['घरमालक डिपॉझिट परत करत नाही', 'मालकाने पगार दिला नाही', 'RTI कसा दाखल करायचा?', 'किमान वेतन किती?', 'मनरेगा काम नाकारले', 'घरगुती हिंसाचाराला सामोरे जात आहे'],
  Kannada: ['ಮನೆ ಮಾಲೀಕ ಠೇವಣಿ ಹಿಂತಿರುಗಿಸುತ್ತಿಲ್ಲ', 'ಮಾಲೀಕ ಸಂಬಳ ಕೊಟ್ಟಿಲ್ಲ', 'RTI ಹೇಗೆ ಸಲ್ಲಿಸುವುದು?', 'ಕನಿಷ್ಠ ವೇತನ ಎಷ್ಟು?', 'ಮನರೇಗಾ ಕೆಲಸ ನಿರಾಕರಿಸಲಾಗಿದೆ', 'ಗೃಹ ಹಿಂಸೆ ಎದುರಿಸುತ್ತಿದ್ದೇನೆ'],
  Gujarati: ['મકાનમાલિક ડિપોઝિટ પરત કરતા નથી', 'માલિકે પગાર આપ્યો નથી', 'RTI કેવી રીતે ફાઇલ કરવી?', 'લઘુત્તમ વેતન કેટલું?', 'મનરેગા કામ નકાર્યું', 'ઘરેલું હિંસાનો સામનો કરું છું'],
}

export default function ScenarioTiles({ language, onSelect }) {
  const labels = LABELS[language] || LABELS.English

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-lg mx-auto">
      {BASE.map((tile, i) => (
        <button
          key={i}
          onClick={() => onSelect(labels[i])}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-brand-950 border border-brand-100 dark:border-brand-800 hover:border-brand-400 hover:shadow-md hover:shadow-brand-100 transition-all text-center min-h-[80px]"
        >
          <span className="text-2xl" role="img" aria-hidden="true">{tile.icon}</span>
          <span className="text-[11px] sm:text-xs font-medium text-text dark:text-brand-100 leading-tight">
            {labels[i]}
          </span>
        </button>
      ))}
    </div>
  )
}
