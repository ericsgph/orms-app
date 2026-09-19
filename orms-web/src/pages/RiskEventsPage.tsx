import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { riskEventService } from '../services/riskEventService'
import { QUERY_KEYS } from '../constants/routes'
import { RiskEventType, RiskSeverity } from '../types/enums'
import type { CreateRiskEventInput, RiskEvent } from '../types/riskEvent.types'

const emptyForm: CreateRiskEventInput = {
  title: '',
  description: '',
  type: RiskEventType.OPERATIONAL,
  severity: RiskSeverity.MEDIUM,
  ownerId: '',
  businessUnitId: '',
  businessUnitName: '',
  riskCategory: '',
}

function RiskEventForm({
  initialEvent,
  onCancel,
  onSubmit,
  isSaving,
}: {
  initialEvent: RiskEvent | null
  onCancel: () => void
  onSubmit: (payload: CreateRiskEventInput) => void
  isSaving: boolean
}) {
  const [form, setForm] = useState<CreateRiskEventInput>(() =>
    initialEvent
      ? {
          title: initialEvent.title,
          description: initialEvent.description,
          type: initialEvent.type,
          severity: initialEvent.severity,
          ownerId: initialEvent.ownerId,
          businessUnitId: initialEvent.businessUnitId,
          businessUnitName: initialEvent.businessUnitName ?? '',
          riskCategory: initialEvent.riskCategory ?? '',
        }
      : emptyForm,
  )

  const updateField = <T extends keyof CreateRiskEventInput>(field: T, value: CreateRiskEventInput[T]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
      }}
      className="risk-event-form"
    >
      <div className="risk-event-form-heading">
        <div>
          <p className="eyebrow">Risk register</p>
          <h2>{initialEvent ? 'Edit risk event' : 'Create risk event'}</h2>
        </div>
        <span>{initialEvent ? 'Update submitted event details' : 'Capture a new operational risk'}</span>
      </div>
      <div className="risk-event-form-grid">
        <label className="field">
          Title
          <input required value={form.title} onChange={(event) => updateField('title', event.target.value)} />
        </label>
        <label className="field">
          Risk category
          <input value={form.riskCategory} onChange={(event) => updateField('riskCategory', event.target.value)} />
        </label>
        <label className="field">
          Type
          <select value={form.type} onChange={(event) => updateField('type', event.target.value as CreateRiskEventInput['type'])}>
            {Object.values(RiskEventType).map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="field">
          Severity
          <select value={form.severity} onChange={(event) => updateField('severity', event.target.value as CreateRiskEventInput['severity'])}>
            {Object.values(RiskSeverity).map((severity) => <option key={severity} value={severity}>{severity}</option>)}
          </select>
        </label>
        <label className="field">
          Business unit
          <input required value={form.businessUnitName} onChange={(event) => updateField('businessUnitName', event.target.value)} />
        </label>
        <label className="field">
          Business unit ID
          <input required value={form.businessUnitId} onChange={(event) => updateField('businessUnitId', event.target.value)} />
        </label>
        <label className="field">
          Owner ID
          <input required value={form.ownerId} onChange={(event) => updateField('ownerId', event.target.value)} />
        </label>
      </div>
      <label className="field">
        Description
        <textarea required rows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} />
      </label>
      <div className="risk-event-form-actions">
        <button type="submit" className="primary-button" disabled={isSaving}>
          {isSaving ? 'Saving…' : initialEvent ? 'Save changes' : 'Create event'}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function RiskEventsPage() {
  const queryClient = useQueryClient()
  const [editingEvent, setEditingEvent] = useState<RiskEvent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState('')
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.riskEvents],
    queryFn: riskEventService.getAll,
  })

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: CreateRiskEventInput }) =>
      id ? riskEventService.update(id, payload) : riskEventService.create(payload),
    onSuccess: (_, variables) => {
      setEditingEvent(null)
      setIsCreating(false)
      setMessage(variables.id ? 'Risk event updated.' : 'Risk event created.')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.riskEvents] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: riskEventService.delete,
    onSuccess: () => {
      setMessage('Risk event deleted.')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.riskEvents] })
    },
  })

  const events = data?.success ? data.data.items : []

  return (
    <section className="page-panel risk-register-page">
      <div className="risk-register-header">
        <div>
          <p className="eyebrow">Risk Events</p>
          <h1>Risk Register</h1>
          <p>Track submitted events, ownership, status, and assessment progress.</p>
        </div>
        <button type="button" className="primary-button" onClick={() => { setEditingEvent(null); setIsCreating(true); setMessage('') }}>
          + New risk event
        </button>
      </div>

      <div className="risk-register-toolbar">
        <span>{events.length} {events.length === 1 ? 'event' : 'events'} in register</span>
        {message && <span className="risk-register-message" role="status">{message}</span>}
      </div>

      {isCreating && (
        <RiskEventForm
          initialEvent={null}
          onCancel={() => setIsCreating(false)}
          onSubmit={(payload) => saveMutation.mutate({ payload })}
          isSaving={saveMutation.isPending}
        />
      )}

      {isLoading && <p>Loading risk events…</p>}
      {error && <p>Unable to load risk events.</p>}

      {!isLoading && !error && (
        <div className="risk-event-list">
          {events.map((event) => (
            <article key={event.id} className="risk-event-card">
              <div className="risk-event-card-heading">
                <div>
                  <p className="risk-event-id">{event.id}</p>
                  <h3>{event.title}</h3>
                  <p className="risk-event-unit">{event.businessUnitName ?? 'Unassigned business unit'}</p>
                </div>
                <div className="risk-event-badges">
                  <span className={`risk-status risk-status-${event.status.toLowerCase()}`}>{event.status.replace('_', ' ')}</span>
                  <span className={`risk-severity risk-severity-${event.severity.toLowerCase()}`}>{event.severity}</span>
                </div>
              </div>

              <p className="risk-event-description">{event.description}</p>

              <div className="risk-event-meta">
                <span><strong>Category</strong>{event.riskCategory ?? 'Not assigned'}</span>
                <span><strong>Inherent</strong>{event.inherentScore}</span>
                <span><strong>Residual</strong>{event.residualScore}</span>
              </div>

              <div className="risk-event-actions">
                <Link to={`/risk-events/${event.id}`} className="secondary-button">
                  View detail
                </Link>
                <Link to={`/risk-events/${event.id}/inherent-assessment`} className="primary-button">
                  Open assessment
                </Link>
                <button type="button" className="secondary-button" onClick={() => { setIsCreating(false); setEditingEvent(event); setMessage('') }}>
                  Edit
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    if (window.confirm(`Delete “${event.title}”?`)) {
                      deleteMutation.mutate(event.id)
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>

              {editingEvent?.id === event.id && (
                <RiskEventForm
                  initialEvent={event}
                  onCancel={() => setEditingEvent(null)}
                  onSubmit={(payload) => saveMutation.mutate({ id: event.id, payload })}
                  isSaving={saveMutation.isPending}
                />
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
