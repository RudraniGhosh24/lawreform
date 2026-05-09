// Lightweight RAG retrieval — TF-IDF style keyword matching
// Finds the most relevant legal chunks for a given query

import { legalChunks } from './legalChunks'

export function retrieveChunks(query, topK = 3) {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)

  const scored = legalChunks.map(chunk => {
    let score = 0

    // Keyword match (highest weight)
    for (const kw of chunk.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 10
      } else {
        // Partial word match
        const kwWords = kw.toLowerCase().split(/\s+/)
        for (const kwWord of kwWords) {
          if (queryWords.some(qw => qw.includes(kwWord) || kwWord.includes(qw))) {
            score += 3
          }
        }
      }
    }

    // Text content match (lower weight)
    const textLower = chunk.text.toLowerCase()
    for (const qw of queryWords) {
      if (textLower.includes(qw)) score += 1
    }

    return { ...chunk, score }
  })

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
