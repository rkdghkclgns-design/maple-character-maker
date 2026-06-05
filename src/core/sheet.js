/* 캐릭터 시트 빌더 — 인쇄용 PDF(새 창) & 자체 완결형 HTML 다운로드 (이미지 내장) */

import { imagePrompt } from "./prompt.js";

/** 자체 완결형 캐릭터 시트 HTML 문자열 생성 */
export function buildSheetHTML(s, imgPrompt, lore, opts = {}) {
  const esc = (t) => String(t == null ? "" : t)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const skillRows = s.skills.filter((k) => k.name)
    .map((k) => `<li><b>${esc(k.name)}</b>${k.desc ? " — " + esc(k.desc) : ""}</li>`).join("");
  const moodTags = s.moods.map((m) => `<span class="tag">${esc(m)}</span>`).join("");
  const row = (k, v) => v && String(v).trim() ? `<tr><th>${k}</th><td>${esc(v)}</td></tr>` : "";
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<title>${esc(s.name || "메이플 캐릭터")} — 캐릭터 시트</title>
<link href="https://fonts.googleapis.com/css2?family=Jua&family=Gowun+Dodum&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{font-family:'Gowun Dodum',sans-serif;color:#4a3526;margin:0;padding:46px 52px;background:#fff}
  h1{font-family:'Jua',sans-serif;font-size:34px;margin:0;color:#e8732a}
  .concept{font-style:italic;color:#9a7b5e;margin:4px 0 22px}
  h2{font-family:'Jua',sans-serif;font-size:19px;color:#c8531c;border-bottom:3px solid #f5d9b0;padding-bottom:5px;margin:26px 0 12px}
  table{width:100%;border-collapse:collapse;font-size:14px}
  th{text-align:left;width:120px;color:#a8855f;font-weight:normal;vertical-align:top;padding:5px 8px 5px 0}
  td{padding:5px 0;vertical-align:top}
  ul{margin:6px 0;padding-left:20px;font-size:14px;line-height:1.6}
  .tag{display:inline-block;background:#fbe8cf;color:#bb5a1e;border-radius:20px;padding:3px 12px;margin:3px 4px 0 0;font-size:12px}
  .leaf{color:#e0492f}
  .promptbox{background:#fbf4e6;border:1.5px dashed #e7b87e;border-radius:12px;padding:14px 16px;font-size:12.5px;line-height:1.6;color:#6b4f37;white-space:pre-wrap;word-break:break-word}
  .header{display:flex;align-items:center;gap:12px}
  .badge{display:inline-block;background:#e8732a;color:#fff;font-family:'Jua',sans-serif;font-size:12px;border-radius:8px;padding:4px 12px;margin-right:6px}
  .portrait-img{display:block;max-width:320px;max-height:380px;width:auto;border-radius:16px;border:3px solid #e7b87e;box-shadow:0 8px 22px rgba(200,83,28,.18);margin:14px 0 4px;object-fit:cover}
  footer{margin-top:34px;font-size:11px;color:#bba;text-align:center}
  @media print{body{padding:24px 30px}}
</style></head><body>
  <div class="header"><span class="leaf" style="font-size:30px">🍁</span><h1>${esc(s.name || "이름 미정")}</h1></div>
  ${s.concept ? `<div class="concept">“${esc(s.concept)}”</div>` : '<div class="concept"></div>'}
  <div>
    ${s.job ? `<span class="badge">${esc(s.job)}</span>` : ""}
    ${s.party ? `<span class="badge">${esc(s.party)}</span>` : ""}
    ${s.element ? `<span class="badge">${esc(s.element)}</span>` : ""}
  </div>
  ${s.image ? `<img class="portrait-img" src="${s.image}" alt="캐릭터 이미지">` : ""}

  <h2>🗺 세계관</h2>
  <table>${row("출신 지역", s.region)}${row("시대·분위기", s.era)}${row("배경 이야기", s.backstory)}</table>

  <h2>🎨 외형</h2>
  <table>${row("성별·나이", s.age)}${row("헤어", s.hair)}${row("눈·인상", s.eyes)}${row("복장 & 장비", s.outfit)}${row("시그니처 컬러", s.color)}</table>
  ${moodTags ? `<div style="margin-top:8px">${moodTags}</div>` : ""}

  <h2>⚔ 스킬</h2>
  <table>${row("주력 속성", s.element)}${row("주 무기", s.weapon)}</table>
  ${skillRows ? `<ul>${skillRows}</ul>` : ""}

  <h2>🛡 역할</h2>
  <table>${row("직업군", s.job)}${row("파티 역할", s.party)}${row("플레이 스타일", s.playstyle)}</table>

  <h2>✨ 이미지 생성 프롬프트</h2>
  <div class="promptbox">${esc(imgPrompt || imagePrompt(s))}</div>

  ${lore ? `<h2>📜 설정 요약</h2><div class="promptbox">${esc(lore)}</div>` : ""}

  <footer>메이플 캐릭터 메이커 · ${new Date().toLocaleDateString("ko-KR")}</footer>
  ${opts.print ? `<script>window.onload=function(){setTimeout(function(){window.print();},350);};<\/script>` : ""}
</body></html>`;
  return html;
}

/** 인쇄용 새 창으로 PDF 저장 유도 */
export function exportPDF(s, imgPrompt, lore) {
  const html = buildSheetHTML(s, imgPrompt, lore, { print: true });
  const w = window.open("", "_blank");
  if (!w) { alert("팝업이 차단되었어요. 팝업을 허용해 주세요."); return; }
  w.document.write(html);
  w.document.close();
}

/** 이미지까지 내장된 자체 완결형 .html 파일 다운로드 */
export function exportHTML(s, imgPrompt, lore) {
  const html = buildSheetHTML(s, imgPrompt, lore, { print: false });
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = (s.name || "maple-character").replace(/[\\/:*?"<>|]+/g, "").trim() || "maple-character";
  a.href = url;
  a.download = safe + " 캐릭터 시트.html";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1200);
}
