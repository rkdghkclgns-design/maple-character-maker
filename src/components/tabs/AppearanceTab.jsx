import Field from "../Field.jsx";
import ChipRow from "../ChipRow.jsx";
import { SUGGEST } from "../../core/suggest.js";

/** 외형 탭 — 나이·헤어·눈·복장·컬러·분위기 */
export default function AppearanceTab({ s, up, fill, toggleMood }) {
  return (
    <div>
      <Field label="성별·나이대">
        <input className="t" value={s.age} onChange={(e) => up("age", e.target.value)} placeholder="예) 20대 초반 소녀" />
        <ChipRow options={SUGGEST.age} value={s.age} onPick={(v) => fill("age", v)} />
      </Field>
      <div className="grid2">
        <Field label="헤어">
          <input className="t" value={s.hair} onChange={(e) => up("hair", e.target.value)} placeholder="스타일 & 컬러" />
        </Field>
        <Field label="눈·인상">
          <input className="t" value={s.eyes} onChange={(e) => up("eyes", e.target.value)} placeholder="눈 모양, 표정" />
        </Field>
      </div>
      <div className="chips" style={{ marginTop: 2, marginBottom: 8 }}>
        {SUGGEST.hair.slice(0, 4).map((o) => (
          <button key={o} className="chip" onClick={() => fill("hair", o)}>{o}</button>
        ))}
      </div>
      <Field label="복장 & 장비">
        <textarea className="t" value={s.outfit} onChange={(e) => up("outfit", e.target.value)} placeholder="옷, 방어구, 액세서리" />
        <ChipRow options={SUGGEST.outfit} value={s.outfit} onPick={(v) => fill("outfit", v)} />
      </Field>
      <Field label="시그니처 컬러">
        <input className="t" value={s.color} onChange={(e) => up("color", e.target.value)} placeholder="예) 주황 & 크림" />
        <ChipRow options={SUGGEST.color} value={s.color} onPick={(v) => fill("color", v)} />
      </Field>
      <Field label="분위기 키워드">
        <ChipRow options={SUGGEST.moods} value={s.moods} multi onPick={toggleMood} />
      </Field>
    </div>
  );
}
