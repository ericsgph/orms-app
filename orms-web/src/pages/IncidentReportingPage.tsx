import { useState } from 'react'
import type { FormEvent } from 'react'

const incidentRows = [
  { id: 'INC-2026-014', title: 'Payment processing interruption', unit: 'Technology', severity: 'High', impact: '$84,200', status: 'Under review', date: '12 Sep 2026' },
  { id: 'INC-2026-013', title: 'Supplier delivery failure', unit: 'Operations', severity: 'Medium', impact: '$12,600', status: 'Action open', date: '08 Sep 2026' },
  { id: 'INC-2026-011', title: 'Access control exception', unit: 'Finance', severity: 'Low', impact: '$2,400', status: 'Monitoring', date: '01 Sep 2026' },
]

const incidentTypes = ['Operational disruption', 'Financial loss', 'Technology outage', 'Compliance breach', 'Third-party event']

export default function IncidentReportingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <section className="incident-page">
      <header className="incident-header">
        <div>
          <p className="eyebrow">Event intake</p>
          <h1>Loss / Incident Event Reporting</h1>
          <p>Capture operational incidents and losses with enough context to assess impact, identify root cause, and coordinate remediation.</p>
        </div>
        <div className="incident-header-meta"><span>Reporting window</span><strong>September 2026</strong><small>Last updated today</small></div>
      </header>

      <div className="incident-layout">
        <section className="incident-panel incident-form-panel">
          <div className="incident-panel-heading"><div><p className="eyebrow">New event</p><h2>Report an incident</h2></div><span className="incident-required">Required fields marked *</span></div>
          <form className="incident-form" onSubmit={handleSubmit}>
            <div className="incident-form-grid">
              <label className="field">Event title *<input required name="title" placeholder="Briefly describe the event" /></label>
              <label className="field">Event type *<select required name="type" defaultValue=""><option value="" disabled>Select event type</option>{incidentTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label className="field">Date discovered *<input required name="date" type="date" /></label>
              <label className="field">Business unit *<select required name="unit" defaultValue=""><option value="" disabled>Select business unit</option><option>Technology</option><option>Operations</option><option>Finance</option><option>Compliance</option></select></label>
              <label className="field">Estimated financial loss<input name="loss" type="number" min="0" step="0.01" placeholder="0.00" /></label>
              <label className="field">Severity *<select required name="severity" defaultValue=""><option value="" disabled>Select severity</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
            </div>
            <label className="field">What happened? *<textarea required name="description" rows={4} placeholder="Describe the event, affected process, and immediate response." /></label>
            <div className="incident-form-grid">
              <label className="field">Suspected root cause<textarea name="rootCause" rows={3} placeholder="What caused or contributed to the event?" /></label>
              <label className="field">Immediate action taken<textarea name="action" rows={3} placeholder="Document containment or recovery actions." /></label>
            </div>
            <div className="incident-form-footer">
              {isSubmitted ? <span className="incident-success" role="status">Incident draft created successfully.</span> : <span className="field-hint">You can save this report as a draft for further investigation.</span>}
              <button type="submit" className="primary-button">Save incident draft</button>
            </div>
          </form>
        </section>

        <aside className="incident-panel incident-impact-panel">
          <div className="incident-panel-heading"><div><p className="eyebrow">Portfolio view</p><h2>Impact snapshot</h2></div></div>
          <div className="incident-impact-total"><span>Open incident exposure</span><strong>$99,200</strong><small>Across 3 active events</small></div>
          <div className="incident-impact-list">
            <div><span>High severity</span><strong>1</strong></div>
            <div><span>Action plans open</span><strong>2</strong></div>
            <div><span>Average time to report</span><strong>2.4 days</strong></div>
          </div>
          <div className="incident-callout"><strong>Reporting reminder</strong><span>Escalate material losses and events that may affect customers, financial reporting, or regulatory obligations.</span></div>
        </aside>
      </div>

      <section className="incident-panel">
        <div className="incident-panel-heading"><div><p className="eyebrow">Active register</p><h2>Open incidents</h2></div><span className="incident-panel-note">3 active events</span></div>
        <div className="incident-table-wrap">
          <table className="incident-table"><thead><tr><th>Event</th><th>Business unit</th><th>Severity</th><th>Gross impact</th><th>Status</th><th>Discovered</th></tr></thead><tbody>
            {incidentRows.map((row) => <tr key={row.id}><td><span className="incident-id">{row.id}</span><strong>{row.title}</strong></td><td>{row.unit}</td><td><span className={`badge ${row.severity === 'High' ? 'danger' : row.severity === 'Medium' ? 'warning' : 'success'}`}>{row.severity}</span></td><td>{row.impact}</td><td><span className="incident-status">{row.status}</span></td><td>{row.date}</td></tr>)}
          </tbody></table>
        </div>
      </section>
    </section>
  )
}
