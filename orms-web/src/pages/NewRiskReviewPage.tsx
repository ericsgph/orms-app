import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { riskEventService } from '../services/riskEventService'
import { RiskEventType, RiskSeverity } from '../types/enums'
import type { CreateRiskEventInput } from '../types/riskEvent.types'

const initialForm: CreateRiskEventInput = {
  title: '',
  description: '',
  type: RiskEventType.OPERATIONAL,
  severity: RiskSeverity.MEDIUM,
  ownerId: '',
  businessUnitId: '',
  businessUnitName: '',
  riskCategory: '',
}

export default function NewRiskReviewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const updateField = <T extends keyof CreateRiskEventInput>(field: T, value: CreateRiskEventInput[T]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      await riskEventService.create(form)
      navigate('/risk-events', { replace: true })
    } catch {
      setError('Unable to create the risk review. Please check the details and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="new-review-page">
      <header className="new-review-header">
        <div>
          <p className="eyebrow">Risk register</p>
          <h1>New Risk Review</h1>
          <p>Start a structured review by recording the exposure, accountable owner, and business context.</p>
        </div>
        <div className="new-review-step"><span>01</span><small>of 03</small><strong>Capture exposure</strong></div>
      </header>

      <form className="new-review-panel" onSubmit={handleSubmit}>
        <div className="new-review-section-heading"><div><p className="eyebrow">Risk identity</p><h2>What are you reviewing?</h2></div><span>Required fields marked *</span></div>
        <div className="new-review-grid">
          <label className="field">Review title *<input required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="e.g. Critical payment processor dependency" /></label>
          <label className="field">Risk category<input value={form.riskCategory} onChange={(event) => updateField('riskCategory', event.target.value)} placeholder="e.g. Third Party" /></label>
          <label className="field">Risk type *<select required value={form.type} onChange={(event) => updateField('type', event.target.value as CreateRiskEventInput['type'])}>{Object.values(RiskEventType).map((type) => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}</select></label>
          <label className="field">Initial severity *<select required value={form.severity} onChange={(event) => updateField('severity', event.target.value as CreateRiskEventInput['severity'])}>{Object.values(RiskSeverity).map((severity) => <option key={severity} value={severity}>{severity}</option>)}</select></label>
        </div>

        <div className="new-review-section-heading"><div><p className="eyebrow">Ownership</p><h2>Who is accountable?</h2></div></div>
        <div className="new-review-grid">
          <label className="field">Business unit *<input required value={form.businessUnitName} onChange={(event) => updateField('businessUnitName', event.target.value)} placeholder="e.g. Technology Operations" /></label>
          <label className="field">Business unit ID *<input required value={form.businessUnitId} onChange={(event) => updateField('businessUnitId', event.target.value)} placeholder="e.g. bu-technology" /></label>
          <label className="field">Risk owner ID *<input required value={form.ownerId} onChange={(event) => updateField('ownerId', event.target.value)} placeholder="e.g. usr-100" /></label>
        </div>

        <div className="new-review-section-heading"><div><p className="eyebrow">Context</p><h2>Describe the exposure</h2></div></div>
        <label className="field">Review description *<textarea required rows={6} value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Describe the event, exposure, affected process, and why it needs review." /></label>

        {error ? <p className="new-review-error" role="alert">{error}</p> : null}
        <div className="new-review-actions">
          <button type="button" className="secondary-button" onClick={() => navigate('/risk-events')} disabled={isSaving}>Cancel</button>
          <button type="submit" className="primary-button" disabled={isSaving}>{isSaving ? 'Creating review…' : 'Create risk review'}</button>
        </div>
      </form>
    </section>
  )
}
