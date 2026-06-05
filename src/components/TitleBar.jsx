/** 상단 타이틀바 + 완성도 게이지 */
export default function TitleBar({ overall }) {
  return (
    <div className="titlebar">
      <span className="tleaf">🍁</span>
      <h1>캐릭터 생성</h1>
      <span className="sub">maple character maker</span>
      <div className="tb-spacer"></div>
      <div className="compP">
        완성 {overall}%
        <span className="compbar"><i style={{ width: overall + "%" }}></i></span>
      </div>
    </div>
  );
}
