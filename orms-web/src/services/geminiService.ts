import { GoogleGenAI } from '@google/genai'
import type { RiskEvent } from '../types/riskEvent.types'

const model = 'gemini-3.6-flash'

export async function generateRiskEventSummary(event: RiskEvent): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured.')
  }

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model,
    contents: [
      'You are an operational risk analyst. Summarize the following risk event for an internal risk committee.',
      'Return exactly three labeled sections: Summary, Key concerns, Recommended next steps.',
      'Use concise plain text, do not invent facts, and clearly distinguish unknown information.',
      JSON.stringify({
        title: event.title,
        description: event.description,
        type: event.type,
        severity: event.severity,
        status: event.status,
        inherentScore: event.inherentScore,
        residualScore: event.residualScore,
        riskCategory: event.riskCategory,
        businessUnit: event.businessUnitName,
      }),
    ].join('\n\n'),
  })

  const text = response.text?.trim()

  if (!text) {
    throw new Error('Google GenAI returned an empty response.')
  }

  return text
}
