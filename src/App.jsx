import { useState, useRef, useCallback } from "react";

import { blankState } from "./core/state.js";
import { IDENTITY } from "./core/transform.js";
import { completion } from "./core/completion.js";
import { imagePrompt, summary } from "./core/prompt.js";
import { refine } from "./core/refine.js";
import { generateImage } from "./core/generateImage.js";
import { copy } from "./core/clipboard.js";
import { exportPDF, exportHTML } from "./core/sheet.js";
import { fileToDataURL, scaleDataURL } from "./core/image.js";
import { composeFramedImage } from "./core/imageCompose.js";

import { usePersistentState } from "./hooks/usePersistentState.js";
import { usePasteImage } from "./hooks/usePasteImage.js";
import { useToast } from "./hooks/useToast.js";

import FallingLeaves from "./components/FallingLeaves.jsx";
import Toast from "./components/Toast.jsx";
import TitleBar from "./components/TitleBar.jsx";
import Portrait from "./components/Portrait.jsx";
import TabStrip from "./components/TabStrip.jsx";
import FootBar from "./components/FootBar.jsx";
import WorldviewTab from "./components/tabs/WorldviewTab.jsx";
import AppearanceTab from "./components/tabs/AppearanceTab.jsx";
import SkillsTab from "./components/tabs/SkillsTab.jsx";
import RoleTab from "./components/tabs/RoleTab.jsx";
import PromptTab from "./components/tabs/PromptTab.jsx";

const TABS = [
  { id: "w", label: "세계관", grp: "세계관" },
  { id: "a", label: "외형", grp: "외형" },
  { id: "s", label: "스킬", grp: "스킬" },
  { id: "r", label: "역할", grp: "역할" },
  { id: "p", label: "프롬프트" },
];
const ORDER = ["w", "a", "s", "r", "p"];

export default function App() {
  const [s, setS] = usePersistentState();
  const [tab, setTab] = useState("w");
  const [sub, setSub] = useState("img");
  const [ai, setAi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);
  const pframeRef = useRef(null);
  const { msg, show, toast } = useToast();

  /* ----- 이미지 추가 (업로드/드롭/붙여넣기 공통) — 새 이미지는 프레이밍 초기화 ----- */
  const loadImg = useCallback(async (file) => {
    try {
      const url = await fileToDataURL(file, 900);
      setS((p) => ({ ...p, image: url, imgT: { ...IDENTITY } }));
      toast("이미지를 추가했어요 🖼");
    } catch (err) {
      toast(err.message || "이미지 추가 실패");
    }
  }, [setS, toast]);

  usePasteImage(loadImg);

  function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    if (f) loadImg(f);
    e.target.value = "";
  }
  function onDropImg(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) loadImg(f);
  }
  const openFile = () => fileRef.current && fileRef.current.click();

  /* ----- 상태 업데이트 헬퍼 (불변) ----- */
  const up = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const fill = up;
  const toggleMood = (m) =>
    setS((p) => ({
      ...p,
      moods: p.moods.includes(m) ? p.moods.filter((x) => x !== m) : [...p.moods, m],
    }));
  const setImgT = useCallback((updater) => {
    setS((p) => ({
      ...p,
      imgT: typeof updater === "function" ? updater(p.imgT || IDENTITY) : updater,
    }));
  }, [setS]);

  /* ----- 파생값 ----- */
  const comp = completion(s);
  const imgText = ai ? ai.imagePrompt : imagePrompt(s);
  const loreText = ai ? ai.lore : summary(s);
  const idx = ORDER.indexOf(tab);

  /* ----- 액션 ----- */
  async function doAI() {
    setLoading(true);
    try {
      const r = await refine(s);
      setAi(r);
      setTab("p");
      toast(r.fallback ? "오프라인으로 다듬었어요 ✨" : "AI가 프롬프트를 다듬었어요 ✨");
    } catch (e) {
      toast(e.message || "생성 실패");
    } finally {
      setLoading(false);
    }
  }

  async function doGenerate() {
    setGenerating(true);
    try {
      const raw = await generateImage(imgText);
      const scaled = await scaleDataURL(raw, 900);
      setS((p) => ({ ...p, image: scaled, imgT: { ...IDENTITY } }));
      toast("이미지를 생성했어요 🎨");
    } catch (e) {
      toast(e.message || "이미지 생성 실패");
    } finally {
      setGenerating(false);
    }
  }

  async function doCopy() {
    const ok = await copy(sub === "img" ? imgText : loreText);
    toast(ok ? "복사했어요!" : "복사 실패");
  }

  function doReset() {
    if (!confirm("입력한 내용을 모두 지울까요?")) return;
    setS(blankState());
    setAi(null);
    toast("초기화했어요");
  }

  /* export 시 화면 프레이밍 그대로 이미지를 구워 시트에 담는다 (WYSIWYG) */
  async function doExport(kind) {
    let st = s;
    if (s.image && pframeRef.current) {
      const composed = await composeFramedImage(
        s.image, s.imgT || IDENTITY,
        pframeRef.current.clientWidth, pframeRef.current.clientHeight,
      );
      st = { ...s, image: composed };
    }
    if (kind === "pdf") exportPDF(st, imgText, ai ? loreText : "");
    else exportHTML(st, imgText, ai ? loreText : "");
  }

  return (
    <>
      <FallingLeaves />
      <div className="hills"></div>

      <div className="gwin">
        <TitleBar overall={comp.__overall} />

        <div className="gbody">
          <Portrait
            s={s}
            drag={drag}
            setDrag={setDrag}
            onDrop={onDropImg}
            onPick={openFile}
            onPickFile={onPickFile}
            onReplace={openFile}
            onDelete={() => setS((p) => ({ ...p, image: "", imgT: { ...IDENTITY } }))}
            ai={ai}
            fileRef={fileRef}
            pframeRef={pframeRef}
            setImgT={setImgT}
          />

          <div className="rpanel">
            <TabStrip tabs={TABS} tab={tab} setTab={setTab} comp={comp} />

            <div className="fieldarea">
              {tab === "w" && <WorldviewTab s={s} up={up} fill={fill} />}
              {tab === "a" && <AppearanceTab s={s} up={up} fill={fill} toggleMood={toggleMood} />}
              {tab === "s" && <SkillsTab s={s} up={up} fill={fill} setS={setS} />}
              {tab === "r" && <RoleTab s={s} up={up} fill={fill} />}
              {tab === "p" && (
                <PromptTab
                  sub={sub}
                  setSub={setSub}
                  ai={ai}
                  imgText={imgText}
                  loreText={loreText}
                  hasImage={!!s.image}
                  onGenerate={doGenerate}
                  generating={generating}
                  onAddImage={openFile}
                />
              )}

              {tab !== "p" && (
                <div className="navbtns">
                  <button disabled={idx === 0} onClick={() => setTab(ORDER[idx - 1])}>◂ 이전</button>
                  <button onClick={() => setTab(ORDER[idx + 1])}>
                    {idx === ORDER.length - 2 ? "프롬프트 ▸" : "다음 ▸"}
                  </button>
                </div>
              )}
            </div>

            <FootBar
              loading={loading}
              onAI={doAI}
              onCopy={doCopy}
              onPDF={() => doExport("pdf")}
              onHTML={() => doExport("html")}
              onReset={doReset}
            />
          </div>
        </div>
      </div>

      <Toast msg={msg} show={show} />
    </>
  );
}
