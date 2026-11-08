// particle_update.vert uses mode 3 for a particle frozen by the right detector.
export const RIGHT_DETECTED_MODE = 3;
const COLORS = ["#ffeb14", "#26f2ff", "#ff472e", "#bd52ff"];
export const HISTOGRAM_GAP = 13;
export const HISTOGRAM_RIGHT_MARGIN = 24;
export function histogramPlotWidth(width) {
  return Math.min(224, Math.max(144, width * 0.14));
}

function countAxisMaximum(peak) {
  if (peak <= 1) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(peak));
  const unit = peak / magnitude;
  return (unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * magnitude;
}

export class RightDetectorHistogram {
  constructor(canvas, binCount = 64) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    // Equal numbers above and below the center: no bin can straddle the midpoint.
    this.binCount = Math.max(2, Math.ceil((Number.isFinite(binCount) ? binCount : 64) / 2) * 2);
    this.version = 0;
    this.renderKey = "";
    this.layout = null;
    this.reset(0, 1);
  }

  reset(particleCount, simHeight, yMin = 0) {
    this.simHeight = Math.max(1, simHeight);
    this.yMin = yMin;
    this.midpoint = yMin + this.simHeight * 0.5;
    this.binHeight = this.simHeight / this.binCount;
    this.seen = new Uint8Array(particleCount);
    // Joint quadrant/radial counts allow either coloring to change after a hit.
    this.bins = new Uint32Array(this.binCount * 16);
    this.total = 0;
    this.version++;
    this.canvas.setAttribute("aria-label", `Right detector histogram: ${this.binCount} vertical bins, with a bin boundary at the vertical midpoint.`);
  }

  binIndex(y) {
    // Subtract the midpoint before rounding, so points just below it stay below it.
    const bin = this.binCount / 2 + Math.floor((y - this.midpoint) / this.binHeight);
    return Math.max(0, Math.min(this.binCount - 1, bin));
  }

  beginRun(particleCount) {
    // A new single particle reuses index 0, but may add a new hit to the series.
    this.seen = new Uint8Array(particleCount);
  }

  clearCounts() {
    this.bins.fill(0);
    this.total = 0;
    this.version++;
    // Keep this run's seen flags: clearing must not recount a frozen particle.
  }

  binEdge(index) {
    return this.midpoint + (index - this.binCount / 2) * this.binHeight;
  }

  record(states) {
    let added = 0;
    const count = Math.min(this.seen.length, Math.floor(states.length / 4));
    for (let i = 0; i < count; i++) {
      const offset = i * 4;
      if (this.seen[i] || states[offset + 2] !== RIGHT_DETECTED_MODE) continue;
      const y = states[offset + 1];
      if (!Number.isFinite(y)) continue;
      this.seen[i] = 1;
      // The hidden extension is not part of the visible detector. Never fold its
      // detections into the first/last displayed bin.
      if (y < this.yMin || y > this.yMin + this.simHeight) continue;
      const bin = this.binIndex(y);
      const origin = Math.round(states[offset + 3]) & 15;
      this.bins[bin * 16 + origin]++;
      added++;
    }
    if (added) {
      this.total += added;
      this.version++;
    }
    return added;
  }

  render({ width, height, pixelWidth, pixelHeight, simWidth, rightX, view, colorMask, visible }) {
    const key = [this.version, width, height, pixelWidth, pixelHeight, simWidth, rightX,
      view.zoom, view.offsetX, view.offsetY, colorMask, visible].join("|");
    if (key === this.renderKey) return;
    this.renderKey = key;
    if (this.canvas.width !== pixelWidth) this.canvas.width = pixelWidth;
    if (this.canvas.height !== pixelHeight) this.canvas.height = pixelHeight;
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, pixelWidth, pixelHeight);
    this.layout = null;
    this.canvas.hidden = !visible;
    if (!visible || width < 240 || height < 220 || simWidth <= 0) return;

    const detectorX = view.offsetX + view.zoom * rightX / simWidth * width;
    // Stay attached to the detector; there is no separate drag or position control.
    if (detectorX < 12 || detectorX > width - 2) return;
    const gap = HISTOGRAM_GAP;
    // The camera reserves space beyond the detector. Never flip over the trails.
    const roomRight = width - detectorX - gap - HISTOGRAM_RIGHT_MARGIN;
    const direction = 1;
    const plotWidth = Math.min(histogramPlotWidth(width), roomRight);
    if (plotWidth < 72) return;
    const baseX = detectorX + direction * gap;
    const endX = baseX + direction * plotWidth;
    const left = Math.min(baseX, endX);
    const top = 12;
    const plotTop = top + 10;
    const plotBottom = height - 48;
    if (plotBottom <= plotTop) return;
    const toY = (y) => view.offsetY + view.zoom * (1 - (y - this.yMin) / this.simHeight) * height;
    const totals = new Uint32Array(this.binCount);
    let peak = 0;
    for (let bin = 0; bin < this.binCount; bin++) {
      for (let origin = 0; origin < 16; origin++) totals[bin] += this.bins[bin * 16 + origin];
      peak = Math.max(peak, totals[bin]);
    }
    const axisMax = countAxisMaximum(peak);
    const scale = plotWidth / axisMax;
    const midpointY = toY(this.midpoint);
    this.layout = { detectorX, baseX, endX, direction, plotTop, plotBottom, plotWidth, axisMax, midpointY };

    ctx.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
    ctx.save();
    const backdrop = ctx.createLinearGradient(left - 12, 0, left + plotWidth + 12, 0);
    backdrop.addColorStop(0, "rgba(5,15,29,0.60)");
    backdrop.addColorStop(1, "rgba(5,15,29,0.84)");
    ctx.beginPath();
    ctx.roundRect(left - 12, top, plotWidth + 24, height - top - 12, 10);
    ctx.fillStyle = backdrop;
    ctx.fill();
    ctx.strokeStyle = "rgba(139,188,218,0.20)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.rect(left - 1, plotTop, plotWidth + 2, plotBottom - plotTop);
    ctx.clip();
    // Linear count axis: no smoothing, probability reconstruction, or nonlinear scaling.
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);
    for (const fraction of [0.5, 1]) {
      const x = baseX + direction * plotWidth * fraction;
      ctx.beginPath();ctx.moveTo(x, plotTop);ctx.lineTo(x, plotBottom);
      ctx.strokeStyle = "rgba(161,198,222,0.12)";ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(baseX, plotTop);ctx.lineTo(baseX, plotBottom);
    ctx.strokeStyle = "rgba(186,225,241,0.5)";ctx.stroke();

    const contour = [];
    for (let bin = this.binCount - 1; bin >= 0; bin--) {
      const yTop = toY(this.binEdge(bin + 1));
      const yBottom = toY(this.binEdge(bin));
      if (yBottom < plotTop || yTop > plotBottom) continue;
      const grouped = [0, 0, 0, 0];
      for (let origin = 0; origin < 16; origin++) {
        const group = colorMask == 4 ? (origin >> 2) : (origin & colorMask);
        grouped[group] += this.bins[bin * 16 + origin];
      }
      let offset = 0;
      for (let group = 0; group < 4; group++) {
        const length = grouped[group] * scale;
        if (length === 0) continue;
        const x1 = baseX + direction * offset;
        const x2 = x1 + direction * length;
        ctx.fillStyle = COLORS[group];
        ctx.globalAlpha = 0.44;
        ctx.fillRect(Math.min(x1, x2), yTop + 0.7, length, Math.max(1, yBottom - yTop - 1.4));
        ctx.globalAlpha = 0.78;
        ctx.fillRect(Math.min(x1, x2), yTop + 0.7, length, 1);
        offset += length;
      }
      contour.push({x:baseX + direction * totals[bin] * scale, y:(yTop + yBottom) * 0.5});
    }
    ctx.globalAlpha = 1;
    // A subtle divider makes the exact upper/lower bin boundary visible.
    ctx.beginPath();
    ctx.moveTo(left, midpointY);
    ctx.lineTo(left + plotWidth, midpointY);
    ctx.strokeStyle = "rgba(186,225,241,0.34)";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (this.total > 0) {
      ctx.beginPath();
      contour.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
      ctx.strokeStyle = "rgba(223,246,255,0.88)";
      ctx.shadowColor = "rgba(127,212,255,0.45)";
      ctx.shadowBlur = 5;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    } else {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = "#8fa9bb";
      ctx.fillText("Awaiting hits", left + plotWidth / 2, (plotTop + plotBottom) / 2);
    }
    ctx.restore();

    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = "#9fb7ca";
    ctx.textBaseline = "top";
    ctx.textAlign = direction > 0 ? "left" : "right";
    ctx.fillText("0", baseX, plotBottom + 7);
    ctx.textAlign = direction > 0 ? "right" : "left";
    ctx.fillText(String(axisMax), endX, plotBottom + 7);
    ctx.textAlign = "center";
    ctx.fillStyle = "#8da8bc";
    ctx.fillText("hits / bin", left + plotWidth / 2, plotBottom + 23);

    // Small connectors make the profile's attachment to this detector unambiguous.
    ctx.strokeStyle = "rgba(182,220,235,0.42)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(detectorX, plotTop);ctx.lineTo(baseX, plotTop);
    ctx.moveTo(detectorX, plotBottom);ctx.lineTo(baseX, plotBottom);
    ctx.stroke();
    ctx.restore();
  }
}
