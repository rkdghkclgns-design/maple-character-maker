/** 프롬프트 탭 — 이미지 프롬프트/설정 요약 토글, AI 플래그, 이미지 생성·추가 */
export default function PromptTab({
  sub, setSub, ai, imgText, loreText, hasImage, onGenerate, generating, onAddImage,
}) {
  return (
    <div>
      <div className="subtoggle">
        <button className={sub === "img" ? "on" : ""} onClick={() => setSub("img")}>✨ 이미지 프롬프트</button>
        <button className={sub === "lore" ? "on" : ""} onClick={() => setSub("lore")}>📜 설정 요약</button>
      </div>
      {ai && <div className="ai-flag">✦ AI 완성</div>}
      <div className="promptbox">{sub === "img" ? imgText : loreText}</div>
      <div className="hint">💡 ‘AI로 완성’을 누르면 빈 항목까지 상상해 멋진 프롬프트로 다듬어줘요.</div>

      <div className="genrow">
        <button className="btn gen" onClick={onGenerate} disabled={generating}>
          {generating ? (<><span className="spin"></span> 생성 중…</>) : (<>🎨 {hasImage ? "다시 생성" : "이 프롬프트로 생성하기"}</>)}
        </button>
        <button className="btn g" onClick={onAddImage}>🖼 직접 업로드</button>
      </div>

      {hasImage ? (
        <div className="addimg done">
          <b>✓ 초상화(①)에 적용됨</b>
          <span>왼쪽에서 크기·위치 조정 · 교체 · 삭제</span>
        </div>
      ) : (
        <div className="genhint">
          생성된 이미지는 왼쪽 초상화(①)에 자동 적용돼요. 외부 AI로 만든 그림은 ‘직접 업로드’로 넣을 수 있어요.
        </div>
      )}
    </div>
  );
}
