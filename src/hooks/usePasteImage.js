import { useEffect } from "react";

/** 문서 어디서나 이미지 붙여넣기(⌘V/Ctrl+V) 시 onImage(file) 호출 */
export function usePasteImage(onImage) {
  useEffect(() => {
    function onPaste(e) {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (const it of items) {
        if (it.type && it.type.indexOf("image") === 0) {
          const f = it.getAsFile();
          if (f) { onImage(f); e.preventDefault(); }
          break;
        }
      }
    }
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [onImage]);
}
