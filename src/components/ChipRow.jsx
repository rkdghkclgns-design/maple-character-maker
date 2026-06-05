/** 추천칩 묶음. multi=true 면 다중 선택(배열), 아니면 단일 값 비교 */
export default function ChipRow({ options, value, onPick, multi }) {
  const has = (o) => (multi ? (value || []).includes(o) : value === o);
  return (
    <div className="chips">
      {options.map((o) => (
        <button
          key={o}
          className={"chip" + (has(o) ? " on" : "")}
          onClick={() => onPick(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
