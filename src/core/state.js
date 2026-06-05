/* 캐릭터 데이터 모델 · 라벨 · localStorage 키 */

export const LS_KEY = "maple-char-B";

/** 빈 캐릭터 상태를 매번 새 객체로 생성 (불변 유지) */
export const blankState = () => ({
  // 세계관
  name: "",
  region: "",
  era: "",
  concept: "",
  backstory: "",
  // 외형
  age: "",
  hair: "",
  eyes: "",
  outfit: "",
  color: "",
  moods: [],
  // 스킬
  element: "",
  weapon: "",
  skills: [], // {name, desc}
  // 역할
  job: "",
  party: "",
  playstyle: "",
  // 이미지 (data URL) + 프레이밍(크기·위치)
  image: "",
  imgT: { scale: 1, nx: 0, ny: 0 },
});

export const LABELS = {
  name: "이름", region: "출신 지역", era: "시대·분위기", concept: "한 줄 컨셉",
  backstory: "배경 이야기", age: "성별·나이대", hair: "헤어", eyes: "눈·인상",
  outfit: "복장 & 장비", color: "시그니처 컬러", moods: "분위기",
  element: "주력 속성", weapon: "주 무기", job: "직업군", party: "파티 역할",
  playstyle: "플레이 스타일",
};
