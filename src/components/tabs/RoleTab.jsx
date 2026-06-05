import Field from "../Field.jsx";
import ChipRow from "../ChipRow.jsx";
import { SUGGEST } from "../../core/suggest.js";

/** 역할 탭 — 직업군·파티 역할·플레이 스타일 */
export default function RoleTab({ s, up, fill }) {
  return (
    <div>
      <Field label="직업군">
        <ChipRow options={SUGGEST.job} value={s.job} onPick={(v) => fill("job", v)} />
      </Field>
      <Field label="파티 역할">
        <ChipRow options={SUGGEST.party} value={s.party} onPick={(v) => fill("party", v)} />
      </Field>
      <Field label="플레이 스타일">
        <input className="t" value={s.playstyle} onChange={(e) => up("playstyle", e.target.value)} placeholder="어떻게 활약하나요?" />
        <ChipRow options={SUGGEST.playstyle} value={s.playstyle} onPick={(v) => fill("playstyle", v)} />
      </Field>
    </div>
  );
}
