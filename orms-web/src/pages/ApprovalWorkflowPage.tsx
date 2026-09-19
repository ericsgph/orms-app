const approvalRows = [
  { id: 'RISK-2026-041', title: 'Payment resilience gap', type: 'Risk acceptance', requester: 'Maya Patel', stage: 'Risk Manager', stageIndex: 2, age: '1 day', severity: 'High', state: 'Awaiting decision' },
  { id: 'RISK-2026-038', title: 'Vendor concentration exposure', type: 'Treatment plan', requester: 'Sam Rivera', stage: 'Compliance', stageIndex: 1, age: '3 days', severity: 'Critical', state: 'Escalated' },
  { id: 'INC-2026-014', title: 'Payment processing interruption', type: 'Incident closure', requester: 'Jordan Lee', stage: 'Board committee', stageIndex: 3, age: '5 hours', severity: 'High', state: 'Awaiting decision' },
]

const workflowStages = [
  { number: '01', title: 'Submit', detail: 'Owner records the decision, evidence, and requested outcome.' },
  { number: '02', title: 'Review', detail: 'Risk and compliance teams challenge the exposure and controls.' },
  { number: '03', title: 'Approve', detail: 'The delegated authority accepts, rejects, or requests changes.' },
  { number: '04', title: 'Record', detail: 'The decision and rationale become part of the audit trail.' },
]

export default function ApprovalWorkflowPage() {
  return (
    <section className="approval-page">
      <header className="approval-header">
        <div>
          <p className="eyebrow">Decision governance</p>
          <h1>Approval Workflow &amp; Escalation</h1>
          <p>Route risk decisions to the right authority, escalate material exceptions, and preserve a clear record of every decision.</p>
        </div>
        <div className="approval-header-meta"><span>Governance window</span><strong>September 2026</strong><small>Last sync 08:42 UTC</small></div>
      </header>

      <section className="approval-stat-grid" aria-label="Approval summary">
        <div className="approval-stat-card highlight"><span>Awaiting decision</span><strong>8</strong><small>3 high or critical</small></div>
        <div className="approval-stat-card"><span>Approved this month</span><strong>24</strong><small>92% within SLA</small></div>
        <div className="approval-stat-card alert"><span>Escalated</span><strong>3</strong><small>Past delegated limit</small></div>
        <div className="approval-stat-card"><span>Average decision time</span><strong>2.1d</strong><small>Down 0.4 days</small></div>
      </section>

      <section className="approval-panel">
        <div className="approval-panel-heading"><div><p className="eyebrow">Decision queue</p><h2>Items requiring approval</h2></div><div className="approval-filters"><select aria-label="Filter approval state" defaultValue="All states"><option>All states</option><option>Awaiting decision</option><option>Escalated</option></select><select aria-label="Filter approval authority" defaultValue="All authorities"><option>All authorities</option><option>Risk Manager</option><option>Compliance</option><option>Board committee</option></select></div></div>
        <div className="approval-table-wrap">
          <table className="approval-table"><thead><tr><th>Request</th><th>Requester</th><th>Current stage</th><th>Severity</th><th>Age</th><th>State</th></tr></thead><tbody>
            {approvalRows.map((row) => <tr key={row.id}><td><span className="approval-id">{row.id} · {row.type}</span><strong>{row.title}</strong></td><td>{row.requester}</td><td><div className="approval-stage"><span>{row.stageIndex} of 4</span><small>{row.stage}</small></div></td><td><span className={`badge ${row.severity === 'Critical' ? 'danger' : 'warning'}`}>{row.severity}</span></td><td>{row.age}</td><td><span className={`approval-state approval-state-${row.state === 'Escalated' ? 'escalated' : 'pending'}`}>{row.state}</span></td></tr>)}
          </tbody></table>
        </div>
      </section>

      <section className="approval-lower-grid">
        <section className="approval-panel">
          <div className="approval-panel-heading"><div><p className="eyebrow">Routing model</p><h2>Approval path</h2></div><span className="approval-panel-note">Standard risk decision</span></div>
          <div className="workflow-path">{workflowStages.map((stage, index) => <div className="workflow-stage" key={stage.number}><span>{stage.number}</span><div><strong>{stage.title}</strong><p>{stage.detail}</p></div>{index < workflowStages.length - 1 ? <i aria-hidden="true" /> : null}</div>)}</div>
        </section>
        <section className="approval-panel escalation-panel">
          <div><p className="eyebrow">Threshold-based escalation</p><h2>Escalation rules</h2></div>
          <div className="escalation-rule"><span className="badge danger">Critical</span><p>Route directly to senior management and board committee.</p></div>
          <div className="escalation-rule"><span className="badge warning">High</span><p>Escalate when unresolved after 3 business days.</p></div>
          <div className="escalation-rule"><span className="badge success">SLA</span><p>Notify the next authority when an approval window expires.</p></div>
        </section>
      </section>

      <section className="approval-audit-strip"><div><p className="eyebrow">Audit trail</p><strong>Every approval preserves the decision, authority, timestamp, and rationale.</strong></div><span>Last recorded decision: 15 Sep 2026 · Risk Manager</span></section>
    </section>
  )
}
