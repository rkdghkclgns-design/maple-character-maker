/* AI 다듬기 — Supabase Edge Function(서버측 Gemini) 호출 + 오프라인 폴백
 *
 * 동작:
 *  1) VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 설정되어 있으면
 *     해당 프로젝트의 `refine` 엣지 펑션을 호출해 Gemini 결과를 받습니다.
 *  2) 미설정·오류·타임아웃 시에는 내장 결정론적 빌더로 자동 폴백합니다.
 *     (앱이 서버 없이도 항상 동작하도록 보장)
 */

import { imagePrompt, summary } from "./prompt.js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FN = import.meta.env.VITE_REFINE_FUNCTION || "refine";
const TIMEOUT_MS = 25000;

/** 엣지 펑션이 설정되어 있는지 */
export function aiConfigured() {
  return Boolean(URL && ANON);
}

function localResult(state) {
  return { imagePrompt: imagePrompt(state), lore: summary(state), fallback: true };
}

async function callEdge(state) {
  const endpoint = `${String(URL).replace(/\/$/, "")}/functions/v1/${FN}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
      },
      body: JSON.stringify({ state }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`엣지 펑션 오류 (${res.status})`);
    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return {
      imagePrompt: (data && data.imagePrompt ? data.imagePrompt : imagePrompt(state)).trim(),
      lore: (data && data.lore ? data.lore : summary(state)).trim(),
      fallback: false,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 캐릭터 상태를 받아 { imagePrompt, lore, fallback } 반환.
 * 엣지 펑션 실패 시 조용히 오프라인 결과로 폴백한다.
 */
export async function refine(state) {
  if (!aiConfigured()) return localResult(state);
  try {
    return await callEdge(state);
  } catch (e) {
    // 네트워크/타임아웃/서버 오류 → 오프라인 빌더로 폴백
    return localResult(state);
  }
}
