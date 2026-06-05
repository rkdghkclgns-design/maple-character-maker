/* 진행도(완성도) 계산 — 그룹별 채워진 항목 수와 전체 퍼센트 */

export function completion(s) {
  const groups = {
    세계관: [s.name, s.region, s.era, s.concept, s.backstory],
    외형: [s.age, s.hair, s.eyes, s.outfit, s.color, s.moods.length ? "x" : ""],
    스킬: [s.element, s.weapon, s.skills.length ? "x" : ""],
    역할: [s.job, s.party, s.playstyle],
  };
  const out = {};
  let filled = 0, total = 0;
  for (const k in groups) {
    const arr = groups[k];
    const f = arr.filter((v) => v && String(v).trim()).length;
    out[k] = { filled: f, total: arr.length };
    filled += f; total += arr.length;
  }
  out.__overall = total ? Math.round((filled / total) * 100) : 0;
  return out;
}
