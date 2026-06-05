/* 시그니처 컬러 텍스트 → 대표 색(swatch) 매핑 (초상화 글로우/스와치용) */

const COLORWORDS = [
  [/주황|오렌지|단풍|크림/, "#ef7a2b"],
  [/빨강|레드|체리|루비|진홍/, "#e0492f"],
  [/파랑|블루|하늘|로열|코발트/, "#3aa6d6"],
  [/초록|그린|에메랄드|숲/, "#73ba43"],
  [/보라|퍼플|라벤더|바이올렛/, "#9b6bd6"],
  [/노랑|옐로|골드|선샤인/, "#f4c430"],
  [/분홍|핑크|로즈/, "#f08ab0"],
  [/검정|블랙|암흑|흑/, "#3a2c22"],
  [/하양|화이트|은빛|실버/, "#dfe7ee"],
];

export function swatchOf(t) {
  if (!t) return "#ffd9ad";
  for (const [re, c] of COLORWORDS) {
    if (re.test(t)) return c;
  }
  return "#ef7a2b";
}
