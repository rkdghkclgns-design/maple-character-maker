import { useState, useRef, useCallback } from "react";

/** 짧게 떠올랐다 사라지는 토스트 메시지 훅 */
export function useToast(duration = 1800) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef(null);

  const toast = useCallback((m) => {
    setMsg(m);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), duration);
  }, [duration]);

  return { msg, show, toast };
}
