import { useQuery } from '@tanstack/react-query';
import { get } from '../api/client';

export function useBoats(params) {
  return useQuery({
    queryKey: ['boats', params],
    queryFn: () => get('/catalogue/boats', { params }),
    staleTime: 5 * 60 * 1000,
  });
}
