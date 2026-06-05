/* =====================================================================
   Supabase Edge Function: generate-image
   영어 이미지 프롬프트(prompt)를 받아 Google Gemini 이미지 모델로 그림 생성.
   결과를 data URL(base64) 로 반환 → 프론트가 초상화(①)에 적용.
   ⚠️ GEMINI_API_KEY 는 서버 시크릿에만 보관.

   배포:
     supabase secrets set GEMINI_API_KEY=xxxxx
     # (선택) supabase secrets set GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
     supabase functions deploy generate-image
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

async function generate(prompt: string, apiKey: string, model: string) {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
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
  const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p?.inlineData?.data);
  if (!imgPart) {
    const textPart = parts.find((p) => typeof p?.text === "string");
    const reason = textPart?.text ? `모델 응답: ${String(textPart.text).slice(0, 160)}` : "이미지가 생성되지 않았어요.";
    throw new Error(reason);
  }
  const mime = imgPart.inlineData.mimeType || "image/png";
  return `data:${mime};base64,${imgPart.inlineData.data}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const apiKey = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) return json({ error: "서버에 GEMINI_API_KEY 가 설정되지 않았어요." }, 500);

  const model = Deno.env.get("GEMINI_IMAGE_MODEL") ?? "gemini-2.5-flash-image";

  let prompt = "";
  try {
    const body = await req.json();
    prompt = String(body?.prompt ?? "").trim();
  } catch {
    return json({ error: "잘못된 요청 본문" }, 400);
  }
  if (!prompt) return json({ error: "프롬프트가 비어 있어요." }, 400);

  try {
    const dataUrl = await generate(prompt, apiKey, model);
    return json({ dataUrl });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 502);
  }
});
