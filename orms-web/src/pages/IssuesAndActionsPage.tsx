const actionRows = [
  { id: 'ACT-2026-041', issue: 'Payment resilience gap', owner: 'Maya Patel', priority: 'High', due: '18 Sep 2026', progress: 72, status: 'In progress' },
  { id: 'ACT-2026-038', issue: 'Vendor due diligence refresh', owner: 'Sam Rivera', priority: 'High', due: '12 Sep 2026', progress: 38, status: 'Overdue' },
  { id: 'ACT-2026-035', issue: 'Access review evidence', owner: 'Alex Morgan', priority: 'Medium', due: '24 Sep 2026', progress: 86, status: 'In progress' },
  { id: 'ACT-2026-031', issue: 'Incident response tabletop', owner: 'Jordan Lee', priority: 'Medium', due: '30 Sep 2026', progress: 100, status: 'Completed' },
]

const statusOptions = ['All actions', 'In progress', 'Overdue', 'Completed']

export default function IssuesAndActionsPage() {
  return (
    <section className="actions-page">
      <header className="actions-header">
        <div>
          <p className="eyebrow">Remediation oversight</p>
          <h1>Issue &amp; Action Plan Tracking</h1>
          <p>Track remediation activity, escalations, and actions to closure with clear accountability and milestone visibility.</p>
        </div>
        <div className="actions-header-meta"><span>Review cadence</span><strong>Weekly governance review</strong><small>Next review 19 Sep 2026</small></div>
      </header>

      <section className="actions-stat-grid" aria-label="Action plan summary">
        <div className="actions-stat-card highlight"><span>Open actions</span><strong>18</strong><small>Across 9 risk events</small></div>
        <div className="actions-stat-card"><span>Due this month</span><strong>7</strong><small>3 due in the next 7 days</small></div>
        <div className="actions-stat-card alert"><span>Overdue</span><strong>4</strong><small>2 high-priority actions</small></div>
        <div className="actions-stat-card"><span>Closed this quarter</span><strong>26</strong><small>88% on time</small></div>
      </section>

      <section className="actions-panel">
        <div className="actions-panel-heading"><div><p className="eyebrow">Action register</p><h2>Remediation actions</h2></div><div className="actions-filters"><select aria-label="Filter action status" defaultValue="All actions">{statusOptions.map((status) => <option key={status}>{status}</option>)}</select><select aria-label="Filter action priority" defaultValue="All priorities"><option>All priorities</option><option>High priority</option><option>Medium priority</option><option>Low priority</option></select></div></div>
        <div className="actions-table-wrap">
          <table className="actions-table"><thead><tr><th>Action</th><th>Owner</th><th>Priority</th><th>Due date</th><th>Progress</th><th>Status</th></tr></thead><tbody>
            {actionRows.map((row) => <tr key={row.id}><td><span className="action-id">{row.id}</span><strong>{row.issue}</strong></td><td>{row.owner}</td><td><span className={`badge ${row.priority === 'High' ? 'danger' : 'warning'}`}>{row.priority}</span></td><td className={row.status === 'Overdue' ? 'action-overdue' : ''}>{row.due}</td><td><div className="action-progress"><span style={{ width: `${row.progress}%` }} /></div><small>{row.progress}%</small></td><td><span className={`action-status action-status-${row.status.toLowerCase().replace(' ', '-')}`}>{row.status}</span></td></tr>)}
          </tbody></table>
        </div>
      </section>

      <section className="actions-lower-grid">
        <section className="actions-panel">
          <div className="actions-panel-heading"><div><p className="eyebrow">Escalation queue</p><h2>Needs attention</h2></div><span className="actions-panel-note">4 overdue</span></div>
          <div className="attention-list"><div><span className="attention-marker danger">!</span><div><strong>Vendor due diligence refresh</strong><p>Owner response overdue by 6 days.</p></div><span className="badge danger">High</span></div><div><span className="attention-marker warning">!</span><div><strong>Data retention procedure</strong><p>Due in 2 days with no evidence attached.</p></div><span className="badge warning">Medium</span></div><div><span className="attention-marker warning">!</span><div><strong>Business continuity test</strong><p>Milestone has not been updated this week.</p></div><span className="badge warning">Medium</span></div></div>
        </section>
        <section className="actions-panel actions-method-panel">
          <div><p className="eyebrow">Closure discipline</p><h2>Action lifecycle</h2></div>
          <div className="action-method-step"><span>01</span><div><strong>Assign ownership</strong><p>Set one accountable owner and a measurable due date.</p></div></div>
          <div className="action-method-step"><span>02</span><div><strong>Track milestones</strong><p>Capture progress, evidence, and blockers as work moves forward.</p></div></div>
          <div className="action-method-step"><span>03</span><div><strong>Validate closure</strong><p>Confirm the issue is resolved before closing the action.</p></div></div>
        </section>
      </section>
    </section>
  )
}
