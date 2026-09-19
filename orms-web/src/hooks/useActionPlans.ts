import { useQuery } from '@tanstack/react-query'
import { actionPlanService } from '../services/actionPlanService'
import { QUERY_KEYS } from '../constants/routes'

export const useActionPlans = (riskEventId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.actionPlans, riskEventId],
    queryFn: () => actionPlanService.getByRiskEventId(riskEventId),
    enabled: !!riskEventId,
  })
