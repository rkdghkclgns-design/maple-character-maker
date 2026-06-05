import { useMemo } from "react";

const COLORS = ["#e0492f", "#ef7a2b", "#f4a93c", "#c8531c"];
const LEAF_PATH =
  "M50 6c2 9 6 13 13 11-3 7-1 11 4 13-6 3-7 7-4 13-7-2-10 1-11 8-3-6-7-7-13-4 2-6 0-10-6-12 6-3 7-7 4-13 7 2 11 0 13-7z";

/** 배경에 떨어지는 단풍잎 (장식, prefers-reduced-motion 시 CSS로 숨김) */
export default function FallingLeaves({ count = 9 }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        size: 14 + Math.random() * 16,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 7,
        delay: -Math.random() * 12,
        color: COLORS[i % COLORS.length],
      })),
    [count]
  );

  return (
    <>
      {leaves.map((l, i) => (
        <div
          key={i}
          className="leaf-fall"
          style={{
            left: l.left + "vw",
            animationDuration: l.duration + "s",
            animationDelay: l.delay + "s",
          }}
        >
          <svg width={l.size} height={l.size} viewBox="0 0 100 100">
            <path fill={l.color} d={LEAF_PATH} />
          </svg>
        </div>
      ))}
    </>
  );
}
