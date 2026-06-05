/** 화면 하단 토스트 */
export default function Toast({ msg, show }) {
  return <div className={"toast" + (show ? " show" : "")}>{msg}</div>;
}
