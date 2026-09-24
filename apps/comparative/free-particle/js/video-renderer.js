'use strict';

// This file runs only in video-renderer.html. No live-page state is modified.
(() => {
  const ids = { wave: 'fpWaveCanvas', particle: 'fpPartCanvas', detector: 'fpDetCanvas',
    y: 'fpYProjCanvas', prob: 'fpProbCanvas' };
  let configured = false, nextFrame = 0, tick = 0;
  let canvases;

  window.FreeParticleVideoRenderer = {
    configure(snapshot, outputWidth) {
      if (!['pilotwave', 'collapse'].includes(snapshot.state.interpMode)) {
        throw new Error('Choose Pilot-Wave or Collapse before recording.');
      }
      // Keep all physical parameters, canvas geometry, and integration steps
      // fixed. Only the canvas backing stores scale with export resolution.
      fpRenderScale = Math.max(2, Math.ceil(2 * outputWidth / snapshot.layout.width));
      canvases = Object.fromEntries(Object.entries(ids).map(([name, id]) => {
        const canvas = document.getElementById(id);
        const size = snapshot.sizes[name === 'particle' || name === 'detector' ? 'wave' : name];
        canvas.width = size.width * fpRenderScale;
        canvas.height = size.height * fpRenderScale;
        canvas.getContext('2d').setTransform(fpRenderScale, 0, 0, fpRenderScale, 0, 0);
        return [name, canvas];
      }));
      // A local seeded generator makes repeated renders of one snapshot agree,
      // including Collapse outcomes and the next automatically launched run.
      let randomState = snapshot.seed >>> 0;
      Math.random = () => {
        randomState = (randomState + 0x6D2B79F5) >>> 0;
        let n = Math.imul(randomState ^ (randomState >>> 15), 1 | randomState);
        n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
        return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
      };
      fp = structuredClone(snapshot.state);
      fp.running = false;
      fp.animId = null;
      fp._lastFrameTime_ms = 0;
      fpInitCanvases();
      if (snapshot.start === 'beginning') fpFullReset();
      else fpRender();
      configured = true;
      nextFrame = 0;
      tick = 0;
    },

    renderFrame(frame, fps) {
      if (!configured || frame !== nextFrame || fps !== 30) throw new Error('Invalid video frame order.');
      // The interactive simulation uses 60 preview ticks per second. Preserve
      // that pace while encoding 30 evenly timed frames, regardless of CPU speed.
      const targetTick = Math.round(frame * 60 / fps);
      fpDeferRender = true;
      try {
        while (tick < targetTick) {
          tick++;
          fpStep(tick * 1000 / 60);
        }
      } finally { fpDeferRender = false; }
      fpRender();
      nextFrame++;
      return { ...canvases, state: { time: fp.time_fs, detected: fp.bDetected,
        section: fp.bDetectedSection, trials: fp.nTrials, hits: fp.sectionHits.slice(),
        collapseElapsed: fp.collapseElapsed_ms } };
    },

    dispose() {
      configured = false;
      Object.values(canvases || {}).forEach(canvas => { canvas.width = 1; canvas.height = 1; });
      fp._waveOff = null;
      fp._waveOffCtx = null;
      fp._collapseVisual = null;
    },
  };
})();
