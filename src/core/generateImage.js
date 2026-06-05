/* 프롬프트 → 이미지 생성 — Supabase Edge Function(서버측 Google Gemini 이미지 모델) 호출
 *
 * 텍스트 다듬기(refine.js)와 동일한 보안 모델: Google 키는 서버 시크릿,
 * 프론트는 anon 키로 엣지 펑션만 호출한다.
 * 미설정 환경에서는 명확한 안내 에러를 던져(업로드로 유도) UX를 깨지 않는다. */

const URL = import.meta.env.VITE_SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FN = import.meta.env.VITE_GENERATE_FUNCTION || "generate-image";
const TIMEOUT_MS = 60000; // 이미지 생성은 텍스트보다 오래 걸림

export function imageGenConfigured() {
  return Boolean(URL && ANON);
}

/** 프롬프트로 이미지를 생성해 data URL 반환. 실패 시 사용자 친화적 에러를 throw. */
export async function generateImage(prompt) {
  if (!imageGenConfigured()) {
    throw new Error("AI 이미지 생성은 Supabase 설정 후 사용할 수 있어요. 외부에서 만든 그림은 ‘직접 업로드’로 추가하세요.");
  }
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
      body: JSON.stringify({ prompt }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      let msg = `이미지 생성 오류 (${res.status})`;
      try { const d = await res.json(); if (d && d.error) msg = d.error; } catch (_) { /* ignore */ }
      throw new Error(msg);
    }
    const data = await res.json();
    if (!data || !data.dataUrl) {
      throw new Error(data && data.error ? data.error : "이미지를 받지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
    return data.dataUrl;
  } catch (e) {
    if (e && e.name === "AbortError") {
      throw new Error("이미지 생성이 지연돼요. 잠시 후 다시 시도해 주세요.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
