import { useQuery } from '@tanstack/react-query'
import { riskEventService } from '../services/riskEventService'
import { QUERY_KEYS } from '../constants/routes'

export const useRiskEvents = () =>
  useQuery({
    queryKey: [QUERY_KEYS.riskEvents],
    queryFn: () => riskEventService.getAll(),
  })
