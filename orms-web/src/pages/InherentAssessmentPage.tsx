import { lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { riskEventService } from '../services/riskEventService'
import { QUERY_KEYS } from '../constants/routes'
import Breadcrumbs from '../components/Breadcrumbs'
import AIRiskSummary from '../components/riskEvents/AIRiskSummary'

const InherentAssessmentForm = lazy(() => import('../components/riskEvents/InherentAssessmentForm'))

export default function InherentAssessmentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.riskEvents, id],
    queryFn: () => riskEventService.getById(id ?? ''),
    enabled: !!id,
  })

  if (isLoading) {
    return <div className="page-panel">Loading risk event assessment…</div>
  }

  if (error || !data?.success || !data.data) {
    return <div className="page-panel">Unable to load the selected risk event.</div>
  }

  const event = data.data

  return (
    <div className="assessment-page">
      <Breadcrumbs
        items={[
          { label: 'Risk Register', to: '/risk-events' },
          { label: 'Risk Event Detail', to: `/risk-events/${event.id}` },
          { label: 'Inherent Assessment' },
        ]}
      />
      <header className="assessment-page-header">
        <div>
          <p className="eyebrow">Risk decision workflow</p>
          <h1>Inherent Assessment</h1>
          <p className="assessment-page-description">
            Evaluate the exposure before controls are considered and record the reasoning behind your rating.
          </p>
        </div>
        <div className="assessment-page-context">
          <span className="assessment-page-step">01 <small>of 02</small></span>
          <span className="assessment-page-event">{event.id}</span>
          <strong>{event.title}</strong>
        </div>
      </header>
      <Suspense fallback={<div className="page-panel">Loading assessment form…</div>}>
        <InherentAssessmentForm
          event={event}
          onSubmitAssessment={async (payload) => {
            if (!id) return
            await riskEventService.submitAssessment(id, payload as Parameters<typeof riskEventService.submitAssessment>[1])
            navigate(`/risk-events/${id}`, { replace: true })
          }}
          onSaveDraft={async (payload) => {
            if (!id) return
            await riskEventService.saveDraftAssessment(id, payload as Parameters<typeof riskEventService.saveDraftAssessment>[1])
          }}
          onReturnToRiskOwner={async (reason) => {
            if (!id) return
            await riskEventService.returnToRiskOwner(id, reason)
          }}
        />

        <div className="risk-detail-section">
          <AIRiskSummary event={event} />
        </div>
              
      </Suspense>
    </div>
  )
}
