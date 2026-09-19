const riskScale = [
  {
    level: 'Low',
    score: '1-4',
    description: 'Manage through routine controls and periodic review.',
    tone: 'success',
  },
  {
    level: 'Medium',
    score: '5-9',
    description: 'Assign an owner and track treatment actions to completion.',
    tone: 'warning',
  },
  {
    level: 'High',
    score: '10-15',
    description: 'Escalate treatment decisions and increase monitoring frequency.',
    tone: 'danger',
  },
  {
    level: 'Critical',
    score: '16-25',
    description: 'Prioritize immediate action and senior management oversight.',
    tone: 'critical',
  },
]

export default function MeasurementMitigationPage() {
  return (
    <section className="measurement-page">
      <header className="measurement-header">
        <div>
          <p className="eyebrow">Risk governance</p>
          <h1>Measurement &amp; Mitigation</h1>
          <p>
            Apply a consistent view of exposure, treatment cost, and changing risk so decisions remain comparable and actionable.
          </p>
        </div>
        <div className="measurement-header-meta">
          <span>Current framework</span>
          <strong>5 × 5 risk scale</strong>
          <small>Reviewed quarterly</small>
        </div>
      </header>

      <section className="measurement-section">
        <div className="measurement-section-heading">
          <div>
            <p className="eyebrow">01 / Prioritize</p>
            <h2>Measurement and mitigation</h2>
          </div>
          <span>Consistent scoring</span>
        </div>
        <p className="measurement-intro">
          Risks are measured against a consistent scale to allow them to be prioritized and ranked relative to one another. The measurement also weighs the cost of controlling the risk against the potential exposure.
        </p>

        <div className="risk-scale-grid">
          {riskScale.map((item) => (
            <article className="risk-scale-card" key={item.level}>
              <div className="risk-scale-card-topline">
                <span className={`badge ${item.tone}`}>{item.level}</span>
                <strong>{item.score}</strong>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mitigation-grid">
          <article className="measurement-detail-card">
            <span className="measurement-card-label">Measure</span>
            <h3>Rank exposure consistently</h3>
            <p>Combine impact and likelihood to make the relative position of each risk visible across business units and portfolios.</p>
          </article>
          <article className="measurement-detail-card">
            <span className="measurement-card-label">Mitigate</span>
            <h3>Balance cost and benefit</h3>
            <p>Compare treatment cost, control strength, and residual exposure before selecting an action or accepting the risk.</p>
          </article>
        </div>
      </section>

      <section className="measurement-section">
        <div className="measurement-section-heading">
          <div>
            <p className="eyebrow">02 / Stay informed</p>
            <h2>Monitoring and reporting</h2>
          </div>
          <span>Ongoing reassessment</span>
        </div>
        <p className="measurement-intro">
          Risks are monitored through ongoing reassessment to detect changes over time. The risks and any material changes are reported to senior management and the board to inform decision-making.
        </p>

        <div className="monitoring-grid">
          <article className="monitoring-card">
            <span className="monitoring-step">01</span>
            <div>
              <h3>Reassess</h3>
              <p>Review scores, controls, KRIs, and action plans as conditions change.</p>
            </div>
          </article>
          <article className="monitoring-card">
            <span className="monitoring-step">02</span>
            <div>
              <h3>Detect change</h3>
              <p>Surface threshold breaches, overdue treatments, and emerging exposure early.</p>
            </div>
          </article>
          <article className="monitoring-card">
            <span className="monitoring-step">03</span>
            <div>
              <h3>Report</h3>
              <p>Turn material movements into clear decisions for management and the board.</p>
            </div>
          </article>
        </div>

        <div className="reporting-strip">
          <div>
            <span className="measurement-card-label">Reporting focus</span>
            <strong>Material changes and decisions</strong>
          </div>
          <span className="reporting-audience">Senior management <span aria-hidden="true">&amp;</span> Board</span>
        </div>
      </section>
    </section>
  )
}
