const assessmentRows = [
  { unit: 'Technology', owner: 'Maya Patel', completion: 92, risks: 12, controls: 'Effective', status: 'On track' },
  { unit: 'Operations', owner: 'Jordan Lee', completion: 68, risks: 18, controls: 'Needs review', status: 'Due soon' },
  { unit: 'Finance', owner: 'Alex Morgan', completion: 45, risks: 9, controls: 'Effective', status: 'In progress' },
  { unit: 'Third Party Risk', owner: 'Sam Rivera', completion: 28, risks: 14, controls: 'Gaps found', status: 'At risk' },
]

const controlSignals = [
  { label: 'Effective', value: '64%', tone: 'success', detail: 'Controls operating as designed' },
  { label: 'Needs review', value: '24%', tone: 'warning', detail: 'Evidence or testing is due' },
  { label: 'Gaps found', value: '12%', tone: 'danger', detail: 'Treatment action is required' },
]

export default function RCSAPage() {
  return (
    <section className="rcsa-page">
      <header className="rcsa-header">
        <div>
          <p className="eyebrow">Control environment</p>
          <h1>Risk and Control Self-Assessment</h1>
          <p>Capture business-unit assessments of key risks and control effectiveness, helping teams confirm coverage and identify gaps.</p>
        </div>
        <div className="rcsa-cycle-control">
          <label htmlFor="assessment-cycle">Assessment cycle</label>
          <select id="assessment-cycle" defaultValue="q3-2026">
            <option value="q3-2026">Q3 2026 cycle</option>
            <option value="q2-2026">Q2 2026 cycle</option>
            <option value="q1-2026">Q1 2026 cycle</option>
          </select>
          <span>Closes 30 Sep 2026</span>
        </div>
      </header>

      <section className="rcsa-stat-grid" aria-label="Assessment summary">
        <div className="rcsa-stat-card highlight"><span>Overall completion</span><strong>61%</strong><small>+8% from last cycle</small></div>
        <div className="rcsa-stat-card"><span>Business units</span><strong>12</strong><small>7 completed, 5 active</small></div>
        <div className="rcsa-stat-card"><span>Risks assessed</span><strong>148</strong><small>22 high or critical</small></div>
        <div className="rcsa-stat-card"><span>Control gaps</span><strong>17</strong><small>6 without action plans</small></div>
      </section>

      <div className="rcsa-content-grid">
        <section className="rcsa-panel">
          <div className="rcsa-panel-heading">
            <div><p className="eyebrow">Assessment progress</p><h2>Business unit coverage</h2></div>
            <span className="rcsa-panel-note">4 of 12 shown</span>
          </div>
          <div className="rcsa-table-wrap">
            <table className="rcsa-table">
              <thead>
                <tr><th>Business unit</th><th>Owner</th><th>Completion</th><th>Risks</th><th>Controls</th><th>Status</th></tr>
              </thead>
              <tbody>
                {assessmentRows.map((row) => (
                  <tr key={row.unit}>
                    <td><strong>{row.unit}</strong></td>
                    <td>{row.owner}</td>
                    <td><div className="rcsa-progress"><span style={{ width: `${row.completion}%` }} /></div><small>{row.completion}%</small></td>
                    <td>{row.risks}</td>
                    <td><span className={`badge ${row.controls === 'Effective' ? 'success' : row.controls === 'Needs review' ? 'warning' : 'danger'}`}>{row.controls}</span></td>
                    <td><span className={`rcsa-status rcsa-status-${row.status.toLowerCase().replace(' ', '-')}`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rcsa-panel rcsa-control-panel">
          <div className="rcsa-panel-heading"><div><p className="eyebrow">Control health</p><h2>Effectiveness mix</h2></div></div>
          <div className="rcsa-control-list">
            {controlSignals.map((signal) => (
              <div className="rcsa-control-row" key={signal.label}>
                <div className="rcsa-control-row-heading"><span className={`badge ${signal.tone}`}>{signal.label}</span><strong>{signal.value}</strong></div>
                <p>{signal.detail}</p>
              </div>
            ))}
          </div>
          <div className="rcsa-callout"><strong>Next checkpoint</strong><span>Control evidence review is due in 9 days.</span></div>
        </section>
      </div>

      <section className="rcsa-guidance">
        <div><p className="eyebrow">Assessment method</p><h2>From self-assessment to action</h2></div>
        <div className="rcsa-guidance-steps">
          <div><span>01</span><strong>Assess</strong><p>Score the risk and document the control environment.</p></div>
          <div><span>02</span><strong>Validate</strong><p>Review evidence and challenge gaps with control owners.</p></div>
          <div><span>03</span><strong>Remediate</strong><p>Track agreed actions until residual exposure is acceptable.</p></div>
        </div>
      </section>
    </section>
  )
}
