/** 프롬프트 탭 — 프롬프트 토글, AI 플래그, 복사·이미지 생성 AI 바로가기·업로드 */
const IMAGE_AI_URL = "https://labs.google/fx/ko/tools/flow";

export default function PromptTab({
  sub, setSub, ai, imgText, loreText, hasImage, onCopy, onAddImage,
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
        <button className="btn gen" onClick={onCopy}>📋 프롬프트 복사하기</button>
        <button className="btn g" onClick={onAddImage}>🖼 직접 업로드</button>
      </div>

      <a className="ai-launch" href={IMAGE_AI_URL} target="_blank" rel="noopener noreferrer">
        <span className="ail-ic">🎨</span>
        <span className="ail-tx">
          <b>이미지 생성 AI 바로가기</b>
          <small>복사한 프롬프트로 Google Flow에서 그림 만들기 ↗</small>
        </span>
      </a>

      {hasImage ? (
        <div className="addimg done">
          <b>✓ 초상화(①)에 적용됨</b>
          <span>왼쪽에서 크기·위치 조정 · 교체 · 삭제</span>
        </div>
      ) : (
        <div className="genhint">
          ① <b>프롬프트 복사</b> → ② <b>이미지 생성 AI</b>에서 그림 생성 → ③ <b>🖼 직접 업로드</b>로 초상화에 넣기
        </div>
      )}
    </div>
  );
}
