(() => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function patchedGetContext(type, attributes) {
    if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
      return originalGetContext.call(this, type, {
        ...(attributes || {}),
        preserveDrawingBuffer: true,
      });
    }
    return originalGetContext.call(this, type, attributes);
  };

  const CONFIG = {
    fps: 60,
    videoBitsPerSecond: 10000000,
    chunkMs: 1000,
  };

  const state = {
    recorder: null,
    stream: null,
    sourceCanvas: null,
    captureCanvas: null,
    captureContext: null,
    videoTrack: null,
    manualFrames: false,
    captureTimer: 0,
    simulationDriver: null,
    frameCount: 0,
    nextFrameAt: 0,
    chunks: [],
    startedAt: 0,
    mimeType: "",
    finalizing: false,
    lastUrl: null,
    pendingBlob: null,
    pendingFileName: "",
  };

  let button = null;

  function installStyle() {
    if (document.getElementById("q-record-style")) return;
    const style = document.createElement("style");
    style.id = "q-record-style";
    style.textContent = `
      #q-record-control {
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 1000;
        padding: 8px 13px;
        border-radius: 6px;
        border: 1px solid rgba(80, 140, 255, 0.38);
        background: rgba(4, 10, 30, 0.88);
        color: #b8d4ff;
        font: 12px "JetBrains Mono", "Courier New", monospace;
        cursor: pointer;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 18px rgba(0, 0, 20, 0.65);
      }
      #q-record-control:hover {
        border-color: rgba(85, 136, 255, 0.8);
        color: #e8f2ff;
      }
      #q-record-control.recording {
        background: rgba(125, 26, 24, 0.88);
        border-color: rgba(255, 100, 100, 0.72);
        color: #ffd0ca;
      }
      #q-record-control:disabled {
        cursor: not-allowed;
        opacity: 0.58;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureButton() {
    if (button) return button;
    installStyle();
    button = document.createElement("button");
    button.id = "q-record-control";
    button.type = "button";
    button.addEventListener("click", toggleRecording);
    document.body.appendChild(button);
    syncRecordingButton();
    return button;
  }

  function findRecordingCanvas() {
    return Array.from(document.querySelectorAll("canvas"))
      .filter(canvas => canvas.width > 0 && canvas.height > 0 && typeof canvas.captureStream === "function")
      .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0] || null;
  }

  function chooseRecordingMimeType() {
    if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") return "";
    const candidates = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || "";
  }

  function canRecordCanvas() {
    return !!findRecordingCanvas() && typeof MediaRecorder !== "undefined" && !!chooseRecordingMimeType();
  }

  function isRecording() {
    return state.recorder?.state === "recording";
  }

  function getSimulationDriver() {
    const driver = window.BohmianDoubleSlit;
    if (!driver || typeof driver.renderRecordingFrame !== "function") return null;
    if (typeof driver.isReady === "function" && !driver.isReady()) return null;
    return driver;
  }

  function recordingFileName(startedAt = state.startedAt) {
    const stamp = new Date(startedAt || Date.now()).toISOString().replace(/[:.]/g, "-");
    return `bohmian-double-slit-${stamp}.webm`;
  }

  function syncRecordingButton() {
    if (!button) return;
    const recording = isRecording();
    const supported = canRecordCanvas();
    const text = state.finalizing ? "Saving Recording..." : (recording ? "Stop Recording" : "Start Recording");
    if (button.textContent !== text) button.textContent = text;
    button.classList.toggle("recording", recording);
    button.disabled = state.finalizing || !supported;
    button.title = supported ? "Records the simulation canvas only; UI overlays are excluded." : "WebM canvas recording is not supported by this browser.";
  }

  function toggleRecording() {
    if (isRecording()) stopRecording();
    else startRecording();
  }

  function startRecording() {
    const canvas = findRecordingCanvas();
    const mimeType = chooseRecordingMimeType();
    if (!canvas || !mimeType || typeof MediaRecorder === "undefined") {
      alert("WebM canvas recording is not supported by this browser.");
      syncRecordingButton();
      return;
    }
    clearPendingRecording();

    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = Math.max(1, canvas.width || canvas.clientWidth || 1);
    captureCanvas.height = Math.max(1, canvas.height || canvas.clientHeight || 1);
    captureCanvas.style.cssText = "position:fixed;left:-10000px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(captureCanvas);
    const captureContext = captureCanvas.getContext("2d", { alpha: false });

    let stream;
    let recorder;
    let videoTrack;
    let manualFrames = false;
    try {
      stream = captureCanvas.captureStream(0);
      videoTrack = stream.getVideoTracks()[0];
      manualFrames = typeof videoTrack?.requestFrame === "function";
      if (!manualFrames) {
        stream.getTracks().forEach(track => track.stop());
        stream = captureCanvas.captureStream(CONFIG.fps);
        videoTrack = stream.getVideoTracks()[0];
      }
      recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: CONFIG.videoBitsPerSecond,
      });
    } catch (error) {
      captureCanvas.remove();
      stream?.getTracks().forEach(track => track.stop());
      alert(`Could not start WebM recording: ${error.message}`);
      syncRecordingButton();
      return;
    }

    state.recorder = recorder;
    state.stream = stream;
    state.sourceCanvas = canvas;
    state.captureCanvas = captureCanvas;
    state.captureContext = captureContext;
    state.videoTrack = videoTrack;
    state.manualFrames = manualFrames;
    state.captureTimer = 0;
    state.simulationDriver = getSimulationDriver();
    state.frameCount = 0;
    state.nextFrameAt = performance.now();
    state.chunks = [];
    state.startedAt = Date.now();
    state.mimeType = recorder.mimeType || mimeType;
    state.finalizing = false;

    recorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) state.chunks.push(event.data);
    };
    recorder.onerror = event => {
      console.error("Recording error:", event.error || event);
      stopRecording();
    };
    recorder.onstop = finishRecordingDownload;

    try {
      state.simulationDriver?.beginFrameRecording?.({ fps: CONFIG.fps });
      recorder.start(CONFIG.chunkMs);
    } catch (error) {
      state.simulationDriver?.endFrameRecording?.();
      state.stream?.getTracks().forEach(track => track.stop());
      captureCanvas.remove();
      state.recorder = null;
      state.stream = null;
      state.sourceCanvas = null;
      state.captureCanvas = null;
      state.captureContext = null;
      state.videoTrack = null;
      state.manualFrames = false;
      state.simulationDriver = null;
      alert(`Could not start WebM recording: ${error.message}`);
      syncRecordingButton();
      return;
    }

    scheduleRecordingFrame();
    syncRecordingButton();
  }

  function stopRecording() {
    const recorder = state.recorder;
    if (!recorder || recorder.state === "inactive") return;
    state.finalizing = true;
    syncRecordingButton();
    clearRecordingSchedule();
    try {
      recorder.requestData();
    } catch (error) {
      console.warn("Could not flush recording data:", error);
    }
    recorder.stop();
  }

  function finishRecordingDownload() {
    clearRecordingSchedule();
    state.simulationDriver?.endFrameRecording?.();
    state.stream?.getTracks().forEach(track => track.stop());
    state.stream = null;
    state.captureCanvas?.remove();
    state.sourceCanvas = null;
    state.captureCanvas = null;
    state.captureContext = null;
    state.videoTrack = null;
    state.manualFrames = false;
    state.captureTimer = 0;
    state.simulationDriver = null;
    const chunks = state.chunks;
    state.chunks = [];

    if (!chunks.length) {
      state.recorder = null;
      state.finalizing = false;
      alert("No recording data was produced.");
      syncRecordingButton();
      return;
    }

    state.pendingBlob = new Blob(chunks, { type: state.mimeType || "video/webm" });
    state.pendingFileName = recordingFileName();
    state.recorder = null;
    state.finalizing = false;
    downloadPendingRecording(true);
    syncRecordingButton();
  }

  function clearRecordingSchedule() {
    if (state.captureTimer) {
      clearTimeout(state.captureTimer);
      state.captureTimer = 0;
    }
  }

  function scheduleRecordingFrame() {
    if (!isRecording()) {
      state.captureTimer = 0;
      return;
    }
    const delay = Math.max(0, state.nextFrameAt - performance.now());
    state.captureTimer = setTimeout(recordFrame, delay);
  }

  function recordFrame() {
    state.captureTimer = 0;
    if (!isRecording()) return;

    try {
      state.simulationDriver?.renderRecordingFrame?.({
        fps: CONFIG.fps,
        frame: state.frameCount,
      });
    } catch (error) {
      console.error("Could not render recording frame:", error);
      stopRecording();
      return;
    }

    copyRecordingFrame();
    if (state.manualFrames) state.videoTrack?.requestFrame?.();
    state.frameCount += 1;
    state.nextFrameAt += 1000 / CONFIG.fps;

    const frameMs = 1000 / CONFIG.fps;
    if (state.nextFrameAt < performance.now() - frameMs) {
      state.nextFrameAt = performance.now() + frameMs;
    }

    scheduleRecordingFrame();
  }

  function copyRecordingFrame() {
    const source = state.sourceCanvas;
    const target = state.captureCanvas;
    const ctx = state.captureContext;
    if (!source || !target || !ctx) return;
    try {
      ctx.drawImage(source, 0, 0, target.width, target.height);
    } catch (error) {
      console.warn("Could not copy recording frame:", error);
    }
  }

  function clearPendingRecording() {
    if (state.lastUrl) {
      URL.revokeObjectURL(state.lastUrl);
      state.lastUrl = null;
    }
    state.pendingBlob = null;
    state.pendingFileName = "";
  }

  function downloadPendingRecording(clearAfterClick) {
    if (!state.pendingBlob) return;
    if (!state.lastUrl) {
      state.lastUrl = URL.createObjectURL(state.pendingBlob);
    }
    const url = state.lastUrl;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = state.pendingFileName || recordingFileName();
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    if (clearAfterClick) {
      state.pendingBlob = null;
      state.pendingFileName = "";
      if (state.lastUrl === url) state.lastUrl = null;
      syncRecordingButton();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        syncRecordingButton();
      }, 1000);
    }
  }

  function init() {
    ensureButton();
    const observer = new MutationObserver(syncRecordingButton);
    observer.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
    window.addEventListener("resize", syncRecordingButton);
    setTimeout(syncRecordingButton, 0);
    setTimeout(syncRecordingButton, 500);
    setTimeout(syncRecordingButton, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
