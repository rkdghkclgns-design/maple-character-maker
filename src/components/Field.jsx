/** 라벨 + 입력을 감싸는 필드 래퍼 */
export default function Field({ label, req, children }) {
  return (
    <div className="field">
      <label>{label}{req && <span className="req"> *</span>}</label>
      {children}
    </div>
  );
}
