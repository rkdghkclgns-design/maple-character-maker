import { useState, useEffect, useRef } from "react";
import { blankState, LS_KEY } from "../core/state.js";

const SAVE_DEBOUNCE_MS = 250;

function persist(s) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch (e) {
    // 용량(quota) 초과 → 이미지 제외하고 저장 시도
    try {
      const { image, ...rest } = s;
      localStorage.setItem(LS_KEY, JSON.stringify(rest));
    } catch (_) { /* 그래도 실패하면 포기 */ }
  }
}

/**
 * 캐릭터 상태를 localStorage 에 자동 저장·복원.
 * 저장은 디바운스 — 드래그 이동/타이핑 중 큰 이미지 JSON 을 매 프레임 쓰지 않도록.
 */
export function usePersistentState() {
  const [s, setS] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_KEY));
      if (v) return { ...blankState(), ...v };
    } catch (e) { /* 손상된 값 무시 */ }
    return blankState();
  });

  const timer = useRef(null);
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(s), SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
  }, [s]);

  return [s, setS];
}
