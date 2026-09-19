import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { RiskEvent } from '../../types/riskEvent.types'
import { RiskEventType } from '../../types/enums'

type InherentAssessmentFormProps = {
  event: RiskEvent
  onSubmitAssessment: (payload: Record<string, unknown>) => Promise<void>
  onSaveDraft: (payload: Record<string, unknown>) => Promise<void>
  onReturnToRiskOwner: (reason: string) => Promise<void>
}

type AssessmentFormValues = {
  riskCategory: string
  impact: number
  likelihood: number
  lossAmount?: number | string
  recoveryAmount?: number | string
  glReference?: string
  assessmentRationale: string
  existingControlsIdentified?: string
  reclassificationReason?: string
}

const assessmentSchema = z.object({
  riskCategory: z.string().min(1, 'Risk category is required'),
  impact: z.number().min(1).max(5),
  likelihood: z.number().min(1).max(5),
  assessmentRationale: z.string().min(20, 'Assessment rationale must be at least 20 characters'),
  reclassificationReason: z.string().optional(),
  lossAmount: z.union([z.number(), z.string()]).optional(),
  recoveryAmount: z.union([z.number(), z.string()]).optional(),
  glReference: z.string().optional(),
  existingControlsIdentified: z.string().optional(),
})

const impactLabels = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe']
const likelihoodLabels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain']

const getRiskBadge = (score: number) => {
  if (score >= 1 && score <= 4) return { label: 'Low', tone: 'success' }
  if (score >= 5 && score <= 9) return { label: 'Medium', tone: 'warning' }
  if (score >= 10 && score <= 15) return { label: 'High', tone: 'danger' }
  return { label: 'Critical', tone: 'danger' }
}

const getHeatMapColor = (score: number) => {
  if (score <= 4) return 'low'
  if (score <= 9) return 'medium'
  if (score <= 15) return 'high'
  return 'critical'
}

const RiskSummary = ({ event }: { event: RiskEvent }) => {
  const summaryRows = [
    { label: 'Business Unit', value: event.businessUnitName ?? event.businessUnitId },
    { label: 'Risk Category', value: event.riskCategory ?? 'Not specified' },
    { label: 'Event Type', value: event.type },
    { label: 'Submitted By', value: event.submittedBy ?? 'Unknown' },
    {
      label: 'Submitted Date',
      value: event.submittedDate ? new Date(event.submittedDate).toLocaleDateString() : 'Not recorded',
    },
  ]

  return (
    <section className="panel-block risk-summary-panel" aria-labelledby="risk-summary-heading">
      <div className="risk-summary-heading">
        <div>
          <p className="eyebrow">Assessment context</p>
          <h3 id="risk-summary-heading">Risk Event Summary</h3>
          <p className="risk-summary-subtitle">Review the submitted event before assigning its inherent exposure.</p>
        </div>
        <div className="risk-summary-statuses">
          <span className={`risk-status risk-status-${event.status.toLowerCase()}`}>{event.status.replace('_', ' ')}</span>
          <span className={`risk-severity risk-severity-${event.severity.toLowerCase()}`}>{event.severity} severity</span>
        </div>
      </div>

      <div className="risk-summary-identity">
        <span className="risk-summary-event-code">{event.id}</span>
        <h4>{event.title}</h4>
        <p>{event.description}</p>
      </div>

      <div className="summary-grid">
        {summaryRows.map((row) => (
          <div key={row.label} className="summary-row">
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

const HeatMapGrid = ({
  impact,
  likelihood,
  onSelect,
}: {
  impact: number
  likelihood: number
  onSelect: (nextImpact: number, nextLikelihood: number) => void
}) => {
  const rows = [5, 4, 3, 2, 1]
  const columns = [1, 2, 3, 4, 5]

  return (
    <div className="panel-block">
      <h3>Impact vs Likelihood Heat Map</h3>
      <div className="heatmap-wrap">
        <div className="heatmap-axis heatmap-x">
          <span>Impact</span>
          <div className="heatmap-columns">
            {columns.map((value) => (
              <span key={`impact-${value}`}>{value}</span>
            ))}
          </div>
        </div>

        <div className="heatmap-grid">
          {rows.map((rowLikelihood) => (
            <div key={`row-${rowLikelihood}`} className="heatmap-row">
              <span className="heatmap-y-label">{rowLikelihood}</span>
              {columns.map((columnImpact) => {
                const score = columnImpact * rowLikelihood
                const selected = impact === columnImpact && likelihood === rowLikelihood
                const tone = getHeatMapColor(score)

                return (
                  <button
                    key={`${rowLikelihood}-${columnImpact}`}
                    type="button"
                    className={`heatmap-cell ${tone} ${selected ? 'selected' : ''}`}
                    onClick={() => onSelect(columnImpact, rowLikelihood)}
                    aria-label={`Set impact ${columnImpact} and likelihood ${rowLikelihood}`}
                  >
                    {score}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function InherentAssessmentFormPage({
  event,
  onSubmitAssessment,
  onSaveDraft,
  onReturnToRiskOwner,
}: InherentAssessmentFormProps) {
  const [showReclassification, setShowReclassification] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returnError, setReturnError] = useState<string | null>(null)
  const [isReturning, setIsReturning] = useState(false)

  const defaultValues = useMemo<AssessmentFormValues>(
    () => ({
      riskCategory: event.riskCategory ?? '',
      impact: 3,
      likelihood: 3,
      assessmentRationale: '',
      existingControlsIdentified: '',
      reclassificationReason: '',
      glReference: '',
      lossAmount: '',
      recoveryAmount: '',
    }),
    [event],
  )

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues,
    mode: 'onChange',
  })

  const impact = form.watch('impact')
  const likelihood = form.watch('likelihood')
  const riskCategory = form.watch('riskCategory')
  const eventType = event.type
  const score = impact * likelihood
  const badge = getRiskBadge(score)

  useEffect(() => {
    const nextShow = riskCategory !== (event.riskCategory ?? '')
    setShowReclassification(nextShow)

    if (!nextShow) {
      form.setValue('reclassificationReason', '')
    }
  }, [riskCategory, event.riskCategory, form])

  const handleSaveDraft = async (values: AssessmentFormValues) => {
    setIsSavingDraft(true)
    setActionMessage(null)
    const payload: Record<string, unknown> = {
      riskCategory: values.riskCategory,
      impact: Number(values.impact),
      likelihood: Number(values.likelihood),
      inherentRiskRating: score,
      assessmentRationale: values.assessmentRationale,
      existingControlsIdentified: values.existingControlsIdentified,
      reclassificationReason: values.reclassificationReason,
      ...(eventType === RiskEventType.LOSS_EVENT
        ? {
            lossAmount: values.lossAmount ? Number(values.lossAmount) : undefined,
            recoveryAmount: values.recoveryAmount ? Number(values.recoveryAmount) : undefined,
            glReference: values.glReference,
          }
        : {}),
    }

    try {
      await onSaveDraft(payload)
      setActionMessage('Draft saved successfully.')
    } catch {
      setActionMessage('Unable to save the draft. Please try again.')
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleSubmitAssessment = async (values: AssessmentFormValues) => {
    const payload: Record<string, unknown> = {
      riskCategory: values.riskCategory,
      impact: Number(values.impact),
      likelihood: Number(values.likelihood),
      inherentRiskRating: score,
      assessmentRationale: values.assessmentRationale,
      existingControlsIdentified: values.existingControlsIdentified,
      reclassificationReason: values.reclassificationReason,
      ...(eventType === RiskEventType.LOSS_EVENT
        ? {
            lossAmount: values.lossAmount ? Number(values.lossAmount) : undefined,
            recoveryAmount: values.recoveryAmount ? Number(values.recoveryAmount) : undefined,
            glReference: values.glReference,
          }
        : {}),
    }

    await onSubmitAssessment(payload)
  }

  const canSubmit = form.formState.isValid && form.watch('impact') > 0 && form.watch('likelihood') > 0

  useEffect(() => {
    if (!isReturnModalOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isReturning) {
        setIsReturnModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isReturnModalOpen, isReturning])

  const closeReturnModal = () => {
    if (isReturning) return
    setIsReturnModalOpen(false)
    setReturnReason('')
    setReturnError(null)
  }

  const handleReturnToRiskOwner = async () => {
    const trimmedReason = returnReason.trim()
    if (!trimmedReason) {
      setReturnError('A return reason is required.')
      return
    }

    setIsReturning(true)
    setReturnError(null)

    try {
      await onReturnToRiskOwner(trimmedReason)
      setActionMessage('Assessment returned to the risk owner.')
      setIsReturnModalOpen(false)
      setReturnReason('')
    } catch {
      setReturnError('Unable to return the assessment. Please try again.')
    } finally {
      setIsReturning(false)
    }
  }

  return (
    <div className="assessment-layout">
      <RiskSummary event={event} />

      <div className="panel-block assessment-panel">
        <div className="assessment-heading">
          <div>
            <p className="eyebrow">Decision workspace</p>
            <h3>Inherent Assessment</h3>
          </div>
          <span className="assessment-step">Step 1 of 2</span>
        </div>

        <form className="assessment-form" onSubmit={form.handleSubmit(handleSubmitAssessment)}>
          <div className="assessment-section">
            <div className="assessment-section-heading">
              <div>
                <p className="eyebrow">Classification</p>
                <h4>Where does this risk belong?</h4>
              </div>
              <span>Required</span>
            </div>
            <label className="field">
              Risk Category
              <select {...form.register('riskCategory')}>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Third Party">Third Party</option>
                <option value="Operations">Operations</option>
                <option value="Compliance">Compliance</option>
                <option value="Finance">Finance</option>
              </select>
              {form.formState.errors.riskCategory ? <span className="field-error">{form.formState.errors.riskCategory.message}</span> : null}
            </label>
          </div>

          {showReclassification ? (
            <div className="assessment-callout">
              <label className="field">
                Reclassification Reason
                <textarea
                  rows={3}
                  {...form.register('reclassificationReason')}
                  placeholder="Explain why the risk category changed"
                />
              </label>
            </div>
          ) : null}

          <div className="assessment-section scoring-section">
            <div className="assessment-section-heading">
              <div>
                <p className="eyebrow">Scoring</p>
                <h4>Rate the inherent exposure</h4>
              </div>
              <span>Choose one level for each</span>
            </div>
            <div className="field-row segmented-row">
              <div className="field full-width">
                <span>Impact</span>
                <div className="segmented-group" role="radiogroup" aria-label="Impact level">
                  {impactLabels.map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      className={`segmented-option ${impact === index + 1 ? 'selected' : ''}`}
                      aria-pressed={impact === index + 1}
                      onClick={() => form.setValue('impact', index + 1, { shouldValidate: true })}
                    >
                      {index + 1}
                      <small>{label}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="field-row segmented-row">
              <div className="field full-width">
                <span>Likelihood</span>
                <div className="segmented-group" role="radiogroup" aria-label="Likelihood level">
                  {likelihoodLabels.map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      className={`segmented-option ${likelihood === index + 1 ? 'selected' : ''}`}
                      aria-pressed={likelihood === index + 1}
                      onClick={() => form.setValue('likelihood', index + 1, { shouldValidate: true })}
                    >
                      {index + 1}
                      <small>{label}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="field-row inline-summary">
              <div className="field score-card">
                <span>Inherent Risk Rating</span>
                <strong>{score}</strong>
                <span className={`badge ${badge.tone}`}>{badge.label}</span>
              </div>
            </div>

            <HeatMapGrid impact={impact} likelihood={likelihood} onSelect={(nextImpact, nextLikelihood) => {
              form.setValue('impact', nextImpact, { shouldValidate: true })
              form.setValue('likelihood', nextLikelihood, { shouldValidate: true })
            }} />
          </div>

          {eventType === RiskEventType.LOSS_EVENT ? (
            <div className="field-row two-col">
              <label className="field">
                Loss Amount
                <input
                  type="number"
                  step="0.01"
                  {...form.register('lossAmount', { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </label>

              <label className="field">
                Recovery Amount
                <input
                  type="number"
                  step="0.01"
                  {...form.register('recoveryAmount', { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </label>
            </div>
          ) : null}

          <div className="field-row two-col">
            <label className="field">
              GL Reference
              <input {...form.register('glReference')} placeholder="Optional reference code" />
            </label>
          </div>

          <div className="assessment-section">
            <div className="assessment-section-heading">
              <div>
                <p className="eyebrow">Evidence</p>
                <h4>Support the assessment</h4>
              </div>
              <span>Rationale is required</span>
            </div>
            <label className="field">
              Assessment Rationale
              <textarea
                rows={4}
                {...form.register('assessmentRationale')}
                placeholder="Explain the reasoning behind the selected impact and likelihood (minimum 20 characters)"
              />
              {form.formState.errors.assessmentRationale ? (
                <span className="field-error">{form.formState.errors.assessmentRationale.message}</span>
              ) : null}
            </label>

            <label className="field">
              Existing Controls Identified
              <textarea
                rows={3}
                {...form.register('existingControlsIdentified')}
                placeholder="List known controls and how they relate to this risk"
              />
            </label>

            <label className="field">
              Evidence Upload
              <input type="file" multiple />
              <span className="field-hint">Optional. Attach policies, reports, or other supporting material.</span>
            </label>
          </div>

          <div className="assessment-actions">
            {actionMessage ? <span className="assessment-action-message" role="status">{actionMessage}</span> : null}
            <button
              type="button"
              className="secondary-button"
              onClick={() => handleSaveDraft(form.getValues())}
              disabled={isSavingDraft || form.formState.isSubmitting}
            >
              {isSavingDraft ? 'Saving…' : 'Save Draft'}
            </button>
            <button type="submit" className="primary-button" disabled={!canSubmit || isSavingDraft || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Submitting…' : 'Submit Assessment'}
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={() => {
                setReturnError(null)
                setIsReturnModalOpen(true)
              }}
            >
              Return to Risk Owner
            </button>
          </div>
        </form>
      </div>

      {isReturnModalOpen ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeReturnModal()
        }}>
          <section className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="return-risk-owner-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Workflow action</p>
                <h3 id="return-risk-owner-title">Return to Risk Owner</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close return dialog"
                onClick={closeReturnModal}
                disabled={isReturning}
              >
                ×
              </button>
            </div>

            <p className="modal-description">
              Send this assessment back to the risk owner with a clear explanation of what needs to be addressed.
            </p>

            <label className="field" htmlFor="return-reason">
              Return reason
              <textarea
                id="return-reason"
                rows={5}
                value={returnReason}
                onChange={(event) => setReturnReason(event.target.value)}
                placeholder="Describe the changes or additional evidence required."
                autoFocus
                disabled={isReturning}
              />
            </label>

            {returnError ? <p className="modal-error" role="alert">{returnError}</p> : null}

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={closeReturnModal} disabled={isReturning}>
                Cancel
              </button>
              <button type="button" className="danger-button" onClick={() => void handleReturnToRiskOwner()} disabled={isReturning}>
                {isReturning ? 'Returning…' : 'Return assessment'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
