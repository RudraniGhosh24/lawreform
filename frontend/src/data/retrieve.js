// Lightweight RAG retrieval — keyword matching with synonym expansion
// Finds the most relevant legal chunks for a given query

import { legalChunks } from './legalChunks'

// Synonym map — expands user terms to legal keywords
const SYNONYMS = {
  'paid': ['wages', 'salary', 'payment', 'vetan', 'tankhwah', 'mazdoori'],
  'pay': ['wages', 'salary', 'payment', 'minimum wage', 'vetan'],
  'salary': ['wages', 'payment', 'vetan', 'tankhwah', 'not paid'],
  'employer': ['employer', 'company', 'boss', 'maalik', 'niyokta'],
  'fired': ['termination', 'retrenchment', 'dismissed', 'removed', 'naukri se nikalna'],
  'landlord': ['landlord', 'rent', 'tenant', 'kiraya', 'makan malik', 'deposit'],
  'deposit': ['security deposit', 'jama', 'refund', 'return'],
  'evict': ['eviction', 'vacate', 'thrown out', 'bedakhali', 'nikalna'],
  'rti': ['RTI', 'right to information', 'soochna', 'information'],
  'mgnrega': ['MGNREGA', 'NREGA', 'job card', 'rozgar', '100 days'],
  'violence': ['domestic violence', 'abuse', 'beating', 'hinsa', 'marpeet'],
  'beat': ['domestic violence', 'physical abuse', 'assault', 'hinsa'],
  'dowry': ['dowry', 'dahej', 'harassment', 'demand'],
  'consumer': ['consumer', 'defective', 'refund', 'complaint', 'product'],
  'online': ['e-commerce', 'online fraud', 'cyber', 'internet'],
  'hack': ['cyber crime', 'hacking', 'unauthorized access', 'fraud'],
  'child': ['child labour', 'minor', 'below 14', 'bachche'],
  'caste': ['SC/ST', 'atrocity', 'discrimination', 'dalit', 'caste'],
  'disability': ['disabled', 'viklang', 'PWD', 'disability'],
  'pension': ['pension', 'retirement', 'EPF', 'gratuity', 'senior citizen'],
  'accident': ['motor accident', 'compensation', 'injury', 'hit and run'],
  'divorce': ['divorce', 'talaq', 'maintenance', 'alimony', 'custody'],
  'harassment': ['sexual harassment', 'POSH', 'workplace', 'ICC'],
  'work': ['employment', 'labour', 'worker', 'job', 'kaam'],
  'minimum': ['minimum wage', 'nyuntam vetan', 'wages'],
  'overtime': ['overtime', 'extra hours', 'double rate'],
  'leave': ['leave', 'chutti', 'maternity', 'annual leave'],
}

export function retrieveChunks(query, topK = 3) {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)

  // Expand query with synonyms
  const expandedTerms = new Set(queryWords)
  for (const word of queryWords) {
    if (SYNONYMS[word]) {
      SYNONYMS[word].forEach(syn => expandedTerms.add(syn.toLowerCase()))
    }
    // Also check partial matches in synonym keys
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (word.includes(key) || key.includes(word)) {
        syns.forEach(syn => expandedTerms.add(syn.toLowerCase()))
      }
    }
  }

  const expandedArray = [...expandedTerms]

  const scored = legalChunks.map(chunk => {
    let score = 0

    // Keyword match against expanded terms (highest weight)
    for (const kw of chunk.keywords) {
      const kwLower = kw.toLowerCase()
      if (queryLower.includes(kwLower)) {
        score += 15 // Direct match in query
      } else if (expandedArray.some(term => kwLower.includes(term) || term.includes(kwLower))) {
        score += 8 // Synonym match
      } else {
        // Partial word match
        const kwWords = kwLower.split(/\s+/)
        for (const kwWord of kwWords) {
          if (expandedArray.some(term => term.includes(kwWord) || kwWord.includes(term))) {
            score += 3
          }
        }
      }
    }

    // Source/section match (medium weight) — prefer relevant law categories
    const sourceLower = chunk.source.toLowerCase()
    for (const term of expandedArray) {
      if (sourceLower.includes(term)) score += 5
    }

    // Text content match (lower weight)
    const textLower = chunk.text.toLowerCase()
    for (const term of expandedArray) {
      if (textLower.includes(term)) score += 2
    }

    return { ...chunk, score }
  })

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
