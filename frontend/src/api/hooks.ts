import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getData } from './client';
import type { StartSessionReq, StartSessionRes, TTSReq, TTSRes, JournalReq, JournalRes, StreaksRes } from './types';

/** Session: generate meditation script */
export function useStartSession() {
  return useMutation<StartSessionRes, Error, StartSessionReq>({
    mutationFn: (body) => getData(api.post('/api/v1/session/start', body))
  });
}

/** TTS: paragraphs -> audio URLs */
export function useTTS() {
  return useMutation<TTSRes, Error, TTSReq>({
    mutationFn: (body) => getData(api.post('/api/v1/session/tts', body))
  });
}

/** Journal: submit entry -> summary/emotions */
export function useJournalSubmit() {
  return useMutation<JournalRes, Error, JournalReq>({
    mutationFn: (body) => getData(api.post('/api/v1/journal/submit', body))
  });
}

/** Streaks: read current/best for a user */
export function useStreaks(userId: string | null) {
  return useQuery<StreaksRes, Error>({
    queryKey: ['streaks', userId],
    enabled: !!userId,
    queryFn: () => getData(api.get(`/api/v1/streaks/${encodeURIComponent(userId!)}`))
  });
}

/** Streaks: update after completion (e.g., after journal submit) */
export function useUpdateStreak() {
  const qc = useQueryClient();
  return useMutation<StreaksRes, Error, { userId: string }>({
    mutationFn: ({ userId }) => getData(api.post(`/api/v1/streaks/${encodeURIComponent(userId)}`)),
    onSuccess: (_data, { userId }) => { qc.invalidateQueries({ queryKey: ['streaks', userId] }); }
  });
}
