import { useState } from 'react'
import type { RiskEvent } from '../../types/riskEvent.types'

type AIRiskSummaryProps = {
  event: RiskEvent
}

export default function AIRiskSummary({ event }: AIRiskSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const { generateRiskEventSummary } = await import('../../services/geminiService')
      setSummary(await generateRiskEventSummary(event))
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Unable to generate an AI summary.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="ai-risk-summary">
      <div className="risk-detail-section-heading">
        <div>
          <p className="eyebrow">Google GenAI</p>
          <h2>Risk committee brief</h2>
        </div>
        <button type="button" className="secondary-button" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating…' : summary ? 'Regenerate brief' : 'Generate brief'}
        </button>
      </div>
      {summary && <pre className="ai-risk-summary-result">{summary}</pre>}
      {error && <p className="ai-risk-summary-error" role="alert">{error}</p>}
      {!summary && !error && <p className="ai-risk-summary-empty">Generate a concise summary of this event, its scoring, and the next actions worth discussing.</p>}
    </div>
  )
}
