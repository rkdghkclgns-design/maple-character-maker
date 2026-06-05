/* 결정론적 프롬프트 조립 (AI 없이도 동작) — 실시간 미리보기 & 오프라인 폴백용 */

/** 입력값으로 이미지 생성 AI용 영어 프롬프트를 조립 */
export function imagePrompt(s) {
  const parts = [];
  parts.push("cute 2D side-scrolling MMORPG character art, MapleStory-inspired style");
  if (s.age) parts.push(s.age);
  if (s.job) parts.push(s.job + " class");
  if (s.hair) parts.push(s.hair + " hair");
  if (s.eyes) parts.push(s.eyes);
  if (s.outfit) parts.push("wearing " + s.outfit);
  if (s.weapon) parts.push("holding " + s.weapon);
  if (s.color) parts.push("signature color palette: " + s.color);
  if (s.element) parts.push(s.element + " elemental aura");
  if (s.moods.length) parts.push(s.moods.join(", ") + " vibe");
  parts.push("chibi proportions, big expressive eyes, bright saturated colors, clean cel-shading, soft outline, full body, plain background");
  return parts.join(", ");
}

/** 입력값으로 한국어 설정 요약을 조립 */
export function summary(s) {
  const L = [];
  const line = (k, v) => { if (v && String(v).trim()) L.push(`· ${k}: ${v}`); };
  L.push(`【 ${s.name || "이름 미정"} 】`);
  if (s.concept) L.push(`“${s.concept}”`);
  L.push("");
  L.push("◆ 세계관");
  line("출신", s.region); line("시대", s.era);
  if (s.backstory) L.push(`· 이야기: ${s.backstory}`);
  L.push("");
  L.push("◆ 외형");
  line("성별·나이", s.age); line("헤어", s.hair); line("눈·인상", s.eyes);
  line("복장", s.outfit); line("컬러", s.color);
  if (s.moods.length) line("분위기", s.moods.join(", "));
  L.push("");
  L.push("◆ 스킬");
  line("속성", s.element); line("무기", s.weapon);
  s.skills.forEach((sk) => { if (sk.name) L.push(`· ${sk.name}${sk.desc ? " — " + sk.desc : ""}`); });
  L.push("");
  L.push("◆ 역할");
  line("직업군", s.job); line("파티 역할", s.party); line("플레이", s.playstyle);
  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
