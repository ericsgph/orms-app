export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  riskEvents: '/risk-events',
  riskEventDetail: '/risk-events/:id',
  inherentAssessment: '/risk-events/:id/inherent-assessment',
  settings: '/settings',
} as const

export const QUERY_KEYS = {
  riskEvents: 'risk-events',
  actionPlans: 'action-plans',
  businessUnits: 'business-units',
  riskCategories: 'risk-categories',
  users: 'users',
} as const
