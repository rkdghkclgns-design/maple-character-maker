import Field from "../Field.jsx";
import ChipRow from "../ChipRow.jsx";
import { SUGGEST, SKILL_IDEAS } from "../../core/suggest.js";

/** 스킬 탭 — 속성·무기·대표 스킬 목록(추가/삭제/예시칩) */
export default function SkillsTab({ s, up, fill, setS }) {
  const setSkill = (i, key, val) =>
    setS((p) => {
      const sl = [...p.skills];
      sl[i] = { ...sl[i], [key]: val };
      return { ...p, skills: sl };
    });
  const removeSkill = (i) => setS((p) => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }));
  const addSkill = (skill) => setS((p) => ({ ...p, skills: [...p.skills, skill] }));

  return (
    <div>
      <Field label="주력 속성">
        <ChipRow options={SUGGEST.element} value={s.element} onPick={(v) => fill("element", s.element === v ? "" : v)} />
      </Field>
      <Field label="주 무기">
        <input className="t" value={s.weapon} onChange={(e) => up("weapon", e.target.value)} placeholder="예) 한손검" />
        <ChipRow options={SUGGEST.weapon} value={s.weapon} onPick={(v) => fill("weapon", v)} />
      </Field>
      <Field label="대표 스킬">
        {s.skills.map((sk, i) => (
          <div className="skill-row" key={i}>
            <input className="t" value={sk.name} placeholder="이름" onChange={(e) => setSkill(i, "name", e.target.value)} />
            <input className="t" value={sk.desc} placeholder="효과" onChange={(e) => setSkill(i, "desc", e.target.value)} />
            <button className="del" onClick={() => removeSkill(i)}>✕</button>
          </div>
        ))}
        {s.skills.length === 0 && <div className="empty">아직 스킬이 없어요. 추가해 보세요.</div>}
        <button className="addbtn" onClick={() => addSkill({ name: "", desc: "" })}>＋ 스킬 추가</button>
        <div className="chips" style={{ marginTop: 9 }}>
          {SKILL_IDEAS.map((sk, i) => (
            <button key={i} className="chip" onClick={() => addSkill({ ...sk })}>+ {sk.name}</button>
          ))}
        </div>
      </Field>
    </div>
  );
}
