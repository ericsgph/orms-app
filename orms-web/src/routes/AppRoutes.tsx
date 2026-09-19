import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import RiskEventsPage from '../pages/RiskEventsPage'
import RiskEventDetailPage from '../pages/RiskEventDetailPage'
import InherentAssessmentPage from '../pages/InherentAssessmentPage'
import { ROUTES } from '../constants/routes'

/**
 * AppRoutes is a component that defines the routes for the application.
 * It uses the Routes component from react-router-dom to define the routes.
 * The routes are defined as follows:
 * - The root path "/" redirects to the dashboard.
 * - The "/dashboard" path renders the DashboardPage component.
 * - The "/risk-events" path renders the RiskEventsPage component.
 * - The "/risk-events/:id" path renders the RiskEventDetailPage component with the specified id.
 * - The "/risk-events/:id/inherent-assessment" path renders the InherentAssessmentPage component with the specified id.
 * - Any other path redirects to the dashboard.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
      <Route path={ROUTES.dashboard} element={<DashboardPage />} />
      <Route path={ROUTES.riskEvents} element={<RiskEventsPage />} />
      <Route path={ROUTES.riskEventDetail} element={<RiskEventDetailPage />} />
      <Route path={ROUTES.inherentAssessment} element={<InherentAssessmentPage />} />
      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}
