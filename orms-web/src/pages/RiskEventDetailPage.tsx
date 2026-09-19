import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { riskEventService } from '../services/riskEventService'
import { QUERY_KEYS } from '../constants/routes'
import Breadcrumbs from '../components/Breadcrumbs'
import AIRiskSummary from '../components/riskEvents/AIRiskSummary'
import { RiskEventStatus } from '../types/enums'
import type { RiskWorkflowAction } from '../types/riskEvent.types'

export default function RiskEventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.riskEvents, id],
    queryFn: () => riskEventService.getById(id ?? ''),
    enabled: !!id,
  })

  const workflowMutation = useMutation({
    mutationFn: (action: RiskWorkflowAction) => riskEventService.transitionWorkflow(id ?? '', action),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.riskEvents, id] })
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.riskEvents] })
    },
  })

  if (isLoading) {
    return <div className="page-panel">Loading risk event…</div>
  }

  if (error || !data?.success || !data.data) {
    return <div className="page-panel">Unable to load the selected risk event.</div>
  }

  const event = data.data
  const workflowAction = event.status === RiskEventStatus.DRAFT
    ? { action: 'endorse' as const, label: 'Submit for endorsement' }
    : event.status === RiskEventStatus.ENDORSEMENT
      ? { action: 'approve_endorsement' as const, label: 'Approve endorsement' }
      : event.status === RiskEventStatus.RISK_ASSESSMENT
        ? { action: null, label: 'Ready for inherent assessment' }
      : event.status === RiskEventStatus.MONITORING
        ? { action: 'send_to_action_plan' as const, label: 'Create action plan' }
        : event.status === RiskEventStatus.COMMITTEE_REVIEW
          ? { action: 'approve_committee' as const, label: 'Approve committee review' }
          : event.status === RiskEventStatus.ACTION_PLAN
            ? { action: 'close' as const, label: 'Validate and close' }
            : null

  return (
    <section className="page-panel risk-detail-page">
      <Breadcrumbs
        items={[
          { label: 'Risk Register', to: '/risk-events' },
          { label: 'Risk Event Detail' },
        ]}
      />

      <div className="risk-detail-header">
        <div>
          <p className="eyebrow">Risk Event Detail</p>
          <h1>{event.title}</h1>
          <p className="risk-detail-id">Event ID: {event.id}</p>
        </div>
        <span className={`risk-status risk-status-${event.status.toLowerCase()}`}>{event.status.replace('_', ' ')}</span>
      </div>

      <div className="risk-detail-actions">
        {event.status === RiskEventStatus.RISK_ASSESSMENT ? <Link to={`/risk-events/${event.id}/inherent-assessment`} className="primary-button">Assess inherent risk</Link> : null}
        {workflowAction?.action ? <button type="button" className="primary-button" onClick={() => workflowMutation.mutate(workflowAction.action)} disabled={workflowMutation.isPending}>{workflowMutation.isPending ? 'Updating workflow…' : workflowAction.label}</button> : null}
        {workflowAction && !workflowAction.action ? <span className="workflow-waiting">{workflowAction.label}</span> : null}
        <Link to="/risk-events" className="secondary-button">
          Back to register
        </Link>
      </div>

      <div className="workflow-progress" aria-label="Risk workflow progress">
        {[
          ['Event logged', RiskEventStatus.DRAFT],
          ['Endorsement', RiskEventStatus.ENDORSEMENT],
          ['Risk assessment', RiskEventStatus.RISK_ASSESSMENT],
          ['Monitoring / committee', event.status === RiskEventStatus.COMMITTEE_REVIEW ? RiskEventStatus.COMMITTEE_REVIEW : RiskEventStatus.MONITORING],
          ['Action plan', RiskEventStatus.ACTION_PLAN],
          ['Closed', RiskEventStatus.CLOSED],
        ].map(([label, status], index) => <span key={label} className={event.status === status ? 'current' : index < ['DRAFT', 'ENDORSEMENT', 'RISK_ASSESSMENT', 'MONITORING', 'COMMITTEE_REVIEW', 'ACTION_PLAN', 'CLOSED'].indexOf(event.status) ? 'complete' : ''}>{label}</span>)}
      </div>

      <div className="risk-detail-section">
        <div className="risk-detail-section-heading">
          <div>
            <p className="eyebrow">Submitted event</p>
            <h2>Event information</h2>
          </div>
          <span className={`risk-severity risk-severity-${event.severity.toLowerCase()}`}>{event.severity} severity</span>
        </div>
        <div className="risk-detail-description">
          <span>Description</span>
          <p>{event.description}</p>
        </div>
        <div className="risk-detail-fields">
          <div className="risk-detail-field"><span>Type</span><strong>{event.type.replace('_', ' ')}</strong></div>
          <div className="risk-detail-field"><span>Risk category</span><strong>{event.riskCategory ?? 'Not assigned'}</strong></div>
          <div className="risk-detail-field"><span>Business unit</span><strong>{event.businessUnitName ?? 'Unassigned'}</strong></div>
          <div className="risk-detail-field"><span>Submitted by</span><strong>{event.submittedBy ?? 'Not recorded'}</strong></div>
          <div className="risk-detail-field"><span>Owner ID</span><strong>{event.ownerId}</strong></div>
          <div className="risk-detail-field"><span>Last updated</span><strong>{new Date(event.updatedAt).toLocaleDateString()}</strong></div>
        </div>
      </div>

      <div className="risk-detail-section">
        <div className="risk-detail-section-heading">
          <div>
            <p className="eyebrow">Risk scoring</p>
            <h2>Current assessment</h2>
          </div>
        </div>
        <div className="risk-score-grid">
          <div className="risk-score-card"><span>Inherent score</span><strong>{event.inherentScore}</strong><small>Before controls</small></div>
          <div className="risk-score-card"><span>Residual score</span><strong>{event.residualScore}</strong><small>After controls</small></div>
        </div>
      </div>

      <div className="risk-detail-section">
        <AIRiskSummary event={event} />
      </div>
    </section>
  )
}
