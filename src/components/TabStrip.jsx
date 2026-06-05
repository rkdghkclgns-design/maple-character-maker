/** 탭 스트립. 그룹에 입력이 있으면 초록 점(dot) 표시 */
export default function TabStrip({ tabs, tab, setTab, comp }) {
  return (
    <div className="tabstrip">
      {tabs.map((t) => {
        const filled = t.grp && comp[t.grp] && comp[t.grp].filled > 0;
        return (
          <button
            key={t.id}
            className={"gtab" + (tab === t.id ? " on" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}{filled && <span className="dot"></span>}
          </button>
        );
      })}
    </div>
  );
}
