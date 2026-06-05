import LeafIcon from "./LeafIcon.jsx";
import { swatchOf } from "../core/swatch.js";
import { IDENTITY } from "../core/transform.js";
import { useImageFraming } from "../hooks/useImageFraming.js";

/** 좌측 초상화 / 실시간 미리보기 패널 — 이미지 드롭존·크기/위치 조정·교체·삭제, 배지·스탯 */
export default function Portrait({
  s, drag, setDrag, onDrop, onPick, onPickFile, onReplace, onDelete, ai, fileRef, pframeRef, setImgT,
}) {
  const swatch = swatchOf(s.color);
  const skillCount = s.skills.filter((k) => k.name).length;
  const noBadges = !(s.job || s.party || s.element || s.region);
  const imgT = s.imgT || IDENTITY;
  const hasImage = !!s.image;

  const fr = useImageFraming(pframeRef, imgT, setImgT, hasImage);

  return (
    <div className="portrait">
      <div
        ref={pframeRef}
        className={"pframe" + (drag ? " drag" : "")}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        {hasImage ? (
          <>
            <img
              className="pimg draggable"
              src={s.image}
              alt="캐릭터 이미지"
              draggable={false}
              style={fr.style}
              onLoad={fr.onImgLoad}
              onPointerDown={fr.onPointerDown}
              onPointerMove={fr.onPointerMove}
              onPointerUp={fr.onPointerUp}
              onPointerCancel={fr.onPointerUp}
            />
            <div className="zoomctrls">
              <button onClick={() => fr.zoom(-1)} title="축소">−</button>
              <span className="zlabel">{Math.round((imgT.scale || 1) * 100)}%</span>
              <button onClick={() => fr.zoom(1)} title="확대">＋</button>
              <button onClick={() => setImgT(IDENTITY)} title="크기·위치 초기화">↺</button>
            </div>
            <div className="imgctrls">
              <button onClick={onReplace}>🔁 교체</button>
              <button onClick={onDelete}>🗑 삭제</button>
            </div>
          </>
        ) : (
          <>
            <div className="glow" style={{ "--g": swatch }}></div>
            <div className="silho">
              <LeafIcon />
              <button className={"dropcta" + (ai ? " nudge" : "")} onClick={onPick}>
                <b>＋ 캐릭터 이미지 추가</b>
                <span>프롬프트로 만든 그림을 끌어다 놓거나<br />클릭·붙여넣기(⌘V)로 업로드</span>
              </button>
              <div className="swatchdot" style={{ background: swatch }}></div>
            </div>
          </>
        )}
        <div className="nameplate">
          <div className="nm">{s.name || "이름 미정"}</div>
          <div className="cc">{s.concept || "한 줄 컨셉을 입력해 보세요"}</div>
        </div>
      </div>

      {hasImage && (
        <div className="framehint">🖐 드래그로 위치 · 휠/±로 크기 조정</div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onPickFile}
      />

      <div className="pbadges">
        {s.job && <span className="pbadge">🛡 {s.job}</span>}
        {s.party && <span className="pbadge">{s.party}</span>}
        {s.element && <span className="pbadge">✦ {s.element}</span>}
        {s.region && <span className="pbadge">📍 {s.region}</span>}
        {noBadges && <span className="pbadge" style={{ opacity: 0.6 }}>설정을 채워보세요</span>}
      </div>

      <div className="pstats">
        <div className="pstat"><b>{skillCount}</b><span>스킬</span></div>
        <div className="pstat"><b>{s.moods.length}</b><span>분위기</span></div>
        <div className="pstat"><b>{s.weapon ? "✓" : "–"}</b><span>무기</span></div>
      </div>
    </div>
  );
}
