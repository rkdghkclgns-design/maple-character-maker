/* 프레이밍(크기·위치)을 캔버스에 구워 평탄화한 이미지 생성 — export(PDF/HTML) WYSIWYG용 */

import { frameMetrics, clampN, clampScale } from "./transform.js";

/**
 * 화면 프레임에 보이는 그대로를 잘라낸 data URL 을 반환.
 * 실패하면 원본 URL 을 그대로 돌려준다(안전 폴백).
 */
export function composeFramedImage(imageURL, t, fw, fh, outScale = 2) {
  return new Promise((resolve) => {
    if (!imageURL || !fw || !fh) { resolve(imageURL); return; }
    const img = new Image();
    img.onerror = () => resolve(imageURL);
    img.onload = () => {
      try {
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const scale = clampScale(t.scale);
        const { cs, mx, my } = frameMetrics(iw, ih, fw, fh, scale);
        const tx = clampN(t.nx) * mx;
        const ty = clampN(t.ny) * my;

        const k = outScale;
        const OW = Math.round(fw * k);
        const OH = Math.round(fh * k);
        const finalScale = cs * scale * k;
        const destW = iw * finalScale;
        const destH = ih * finalScale;
        const cx = OW / 2 + tx * k;
        const cy = OH / 2 + ty * k;

        const cv = document.createElement("canvas");
        cv.width = OW;
        cv.height = OH;
        const ctx = cv.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, cx - destW / 2, cy - destH / 2, destW, destH);

        let out;
        try { out = cv.toDataURL("image/jpeg", 0.9); }
        catch (e) { out = imageURL; }
        resolve(out);
      } catch (e) {
        resolve(imageURL);
      }
    };
    img.src = imageURL;
  });
}
