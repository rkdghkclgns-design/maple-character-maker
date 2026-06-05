/* 초상화 이미지 프레이밍(크기·위치) 공통 수학.
 * 모델은 해상도 독립적: { scale, nx, ny }
 *   - scale: 1~3 (object-fit cover 위에 추가 확대)
 *   - nx, ny: -1~1 정규화 오프셋 (현재 over-pan 범위 대비 비율)
 * 디스플레이(Portrait)와 export 합성(imageCompose)이 동일 로직을 공유한다. */

export const IDENTITY = { scale: 1, nx: 0, ny: 0 };
export const MIN_SCALE = 1;
export const MAX_SCALE = 3;

export const clampScale = (s) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s || 1));
export const clampN = (v) => Math.max(-1, Math.min(1, v || 0));

/** object-fit: cover 가 되기 위한 기본 배율 */
export function coverScale(iw, ih, fw, fh) {
  if (!iw || !ih) return 1;
  return Math.max(fw / iw, fh / ih);
}

/** 현재 scale 에서 이미지 표시 크기와 가능한 최대 이동량(px) */
export function frameMetrics(iw, ih, fw, fh, scale) {
  const cs = coverScale(iw, ih, fw, fh);
  const dw = iw * cs * clampScale(scale);
  const dh = ih * cs * clampScale(scale);
  return {
    cs,
    dw,
    dh,
    mx: Math.max(0, (dw - fw) / 2), // 좌우로 움직일 수 있는 최대 px
    my: Math.max(0, (dh - fh) / 2), // 상하로 움직일 수 있는 최대 px
  };
}

/** 정규화 transform → 실제 픽셀 translate (clamp 포함) */
export function pixelTranslate(t, iw, ih, fw, fh) {
  const { mx, my } = frameMetrics(iw, ih, fw, fh, t.scale);
  return { tx: clampN(t.nx) * mx, ty: clampN(t.ny) * my };
}
