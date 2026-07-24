import { API_BASE_URL } from '@/services/api';

export type Citation = { filename: string; snippet: string; chunk_index: number };

export type ChatApiResponse = {
  answer: string;
  found_in_manuals: boolean;
  citations: Citation[];
  session_id: string;
};

export async function sendChatMessage(
  question: string,
  opts: { machineId?: string | null; sessionId?: string | null } = {},
): Promise<ChatApiResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      machine_id: opts.machineId ?? null,
      session_id: opts.sessionId ?? null,
    }),
  });

  if (!res.ok) throw new Error(`Chat request failed (${res.status})`);
  return res.json();
}
