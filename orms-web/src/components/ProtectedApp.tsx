import { useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { logout } from '../auth'
import type { CurrentUser } from '../auth'
import InherentAssessmentPage from '../pages/InherentAssessmentPage'
import RiskEventDetailPage from '../pages/RiskEventDetailPage'
import RiskEventsPage from '../pages/RiskEventsPage'
import {
  ApprovalWorkflowPage,
  IncidentReportingPage,
  IssuesAndActionsPage,
  KriMonitoringPage,
  ManagementReportingPage,
  MeasurementMitigationPage,
  NewRiskReviewPage,
  RCSAPage,
  RiskRegisterPage,
  UserMaintenancePage,
} from '../pages'

const pagesByRole: Record<string, string[]> = {
  admin: [
    'Risk Register',
    'RCSA',
    'Loss / Incident',
    'KRI Monitoring',
    'Issues & Actions',
    'Approval Workflow',
    'Management Reporting',
    'Measurement & Mitigation',
    'User Maintenance',
  ],
  risk_manager: ['Risk Register', 'RCSA', 'KRI Monitoring', 'Issues & Actions', 'Management Reporting', 'Measurement & Mitigation'],
  compliance_officer: [
    'Inherent Assessment',
    'RCSA',
    'Loss / Incident',
    'KRI Monitoring',
    'Issues & Actions',
    'Management Reporting',
    'Measurement & Mitigation',
  ],
  auditor: ['Risk Register', 'RCSA', 'Approval Workflow', 'Management Reporting', 'Measurement & Mitigation'],
}

const pageMap = [
  { name: 'Risk Register', path: '/risk-events', component: RiskEventsPage },
  { name: 'Inherent Assessment', path: '/inherent-assessment', component: InherentAssessmentPage },
  { name: 'RCSA', path: '/rcsa', component: RCSAPage },
  { name: 'Loss / Incident', path: '/loss-incidents', component: IncidentReportingPage },
  { name: 'KRI Monitoring', path: '/kri-monitoring', component: KriMonitoringPage },
  { name: 'Issues & Actions', path: '/issues-actions', component: IssuesAndActionsPage },
  { name: 'Approval Workflow', path: '/approval-workflow', component: ApprovalWorkflowPage },
  { name: 'Management Reporting', path: '/management-reporting', component: ManagementReportingPage },
  { name: 'Measurement & Mitigation', path: '/measurement-mitigation', component: MeasurementMitigationPage },
  { name: 'User Maintenance', path: '/user-maintenance', component: UserMaintenancePage },
]

export default function ProtectedApp({ user, onLogout }: { user: CurrentUser; onLogout: () => void }) {
  const [activePage, setActivePage] = useState('Risk Register')
  const navigate = useNavigate()

  const allowedPages = useMemo(() => {
    const rolePages = pagesByRole[user.role] ?? []
    return pageMap.filter((page) => rolePages.includes(page.name))
  }, [user.role])

  const renderPage = (pageName: string) => {
    const Component = allowedPages.find((page) => page.name === pageName)?.component ?? allowedPages[0]?.component ?? RiskRegisterPage
    return <Component />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">OR</span>
          <div>
            <p className="brand-label">ORM</p>
            <small>{user.role.replace('_', ' ')}</small>
          </div>
        </div>

        <div className="user-card">
          <p className="eyebrow">Signed in</p>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              logout()
              onLogout()
              navigate('/login', { replace: true })
            }}
          >
            Logout
          </button>
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          {allowedPages.map(({ name }) => (
            <NavLink
              key={name}
              to={allowedPages.find((page) => page.name === name)?.path ?? '/dashboard'}
              className={`nav-button ${activePage === name ? 'active' : ''}`}
              onClick={() => setActivePage(name)}
            >
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Operational Risk Management</h1>
          </div>
          <button type="button" className="primary-button" onClick={() => navigate('/new-risk-review')}>
            New Risk Review
          </button>
        </header>

        <section className="overview-grid">
          <div className="stat-card highlight">
            <span>Risk Exposure</span>
            <strong>24.8%</strong>
            <small>Above target</small>
          </div>
          <div className="stat-card">
            <span>Open Actions</span>
            <strong>18</strong>
            <small>7 overdue</small>
          </div>
          <div className="stat-card">
            <span>Open Incidents</span>
            <strong>6</strong>
            <small>2 high severity</small>
          </div>
          <div className="stat-card">
            <span>KRIs Breached</span>
            <strong>3</strong>
            <small>2 under review</small>
          </div>
        </section>

        <div className="page-holder">
          <Routes>
            <Route path="/risk-events" element={<RiskEventsPage />} />
            <Route path="/risk-events/:id" element={<RiskEventDetailPage />} />
            <Route path="/risk-events/:id/inherent-assessment" element={<InherentAssessmentPage />} />
            <Route path="/new-risk-review" element={<NewRiskReviewPage />} />
            {allowedPages.map(({ name, path }) => (
              <Route key={name} path={path} element={renderPage(name)} />
            ))}
            <Route path="*" element={renderPage(activePage)} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
