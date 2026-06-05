import { useEffect, useRef, useState, useCallback } from "react";
import { frameMetrics, clampN, clampScale } from "../core/transform.js";

const ZOOM_STEP = 0.25;
const WHEEL_STEP = 0.12;

/**
 * 초상화 이미지의 드래그 이동 + 휠 줌을 처리하고, 현재 transform 의 CSS style 을 계산.
 * @param frameRef  .pframe 요소 ref
 * @param imgT      { scale, nx, ny }
 * @param setImgT   transform 업데이트 함수((updater)=>void)
 * @param active    이미지가 있을 때만 true (없으면 no-op)
 */
export function useImageFraming(frameRef, imgT, setImgT, active) {
  const [natural, setNatural] = useState(null); // {w,h}
  const [frame, setFrame] = useState(null);      // {w,h}
  const drag = useRef(null);

  /* 프레임 크기 측정 (반응형/리사이즈 대응) */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameRef]);

  /* 휠 줌 (passive:false 로 페이지 영향 차단) */
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !active) return;
    const onWheel = (e) => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      setImgT((t) => ({ ...t, scale: +clampScale((t.scale || 1) + dir * WHEEL_STEP).toFixed(3) }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [frameRef, active, setImgT]);

  const onImgLoad = useCallback((e) => {
    setNatural({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  }, []);

  /* 드래그 이동 */
  const onPointerDown = useCallback((e) => {
    if (!active || !natural || !frame) return;
    if (e.currentTarget.setPointerCapture) {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    }
    drag.current = { x: e.clientX, y: e.clientY, nx: imgT.nx, ny: imgT.ny };
  }, [active, natural, frame, imgT.nx, imgT.ny]);

  const onPointerMove = useCallback((e) => {
    if (!drag.current || !natural || !frame) return;
    const { mx, my } = frameMetrics(natural.w, natural.h, frame.w, frame.h, imgT.scale);
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    const nx = mx > 0 ? clampN(drag.current.nx + dx / mx) : 0;
    const ny = my > 0 ? clampN(drag.current.ny + dy / my) : 0;
    setImgT((t) => ({ ...t, nx, ny }));
  }, [natural, frame, imgT.scale, setImgT]);

  const onPointerUp = useCallback((e) => {
    drag.current = null;
    if (e.currentTarget.releasePointerCapture) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    }
  }, []);

  /* ±버튼 줌 */
  const zoom = useCallback((dir) => {
    setImgT((t) => ({ ...t, scale: +clampScale((t.scale || 1) + dir * ZOOM_STEP).toFixed(3) }));
  }, [setImgT]);

  /* CSS transform 계산 */
  let style = { transform: "none" };
  if (active && natural && frame) {
    const { mx, my } = frameMetrics(natural.w, natural.h, frame.w, frame.h, imgT.scale);
    const tx = clampN(imgT.nx) * mx;
    const ty = clampN(imgT.ny) * my;
    style = { transform: `translate(${tx}px, ${ty}px) scale(${clampScale(imgT.scale)})` };
  }

  return { style, onImgLoad, onPointerDown, onPointerMove, onPointerUp, zoom };
}
