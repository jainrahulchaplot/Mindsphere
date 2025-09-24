export type StartSessionReq = { mood: string; duration: number };
export type StartSessionRes = { script: string; paragraphs: string[] };

export type TTSReq = { paragraphs: string[] };
export type TTSRes = { session_id: string; audio_urls: string[] };

export type JournalReq = { text: string; session_id?: string | null; user_id?: string | null };
export type JournalRes = { summary: string; emotions: string[]; stored?: boolean; note?: string };

export type StreaksRes = { current_streak: number; best_streak: number; note?: string };
