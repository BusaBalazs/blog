import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../data/firebase";

//-------------------------------------------------------------
const DEFAULT_ASPECT = 510 / 390;

// Firebase URL-ből storage path kinyerése (pl. "posts/1234567890.webp")
function extractStoragePath(url) {
  if (!url) return null;
  try {
    const match = url.match(/\/o\/(.+?)\?/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function getCroppedBlob(imgEl, pixelCrop, aspect) {
  const canvas = document.createElement("canvas");

  // A pixelCrop már a MEGJELENÍTETT kép pixel koordinátái
  // scaleX/Y átváltja a természetes (teljes felbontású) kép koordinátáira
  const scaleX = imgEl.naturalWidth / imgEl.width;
  const scaleY = imgEl.naturalHeight / imgEl.height;

  const srcX = pixelCrop.x * scaleX;
  const srcY = pixelCrop.y * scaleY;
  const srcW = pixelCrop.width * scaleX;
  const srcH = pixelCrop.height * scaleY;

  // Output: 1020×780 (2× retina a 510×390 display mérethez)
  const outW = 1020;
  const outH = Math.round(outW / aspect);
  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(imgEl, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.88));
}

//--------------------------------------------------------
//--------------------------------------------------------
const Imageuploader = ({
  currentUrl = null,
  onUploadDone,
  aspectRatio = DEFAULT_ASPECT,
}) => {
  const [phase, setPhase] = useState(currentUrl ? "done" : "idle");
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Az egyszer generált Storage path — meglévő cikknél a régi fájlt írjuk felül
  const storagePath = useRef(null);

  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  // Ha van meglévő kép, inicializáljuk a storage path-ot, hogy felülírjuk a régit
  useEffect(() => {
    if (currentUrl && !storagePath.current) {
      storagePath.current = extractStoragePath(currentUrl);
    }
  }, [currentUrl]);

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target.result);
      setCrop(null);
      setCompletedCrop(null);
      setPhase("cropping");
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback(
    (e) => {
      const { width, height } = e.currentTarget; // megjelenített méret px-ben
      const initial = centerCrop(
        makeAspectCrop(
          { unit: "px", width: width * 0.9 },
          aspectRatio,
          width,
          height,
        ),
        width,
        height,
      );
      setCrop(initial);
      setCompletedCrop(initial);
    },
    [aspectRatio],
  );

  const handleUpload = async () => {
    if (!completedCrop || !imgRef.current) return;
    setPhase("uploading");
    setProgress(0);
    try {
      const blob = await getCroppedBlob(
        imgRef.current,
        completedCrop,
        aspectRatio,
      );

      // Első feltöltésnél generálunk path-t, cserékor ugyanazt használjuk → felülírás
      if (!storagePath.current) {
        storagePath.current = `posts/${Date.now()}.webp`;
      }

      const storageRef = ref(storage, storagePath.current);
      const timer = setInterval(
        () => setProgress((p) => Math.min(p + 18, 88)),
        120,
      );
      await uploadBytes(storageRef, blob);
      clearInterval(timer);
      setProgress(100);
      const url = await getDownloadURL(storageRef);
      setPreviewUrl(url);
      setPhase("done");
      onUploadDone(url);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("idle");
    setImgSrc(null);
    setCrop(null);
    setCompletedCrop(null);
    setPreviewUrl(currentUrl);
    setProgress(0);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Ha van meglévő URL, megtartjuk a storage path-ot a felülíráshoz
    // Ha új cikk (nincs currentUrl), nullázzuk, hogy új path generálódjon
    if (!currentUrl) {
      storagePath.current = null;
    }
  };

  return (
    <div className="space-y-3">
      {/* IDLE */}
      {phase === "idle" && (
        <div
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-sm bg-white
            hover:border-[#d4af37] hover:bg-[#fdf8ec] transition-all duration-200
            cursor-pointer flex flex-col items-center justify-center gap-3
            py-10 px-6 text-center select-none"
        >
          <span className="text-3xl">🖼️</span>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Húzd ide a képet, vagy kattints
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP — max 10 MB
            </p>
            <p className="text-xs text-gray-300 mt-0.5">
              Arány: 510 × 390 (rögzített)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* CROPPING */}
      {phase === "cropping" && imgSrc && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-sm p-3 flex justify-center overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(px) => setCrop(px)}
              onComplete={(px) => setCompletedCrop(px)}
              aspect={aspectRatio}
              minWidth={10}
              keepSelection
            >
              <img
                ref={imgRef}
                src={imgSrc}
                onLoad={onImageLoad}
                alt="Kép szerkesztése"
                style={{ maxHeight: "60vh", maxWidth: "100%" }}
              />
            </ReactCrop>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Húzd a sarkokat a kivágási terület módosításához · 510 × 390 arány
            rögzítve
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!completedCrop}
              className="flex-1 bg-[#d4af37] hover:bg-[#b8963e] disabled:opacity-50
                text-white font-semibold text-sm py-2.5 rounded-sm transition-colors"
            >
              ✓ Kivágás és feltöltés
            </button>
            <button
              type="button"
              onClick={reset}
              className="border border-gray-200 text-gray-500 hover:border-gray-400
                text-sm px-4 py-2.5 rounded-sm transition-colors"
            >
              Mégsem
            </button>
          </div>
        </div>
      )}

      {/* UPLOADING */}
      {phase === "uploading" && (
        <div className="border border-gray-100 rounded-sm bg-white p-6 flex flex-col items-center gap-4">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#d4af37] h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">Feltöltés... {progress}%</p>
        </div>
      )}

      {/* DONE */}
      {phase === "done" && previewUrl && (
        <div className="space-y-2">
          <div
            className="relative overflow-hidden rounded-sm bg-gray-100 group"
            style={{ aspectRatio: "510 / 390" }}
          >
            <img
              src={previewUrl}
              alt="Feltöltött kép"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all
              duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <button
                type="button"
                onClick={reset}
                className="bg-white text-gray-800 text-xs font-semibold px-4 py-2 rounded-sm
                  shadow hover:bg-[#d4af37] hover:text-white transition-colors"
              >
                🔄 Kép cseréje
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-green-600 font-medium">
              ✓ Kép sikeresen feltöltve
            </p>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Törlés
            </button>
          </div>
        </div>
      )}

      {/* ERROR */}
      {phase === "error" && (
        <div className="border border-red-200 bg-red-50 rounded-sm p-4">
          <p className="text-sm font-medium text-red-700 mb-1">
            Feltöltési hiba
          </p>
          <p className="text-xs text-red-600">{errorMsg}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-xs text-red-600 underline hover:text-red-800"
          >
            Próbáld újra
          </button>
        </div>
      )}
    </div>
  );
};

export default Imageuploader;
