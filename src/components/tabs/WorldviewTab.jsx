import Field from "../Field.jsx";
import ChipRow from "../ChipRow.jsx";
import { SUGGEST } from "../../core/suggest.js";

/** 세계관 탭 — 이름·컨셉·지역·시대·배경 */
export default function WorldviewTab({ s, up, fill }) {
  return (
    <div>
      <div className="grid2">
        <Field label="캐릭터 이름" req>
          <input className="t" value={s.name} onChange={(e) => up("name", e.target.value)} placeholder="예) 단풍이" />
        </Field>
        <Field label="한 줄 컨셉">
          <input className="t" value={s.concept} onChange={(e) => up("concept", e.target.value)} placeholder="예) 낙엽을 다루는 검사" />
        </Field>
      </div>
      <Field label="출신 지역">
        <input className="t" value={s.region} onChange={(e) => up("region", e.target.value)} placeholder="살아가는 곳" />
        <ChipRow options={SUGGEST.region} value={s.region} onPick={(v) => fill("region", v)} />
      </Field>
      <Field label="시대·분위기">
        <input className="t" value={s.era} onChange={(e) => up("era", e.target.value)} placeholder="시대적 배경" />
        <ChipRow options={SUGGEST.era} value={s.era} onPick={(v) => fill("era", v)} />
      </Field>
      <Field label="배경 이야기">
        <textarea className="t" value={s.backstory} onChange={(e) => up("backstory", e.target.value)} placeholder="어떤 사연으로 모험을 떠나게 되었나요?" />
      </Field>
    </div>
  );
}
