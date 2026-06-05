/** 하단 액션바 — AI 완성 · 복사 · PDF · HTML · 초기화 */
export default function FootBar({ loading, onAI, onCopy, onPDF, onHTML, onReset }) {
  return (
    <div className="footbar">
      <button className="btn ai" onClick={onAI} disabled={loading}>
        {loading ? (<><span className="spin"></span> 다듬는 중…</>) : (<>✨ AI로 완성</>)}
      </button>
      <button className="btn g" onClick={onCopy}>📋 복사</button>
      <button className="btn g" onClick={onPDF}>📄 PDF</button>
      <button className="btn g" onClick={onHTML}>💾 HTML</button>
      <div className="foot-spacer"></div>
      <button className="resetbtn" onClick={onReset}>초기화</button>
    </div>
  );
}
