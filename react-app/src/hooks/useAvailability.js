import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, mutate } from '../api/client';

export function useAvailability(boatId, monthISO) {
  return useQuery({
    queryKey: ['availability', boatId, monthISO],
    queryFn: () => get(`/availability/${boatId}`, { params: { month: monthISO } }),
    enabled: Boolean(boatId),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 15 * 60 * 1000, // background refresh per requirement
  });
}

export function useAvailabilityRefresh() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => mutate('/availability/refresh'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}
