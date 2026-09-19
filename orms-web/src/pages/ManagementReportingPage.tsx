const portfolioRows = [
  { label: 'Overall exposure', value: '24.8%', change: '+2.4%', context: 'Above appetite', tone: 'danger', bars: [42, 48, 47, 55, 61, 64, 72] },
  { label: 'Residual high risks', value: '22', change: '-3', context: 'Improving', tone: 'success', bars: [70, 68, 64, 59, 56, 52, 48] },
  { label: 'Action closure rate', value: '88%', change: '+6.2%', context: 'On target', tone: 'success', bars: [45, 48, 56, 60, 68, 72, 78] },
]

const exceptions = [
  { title: 'Vendor concentration exposure', detail: 'KRI above threshold for 6 days', owner: 'Third Party Risk', tone: 'danger' },
  { title: 'Payment resilience gap', detail: 'High-risk treatment awaiting approval', owner: 'Technology', tone: 'warning' },
  { title: 'Regulatory reporting timeliness', detail: 'Trend approaching warning limit', owner: 'Compliance', tone: 'warning' },
]

export default function ManagementReportingPage() {
  return (
    <section className="reporting-page">
      <header className="reporting-header">
        <div>
          <p className="eyebrow">Executive view</p>
          <h1>Management Reporting &amp; Dashboards</h1>
          <p>Summarize risk exposure, trends, actions, and governance metrics in a decision-ready view for senior management and the board.</p>
        </div>
        <div className="reporting-controls"><label htmlFor="reporting-period">Reporting period</label><select id="reporting-period" defaultValue="sep-2026"><option value="sep-2026">September 2026</option><option value="aug-2026">August 2026</option><option value="q3-2026">Q3 2026</option></select><small>Prepared 15 Sep 2026</small></div>
      </header>

      <section className="reporting-stat-grid" aria-label="Management summary">
        <div className="reporting-stat-card highlight"><span>Portfolio posture</span><strong>Watch</strong><small>2 material exceptions</small></div>
        <div className="reporting-stat-card"><span>Risk exposure</span><strong>24.8%</strong><small>2.4% above appetite</small></div>
        <div className="reporting-stat-card"><span>Open actions</span><strong>18</strong><small>7 due this month</small></div>
        <div className="reporting-stat-card"><span>KRIs breached</span><strong>2</strong><small>1 critical trend</small></div>
      </section>

      <section className="reporting-panel">
        <div className="reporting-panel-heading"><div><p className="eyebrow">Portfolio dashboard</p><h2>Risk posture over time</h2></div><span className="reporting-panel-note">7-month view</span></div>
        <div className="reporting-trend-grid">{portfolioRows.map((row) => <article className="reporting-trend-card" key={row.label}><div className="reporting-trend-heading"><span>{row.label}</span><span className={`badge ${row.tone}`}>{row.change}</span></div><strong>{row.value}</strong><small>{row.context}</small><div className="reporting-bars" aria-label={`${row.label} trend`} role="img">{row.bars.map((height, index) => <span key={`${row.label}-${index}`} style={{ height: `${height}%` }} />)}</div></article>)}</div>
      </section>

      <section className="reporting-lower-grid">
        <section className="reporting-panel">
          <div className="reporting-panel-heading"><div><p className="eyebrow">Exception reporting</p><h2>Items for leadership attention</h2></div><span className="reporting-panel-note">3 open</span></div>
          <div className="reporting-exception-list">{exceptions.map((item) => <div className="reporting-exception" key={item.title}><span className={`reporting-exception-marker ${item.tone}`} aria-hidden="true" /><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.owner}</small></div><span className="reporting-arrow" aria-hidden="true">→</span></div>)}</div>
        </section>
        <section className="reporting-panel reporting-briefing-panel">
          <div><p className="eyebrow">Board briefing</p><h2>Key message</h2></div>
          <p className="reporting-briefing-copy">Overall exposure remains manageable, but third-party concentration and payment resilience require focused oversight this month.</p>
          <div className="reporting-briefing-meta"><span>Recommended focus</span><strong>Approve treatment plans and monitor KRI movement weekly.</strong></div>
          <div className="reporting-briefing-footer"><span>Next governance meeting</span><strong>19 Sep 2026</strong></div>
        </section>
      </section>

      <section className="reporting-footer-strip"><div><p className="eyebrow">Report coverage</p><strong>Risk register · KRIs · Incidents · Actions · Approvals</strong></div><span>Prepared for senior management &amp; board review</span></section>
    </section>
  )
}
