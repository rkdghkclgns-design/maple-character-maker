/* =====================================================================
   Supabase Edge Function: refine
   캐릭터 설정(state)을 받아 Google Gemini 로 이미지 프롬프트 + 설정 요약을 생성.
   ⚠️ GEMINI_API_KEY 는 서버(시크릿)에만 보관 — 브라우저로 노출되지 않음.

   배포:
     supabase secrets set GEMINI_API_KEY=xxxxx
     supabase functions deploy refine
   ===================================================================== */

// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

/** Gemini 에게 줄 한국어 지시문 (JSON 모드와 함께 사용) */
function buildInstruction(state: any): string {
  return [
    "너는 메이플스토리 풍 귀여운 2D 판타지 캐릭터 컨셉 디자이너야. 아래 캐릭터 설정을 바탕으로 두 가지를 만들어줘.",
    "imagePrompt: 이미지 생성 AI용 영어 프롬프트 1단락(60~90단어). 'cute 2D MMORPG character art, MapleStory-inspired style'로 시작하고 외형·복장·무기·색감·분위기를 생생히 묘사, 끝에 'chibi proportions, big eyes, bright colors, clean cel-shading, full body, plain background'.",
    "lore: 한국어 설정 요약 3~4문장(세계관·성격·역할). 비어있는 항목은 톤에 맞게 자연스럽게 상상해 채워.",
    "설정(JSON): " + JSON.stringify(state ?? {}),
  ].join("\n");
}

async function callGemini(state: any, apiKey: string, model: string) {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildInstruction(state) }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            imagePrompt: { type: "string" },
            lore: { type: "string" },
          },
          required: ["imagePrompt", "lore"],
        },
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429 || /RESOURCE_EXHAUSTED|prepayment credits/i.test(detail)) {
      throw new Error("Gemini 사용량이 소진됐어요(크레딧/쿼터 초과). Google AI Studio에서 결제·크레딧을 확인해 주세요.");
    }
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  // JSON 모드라 보통 곧바로 파싱되지만, 안전하게 중괄호 구간만 추출해 시도
  let obj: any = {};
  try {
    obj = JSON.parse(text);
  } catch {
    const a = text.indexOf("{");
    const b = text.lastIndexOf("}");
    if (a !== -1 && b !== -1) {
      try { obj = JSON.parse(text.slice(a, b + 1)); } catch { obj = {}; }
    }
  }
  return {
    imagePrompt: typeof obj.imagePrompt === "string" ? obj.imagePrompt.trim() : "",
    lore: typeof obj.lore === "string" ? obj.lore.trim() : text.trim(),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const apiKey = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) return json({ error: "서버에 GEMINI_API_KEY 가 설정되지 않았어요." }, 500);

  const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";

  let state: any = {};
  try {
    const body = await req.json();
    state = body?.state ?? {};
  } catch {
    return json({ error: "잘못된 요청 본문" }, 400);
  }

  try {
    const out = await callGemini(state, apiKey, model);
    return json(out);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 502);
  }
});
