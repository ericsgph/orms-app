const kriRows = [
  { name: 'Critical system availability', owner: 'Technology', current: '99.91%', threshold: '≥ 99.90%', trend: 'Stable', tone: 'success', bars: [72, 74, 76, 77, 78, 80, 81] },
  { name: 'High-risk vendor exposure', owner: 'Third Party', current: '14.2%', threshold: '≤ 12.0%', trend: 'Breached', tone: 'danger', bars: [42, 48, 53, 58, 61, 70, 78] },
  { name: 'Overdue risk actions', owner: 'Operations', current: '8', threshold: '≤ 10', trend: 'Improving', tone: 'success', bars: [76, 70, 67, 58, 53, 48, 44] },
  { name: 'Regulatory reporting timeliness', owner: 'Compliance', current: '96.4%', threshold: '≥ 95.0%', trend: 'Watch', tone: 'warning', bars: [84, 82, 79, 77, 73, 74, 72] },
]

const breachRows = [
  { name: 'High-risk vendor exposure', value: '14.2%', threshold: '12.0%', owner: 'Third Party', age: '6 days' },
  { name: 'Privileged access exceptions', value: '7', threshold: '≤ 5', owner: 'Technology', age: '2 days' },
]

export default function KriMonitoringPage() {
  return (
    <section className="kri-page">
      <header className="kri-header">
        <div>
          <p className="eyebrow">Early warning signals</p>
          <h1>Key Risk Indicator Monitoring</h1>
          <p>Monitor risk thresholds and trend-based signals to identify emerging exposure before it becomes a material event.</p>
        </div>
        <div className="kri-header-meta"><span>Monitoring period</span><strong>September 2026</strong><small>Last refresh 08:42 UTC</small></div>
      </header>

      <section className="kri-stat-grid" aria-label="KRI summary">
        <div className="kri-stat-card highlight"><span>Indicators monitored</span><strong>28</strong><small>Across 8 business units</small></div>
        <div className="kri-stat-card"><span>Within threshold</span><strong>21</strong><small>75% of active KRIs</small></div>
        <div className="kri-stat-card"><span>Under watch</span><strong>5</strong><small>Trending toward limit</small></div>
        <div className="kri-stat-card alert"><span>Breached</span><strong>2</strong><small>Require owner action</small></div>
      </section>

      <section className="kri-panel">
        <div className="kri-panel-heading"><div><p className="eyebrow">Live register</p><h2>Indicator health</h2></div><select aria-label="Filter indicators" defaultValue="all"><option value="all">All indicators</option><option value="breached">Breached</option><option value="watch">Under watch</option></select></div>
        <div className="kri-grid">
          {kriRows.map((row) => <article className="kri-card" key={row.name}>
            <div className="kri-card-heading"><div><h3>{row.name}</h3><span>{row.owner}</span></div><span className={`badge ${row.tone}`}>{row.trend}</span></div>
            <div className="kri-card-values"><div><small>Current</small><strong>{row.current}</strong></div><div><small>Threshold</small><strong>{row.threshold}</strong></div></div>
            <div className="kri-sparkline" aria-label={`${row.name} seven day trend`} role="img">{row.bars.map((height, index) => <span key={`${row.name}-${index}`} style={{ height: `${height}%` }} />)}</div>
            <div className="kri-card-footer"><span>7-day trend</span><span className={`kri-trend-${row.tone}`}>{row.trend === 'Breached' ? 'Above limit' : row.trend === 'Watch' ? 'Approaching limit' : 'Within appetite'}</span></div>
          </article>)}
        </div>
      </section>

      <section className="kri-lower-grid">
        <section className="kri-panel">
          <div className="kri-panel-heading"><div><p className="eyebrow">Exception management</p><h2>Threshold breaches</h2></div><span className="kri-panel-note">2 open</span></div>
          <div className="kri-breach-list">{breachRows.map((row) => <div className="kri-breach-row" key={row.name}><div><strong>{row.name}</strong><span>{row.owner} · Open for {row.age}</span></div><div className="kri-breach-values"><strong>{row.value}</strong><small>Limit {row.threshold}</small></div></div>)}</div>
          <div className="kri-callout"><strong>Escalation required</strong><span>Confirm an owner and action plan for each breach before the next governance review.</span></div>
        </section>
        <section className="kri-panel kri-method-panel">
          <div><p className="eyebrow">Monitoring method</p><h2>From signal to decision</h2></div>
          <div className="kri-method-step"><span>01</span><div><strong>Set thresholds</strong><p>Define appetite limits and warning bands for each indicator.</p></div></div>
          <div className="kri-method-step"><span>02</span><div><strong>Watch movement</strong><p>Review direction and velocity, not just the latest value.</p></div></div>
          <div className="kri-method-step"><span>03</span><div><strong>Escalate exceptions</strong><p>Turn material breaches into accountable actions and reporting.</p></div></div>
        </section>
      </section>
    </section>
  )
}
