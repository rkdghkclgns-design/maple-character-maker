/* 이미지 파일/데이터URL → 축소된 data URL (캔버스로 리사이즈, JPEG 0.86) */

/** 이미 data URL 인 이미지를 maxDim 으로 축소 (생성 이미지 저장 용량 절감) */
export function scaleDataURL(dataUrl, maxDim = 900) {
  return new Promise((resolve) => {
    if (!dataUrl) { resolve(dataUrl); return; }
    const img = new Image();
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      let w = img.width, h = img.height;
      const scale = Math.min(1, maxDim / Math.max(w, h));
      w = Math.round(w * scale);
      h = Math.round(h * scale);
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      let out;
      try { out = cv.toDataURL("image/jpeg", 0.86); }
      catch (e) { out = dataUrl; }
      resolve(out);
    };
    img.src = dataUrl;
  });
}

export function fileToDataURL(file, maxDim = 900) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) {
      reject(new Error("이미지 파일이 아니에요"));
      return;
    }
    const fr = new FileReader();
    fr.onerror = () => reject(new Error("파일을 읽지 못했어요"));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("이미지를 불러오지 못했어요"));
      img.onload = () => {
        let w = img.width, h = img.height;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        let out;
        try { out = cv.toDataURL("image/jpeg", 0.86); }
        catch (e) { out = fr.result; }
        resolve(out);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
