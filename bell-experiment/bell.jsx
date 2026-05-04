import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════
// Bell Experiment — Two entangled spin-½ particles flying apart along ±Z.
//
// Source at origin. Particle A flies toward -Z (left detector at Z=-7).
//                   Particle B flies toward +Z (right detector at Z=+7).
//
// Singlet state: |Ψ⁻⟩ = (1/√2)(|+⟩_A|−⟩_B − |−⟩_A|+⟩_B)
//
// Each particle carries TWO colored wave-packet branches superimposed:
//   Branch ↑ (green):  spin-up component of that particle's reduced state
//   Branch ↓ (orange): spin-down component
//
// Detector A measures along n̂_A(φ_A), Detector B along n̂_B(φ_B).
//
// COPENHAGEN: When A is measured, one branch vanishes instantly on both sides.
//             B's wave function collapses to the correlated outcome.
//
// BOHMIAN: Both branches persist. A's particle position determines its outcome.
//          The joint wave function's guidance equation then forces B's particle
//          to the correlated branch (non-local quantum potential).
// ═══════════════════════════════════════════════════════════════════════════

const Z_SRC      =  0;
const Z_DET      =  7.0;          // first-measured detector distance
const Z_DET_FAR  =  Z_DET * 2.0;  // second-measured detector (2× farther)
const FRAC_FIRST =  Z_DET / Z_DET_FAR;  // 0.50 — first particle arrives at half-way
const SIG    =  0.40;  // initial Gaussian width
const KICK   =  1.6;   // transverse separation at detector
const STEPS  =  120;
const PERIOD = 260;    // animation ticks per cycle

// Colors for the two spinor branches
const COLOR_UP   = new THREE.Color(0x22ee66);  // green  — spin ↑
const COLOR_DOWN = new THREE.Color(0xff5522);  // orange — spin ↓
const COLOR_ENTANGLED = new THREE.Color(0x55aaff); // blue — superposition

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// CSS color helpers — mirrors the Three.js axisColors() used in the shader
// so the React overlay labels always match the wave/magnet colors exactly.
const CSS_A_UP = '#00ccff', CSS_A_DN = '#cc44ff'; // A ↑ cyan, ↓ violet
const CSS_B_UP = '#88ff44', CSS_B_DN = '#ff4422'; // B ↑ lime, ↓ red-orange
function lerpChannel(a, b, t) { return Math.round(a + (b - a) * t); }
function lerpCss(ha, hb, t) {
  const p = s => parseInt(s, 16);
  const rA = p(ha.slice(1,3)), gA = p(ha.slice(3,5)), bA = p(ha.slice(5,7));
  const rB = p(hb.slice(1,3)), gB = p(hb.slice(3,5)), bB = p(hb.slice(5,7));
  return '#' + [lerpChannel(rA,rB,t), lerpChannel(gA,gB,t), lerpChannel(bA,bB,t)]
    .map(v => v.toString(16).padStart(2,'0')).join('');
}
function axisColorsCss(phi) {
  const t = Math.sin((phi % 180) * Math.PI / 180);
  return { up: lerpCss(CSS_A_UP, CSS_B_UP, t), dn: lerpCss(CSS_A_DN, CSS_B_DN, t) };
}

// Measurement basis unit vector in the XY plane
function nHat(phi) {
  const p = phi * Math.PI / 180;
  return new THREE.Vector3(Math.sin(p), Math.cos(p), 0);
}

// Born-rule probabilities for measuring spin-up along n̂ given initial state θ
// For singlet state, if A measures along φ_A and B along φ_B:
//   P(A=+, B=+) = P(A=-, B=-) = sin²(Δφ/2)/2
//   P(A=+, B=-) = P(A=-, B=+) = cos²(Δφ/2)/2
// The correlation is C(φ_A,φ_B) = -cos(φ_A - φ_B)
function singletProbs(phiA, phiB) {
  const delta = (phiA - phiB) * Math.PI / 180;
  const pp = 0.5 * Math.sin(delta / 2) ** 2;  // P(+,+)
  const pm = 0.5 * Math.cos(delta / 2) ** 2;  // P(+,-)
  return { pp, pm, mp: pm, mm: pp };
}

// ── Bohmian guidance for one particle ────────────────────────────────────────
//
// x0:           initial n̂-projection of position, drawn from Born distribution.
//               NOT pre-assigned to any outcome — the guidance equation alone
//               determines which branch the particle ends up in.
// collapseStep: (second-measured particle only) step index at which the first
//               detector fires non-locally. After this step the joint wave
//               function's other branch has been "emptied" so the velocity
//               field jumps to ±KICK/STEPS (pure single-branch guidance).
// forcedIsUp:   which branch survives for this particle after collapse.
//
// Returns { pts, isUp }  — isUp is read from the final position for the first
// particle (pure dynamics), or equals forcedIsUp for the second.
function integrateBohmian(x0, phi, side, detDist, collapseStep, forcedIsUp) {
  const nn = nHat(phi);
  const pts = [];
  let tx = x0 * nn.x, ty = x0 * nn.y;
  const hasCollapse = collapseStep !== undefined;

  for (let i = 0; i <= STEPS; i++) {
    const frac = i / STEPS;
    const z = side * lerp(0, detDist, frac);
    pts.push(new THREE.Vector3(tx, ty, z));

    if (frac >= 0.5 && i < STEPS) {
      const pp2 = (frac - 0.5) / 0.5;
      const sep = pp2 * KICK;
      const sig = SIG * (1 + pp2 * 0.5);
      const upCx = nn.x * sep, upCy = nn.y * sep;
      const dnCx = -nn.x * sep, dnCy = -nn.y * sep;
      let vn;
      if (hasCollapse && i >= collapseStep) {
        // Post-collapse: empty branch vanishes, surviving branch drives at full rate.
        // This is the non-local effect: the velocity field changes instantaneously
        // even though this particle is still in flight far from the first detector.
        vn = (forcedIsUp ? 1 : -1) * KICK / STEPS;
      } else {
        // Both branches active — standard Bohmian guidance from superposition.
        const rUp2 = ((tx - upCx) ** 2 + (ty - upCy) ** 2) / sig ** 2;
        const rDn2 = ((tx - dnCx) ** 2 + (ty - dnCy) ** 2) / sig ** 2;
        const rhoUp = 0.5 * Math.exp(-rUp2);
        const rhoDn = 0.5 * Math.exp(-rDn2);
        vn = (rhoUp - rhoDn) / (rhoUp + rhoDn + 1e-12) * KICK / STEPS;
      }
      tx += nn.x * vn;
      ty += nn.y * vn;
    }
  }
  // For the first particle: outcome emerges purely from dynamics (initial position).
  // For the second particle: forcedIsUp is the forced correlated outcome.
  const last = pts[STEPS];
  const nComp = last.x * nn.x + last.y * nn.y;
  return { pts, isUp: hasCollapse ? forcedIsUp : (nComp > 0) };
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
const Tip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'block' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && text && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(8,20,55,0.97)', border: '1px solid rgba(80,140,255,0.4)',
          borderRadius: 5, padding: '5px 9px', fontSize: 11, color: '#b8d4ff',
          whiteSpace: 'pre-wrap', maxWidth: 220, lineHeight: 1.5,
          zIndex: 999, pointerEvents: 'none',
          fontFamily: "'Courier New',monospace",
          boxShadow: '0 4px 16px rgba(0,0,30,0.7)',
        }}>{text}</span>
      )}
    </span>
  );
};

// ── Angle preset buttons ─────────────────────────────────────────────────────
const PB = ({ vals, cur, onSel }) => (
  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 5 }}>
    {vals.map(v => (
      <button key={v} onClick={() => onSel(v)} style={{
        flex: 1, padding: '3px 0', fontSize: 11,
        background: cur === v ? 'rgba(80,140,255,0.25)' : 'rgba(10,22,55,0.6)',
        border: '1px solid ' + (cur === v ? 'rgba(80,140,255,0.7)' : 'rgba(60,100,200,0.25)'),
        borderRadius: 4, color: cur === v ? '#aaccff' : '#7090b8',
        cursor: 'pointer', fontFamily: 'monospace',
      }}>{v}°</button>
    ))}
  </div>
);

// ── Section label ────────────────────────────────────────────────────────────
const SL = ({ label, tip, children }) => (
  <div style={{ marginBottom: 10 }}>
    <Tip text={tip || null}>
      <div style={{
        fontSize: 13, color: '#7ab8ff', marginBottom: 4,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        cursor: tip ? 'help' : 'default',
        borderBottom: tip ? '1px dotted rgba(100,160,255,0.4)' : 'none',
        display: 'inline-block',
      }}>{label}</div>
    </Tip>
    {children}
  </div>
);

// ── Correlation histogram ────────────────────────────────────────────────────
function CorrelationPanel({ counts, phiA, phiB }) {
  const total = counts.pp + counts.pm + counts.mp + counts.mm || 1;
  const { pp: ePP, pm: ePM, mp: eMP, mm: eMM } = singletProbs(phiA, phiB);
  const corr = (counts.pp + counts.mm - counts.pm - counts.mp) / total;
  const expCorr = -Math.cos((phiA - phiB) * Math.PI / 180);
  const dPhi = Math.abs(phiA - phiB);
  const n = counts.pp + counts.pm + counts.mp + counts.mm;
  const rows = [
    { label: '▲▼ (+,−)', color: '#55ddaa', count: counts.pm, exp: ePM },
    { label: '▼▲ (−,+)', color: '#55aadd', count: counts.mp, exp: eMP },
    { label: '▲▲ (+,+)', color: '#ffaa44', count: counts.pp, exp: ePP },
    { label: '▼▼ (−,−)', color: '#ff4466', count: counts.mm, exp: eMM },
  ];
  return (
    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: '#b8d4ff', minWidth: 168 }}>
      <div style={{ fontSize: 10, color: '#7a9ece', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
        Bell Correlation + Coincidences <span style={{ color: '#8aaedd' }}>n={n}</span>
      </div>
      <div style={{
        background: 'rgba(20,50,90,0.45)', border: '1px solid rgba(80,140,255,0.2)',
        borderRadius: 5, padding: '6px 8px', marginBottom: 8, fontSize: 11,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#7a9ece' }}>Δφ</span>
          <span>{dPhi}°</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#7a9ece' }}>C(QM) = −cos(Δφ)</span>
          <span style={{ color: '#aaddff' }}>{expCorr.toFixed(3)}</span>
        </div>
        <div style={{ marginTop: 3, color: '#506090' }}>
          {dPhi === 0 ? 'Perfect anti-correlation' :
           dPhi === 90 ? 'Uncorrelated' :
           dPhi === 180 ? 'Perfect correlation' :
           'Partial correlation'}
        </div>
      </div>
      {rows.map(({ label, color, count, exp }) => {
        const pct = Math.round(count / total * 100);
        const expPct = Math.round(exp * 100);
        return (
          <div key={label} style={{ marginBottom: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ color }}>{label}</span>
              <span>{count} · {pct}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(15,30,70,0.6)', borderRadius: 3, position: 'relative' }}>
              <div style={{ height: '100%', borderRadius: 3, width: pct + '%', background: color, opacity: 0.7 }} />
              <div style={{ position: 'absolute', top: -2, bottom: -2, width: 2, borderRadius: 1,
                background: 'rgba(200,210,255,0.5)', left: expPct + '%' }} />
            </div>
          </div>
        );
      })}
      <div style={{ borderTop: '1px solid rgba(60,100,200,0.3)', paddingTop: 5, marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#7a9ece' }}>C(observed)</span>
          <span style={{ color: n > 0 ? '#e8f2ff' : '#405070' }}>{n > 0 ? corr.toFixed(3) : '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#7a9ece' }}>C(QM) = −cos Δφ</span>
          <span style={{ color: '#aaddff' }}>{expCorr.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── Control Panel ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const VIEWS = ['collapse', 'bohmian'];
const VIEW_LABELS = { collapse: 'Collapse/Copenhagen', bohmian: 'Pilot-Wave' };
const VIEW_COLORS = { collapse: '#ff9966', bohmian: '#44ddff' };
const VIEW_DESC = {
  collapse: 'Measurement collapses the wave function. One branch vanishes instantly on both sides.',
  bohmian:  'Both branches persist. Particle A\'s position is guided to an outcome; the joint wave function non-locally steers particle B to the correlated branch.',
};

const ControlPanel = React.memo(({
  interp, setInterp,
  phiA, setPhiA, phiARef,
  phiB, setPhiB, phiBRef,
  speed, setSpeed, speedRef,
  running, setRunning,
  showWave, setShowWave,
  waveBrightRef, setWaveBright,
  showNLCue, setShowNLCue,
  showParticles, setShowParticles,
  resetCounts,
  counts, phiAVal, phiBVal,
}) => {
  const vc = VIEW_COLORS[interp];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: '10px 9px', overflowY: 'auto', flex: 1,
      fontFamily: "'Courier New',monospace", color: '#e8f2ff',
    }}>
      {/* Interpretation */}
      <SL label="Interpretation" tip="Toggle between quantum interpretations">
        <button onClick={() => setInterp(VIEWS[(VIEWS.indexOf(interp) + 1) % 2])} style={{
          display: 'block', width: '100%', padding: '7px 10px', marginBottom: 5,
          background: 'rgba(' + (interp === 'collapse' ? '200,80,40' : '30,160,220') + ',0.18)',
          border: '2px solid ' + vc, borderRadius: 6, color: vc,
          cursor: 'pointer', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, textAlign: 'center',
        }}>{'>'} {VIEW_LABELS[interp]}</button>
        <div style={{ fontSize: 12, color: '#99b8e8', lineHeight: 1.6 }}>{VIEW_DESC[interp]}</div>
      </SL>

      {/* Detector A angle */}
      <SL label={'Detector A  φ_A = ' + phiA + '°'} tip={'Measurement axis of detector A\n(left side, particle flying toward −Z)\nφ=0°: measure along +Y\nφ=90°: measure along +X'}>
        <input type="range" min={0} max={180} step={1} defaultValue={phiA}
          ref={phiARef} onInput={e => setPhiA(+e.target.value)}
          style={{ width: '100%', accentColor: '#44ddff', marginBottom: 5 }} />
        <PB vals={[0, 30, 60, 90, 120, 150]} cur={phiA} onSel={setPhiA} />
      </SL>

      {/* Detector B angle */}
      <SL label={'Detector B  φ_B = ' + phiB + '°'} tip={'Measurement axis of detector B\n(right side, particle flying toward +Z)\nφ=0°: measure along +Y\nφ=90°: measure along +X'}>
        <input type="range" min={0} max={180} step={1} defaultValue={phiB}
          ref={phiBRef} onInput={e => setPhiB(+e.target.value)}
          style={{ width: '100%', accentColor: '#ff9966', marginBottom: 5 }} />
        <PB vals={[0, 30, 60, 90, 120, 150]} cur={phiB} onSel={setPhiB} />
      </SL>

      {/* Speed */}
      <SL label={'Speed ×' + speed.toFixed(1)}>
        <input type="range" min={0.25} max={4} step={0.25} defaultValue={speed}
          ref={speedRef} onInput={e => setSpeed(+e.target.value)}
          style={{ width: '100%', accentColor: '#ffcc44' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#506080', marginTop: 2 }}>
          <span>slow</span><span>normal</span><span>fast</span>
        </div>
      </SL>

      {/* Controls */}
      <SL label="Controls">
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <button onClick={() => setRunning(!running)} style={{
            flex: 1, padding: '6px 4px', textAlign: 'center',
            background: running ? 'rgba(20,55,130,0.6)' : 'rgba(25,80,40,0.6)',
            border: '1px solid ' + (running ? 'rgba(70,130,255,0.4)' : 'rgba(60,200,80,0.35)'),
            borderRadius: 5, color: running ? '#88bbff' : '#66dd88',
            cursor: 'pointer', fontSize: 13, fontFamily: 'monospace',
          }}>{running ? '⏸ Pause' : '▶ Play'}</button>
          <button onClick={resetCounts} style={{
            flex: 1, padding: '6px 4px', textAlign: 'center',
            background: 'rgba(15,30,70,0.5)', border: '1px solid #334466',
            borderRadius: 5, color: '#b0ccee', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace',
          }}>✕ Clear</button>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
        <SL label="Wave brightness" tip="Controls the opacity/density of the wave packet visualisation">
          <input type="range" min={0.2} max={4} step={0.05} defaultValue={1}
            ref={waveBrightRef} onInput={e => setWaveBright(+e.target.value)}
            style={{ width: '100%', accentColor: '#88ccff' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#506080', marginTop: 2 }}>
            <span>dim</span><span>default</span><span>bright</span>
          </div>
        </SL>
          <button onClick={() => setShowWave(!showWave)} style={{
            flex: 1, padding: '5px 4px', textAlign: 'center',
            background: showWave ? 'rgba(40,80,180,0.5)' : 'rgba(15,30,70,0.5)',
            border: '1px solid ' + (showWave ? '#5588cc' : '#334466'),
            borderRadius: 5, color: showWave ? '#c8e8ff' : '#7090b8',
            cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
          }}>{showWave ? '◉' : '○'} Wave</button>
          <button onClick={() => setShowNLCue(!showNLCue)} style={{
            flex: 1, padding: '5px 4px', textAlign: 'center',
            background: showNLCue ? 'rgba(160,120,30,0.45)' : 'rgba(15,30,70,0.5)',
            border: '1px solid ' + (showNLCue ? 'rgba(255,220,120,0.7)' : '#334466'),
            borderRadius: 5, color: showNLCue ? '#ffeaa0' : '#7090b8',
            cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
          }}>{showNLCue ? '◉' : '○'} Non-local cue</button>
          {interp === 'bohmian' && (
            <button onClick={() => setShowParticles(!showParticles)} style={{
              flex: 1, padding: '5px 4px', textAlign: 'center',
              background: showParticles ? 'rgba(40,80,180,0.5)' : 'rgba(15,30,70,0.5)',
              border: '1px solid ' + (showParticles ? '#5588cc' : '#334466'),
              borderRadius: 5, color: showParticles ? '#c8e8ff' : '#7090b8',
              cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
            }}>{showParticles ? '◉' : '○'} Particles</button>
          )}
        </div>
      </SL>

      {/* Coincidence statistics */}
      <CorrelationPanel counts={counts} phiA={phiAVal} phiB={phiBVal} />

      <div style={{
        fontSize: 11, color: '#9ab8dd', lineHeight: 1.8, marginTop: 'auto',
        borderTop: '1px solid rgba(50,80,180,0.15)', paddingTop: 8,
      }}>
        <div style={{ color: '#7890b0' }}>Drag: orbit  Scroll: zoom</div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// ── Theory Panel ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// ── Trajectories tab (Bohmian) ──────────────────────────────────────────────
const trajectoryHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body{margin:0;padding:22px 26px;background:#040a1c;color:#cce0ff;
    font-family:'Georgia',serif;font-size:14px;line-height:1.9;}
  h1{font-size:19px;color:#44ddff;margin-bottom:2px;}
  .sub{font-size:12px;color:#336688;margin-bottom:20px;}
  h2{font-size:14px;color:#7ab8ff;font-weight:700;margin:22px 0 8px;
    border-bottom:1px solid rgba(60,120,255,0.25);padding-bottom:5px;}
  p{margin:8px 0 12px;}
  .eq{margin:12px 0;padding:10px 20px;text-align:center;
    background:rgba(20,45,110,0.5);border:1px solid rgba(80,140,255,0.25);
    border-radius:7px;font-size:15px;overflow-x:auto;}
  .step{background:rgba(10,30,65,0.6);border-left:3px solid #44ddff;
    border-radius:0 7px 7px 0;padding:10px 14px;margin:10px 0;}
  .nb{font-size:11px;font-weight:700;color:#44ddff;text-transform:uppercase;
    letter-spacing:.08em;margin-right:8px;}
</style>
<script>
MathJax={tex:{inlineMath:[['$','$']],displayMath:[['$$','$$']]},
  options:{skipHtmlTags:['script','noscript','style','textarea']}};
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
</head><body>
<h1>Pilot-Wave &mdash; Trajectories</h1>
<div class="sub">de Broglie&ndash;Bohm interpretation &nbsp;&middot;&nbsp; particles always have definite positions, outcomes emerge from dynamics</div>

<h2>1. The Pilot Wave</h2>
<p>The singlet state is a real field &mdash; the <em>pilot wave</em> &mdash; that evolves in the two-particle configuration space:</p>
<div class="eq">$$|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}\\bigl(|{+}\\rangle_A|{-}\\rangle_B - |{-}\\rangle_A|{+}\\rangle_B\\bigr)$$</div>
<p>Each particle has a definite (but unknown) position $\\mathbf{Q}_A(t),\\,\\mathbf{Q}_B(t)$ at every moment. The wave does <em>not</em> collapse &mdash; it guides the particles through the <em>conditional wave function</em> on each side. Uncertainty is epistemic (we don't know the initial positions), not ontological. In the simulation the particle is white before branch selection (entangled packet), then takes the color of the guiding branch once the effective conditional wave has selected a channel.</p>

<h2>2. Guidance Equation</h2>
<p>Each particle's velocity equals the local probability current divided by the density of the joint wave function:</p>
<div class="eq">$$\\dot{\\mathbf{Q}}_k = \\frac{\\hbar}{m}\\,\\operatorname{Im}\\!\\left[\\frac{\\Psi^*(\\mathbf{Q}_A,\\mathbf{Q}_B)\\,\\nabla_{\\mathbf{r}_k}\\Psi(\\mathbf{Q}_A,\\mathbf{Q}_B)}{|\\Psi(\\mathbf{Q}_A,\\mathbf{Q}_B)|^2}\\right]_{\\mathbf{r}_k=\\mathbf{Q}_k}$$</div>
<p><strong>B&rsquo;s velocity depends on $\\mathbf{Q}_A$ through the joint wave function.</strong> There is no reduced state for B &mdash; the full entangled $\\Psi$ couples both particles across any distance. This is explicit non-locality, and it is precisely what allows Bohmian mechanics to violate Bell&rsquo;s inequality.</p>

<h2>3. How Outcomes Emerge (step by step)</h2>
<div class="step"><span class="nb">Before flight</span> Both particles start at random transverse positions $Q_k^\\perp$ drawn from the Born distribution $|\\Psi(\\mathbf{Q}_A,\\mathbf{Q}_B)|^2$. <strong>Neither particle is pre-assigned to spin-up or spin-down.</strong> Both colored branches (green &#8593; and orange &#8595;) are active on both sides.</div>
<div class="step"><span class="nb">Branches separate</span> Near the detector the Stern&ndash;Gerlach field pushes the two spin components apart transversely. The guidance equation pushes each particle toward whichever branch it is currently closest to. The outcome is entirely determined by $Q^\\perp$ and the dynamics &mdash; no random event occurs.</div>
<div class="step"><span class="nb">A reaches its detector</span> $\\mathbf{Q}_A$ crosses the critical surface. A&rsquo;s outcome is read from its position: the branch it occupies determines $+$ or $-$. The joint wave function now has one branch dominant for B: the effective wave for B is solely $|{-}\\rangle_B$ (if $A=+$) or $|{+}\\rangle_B$ (if $A=-$).</div>
<div class="step"><span class="nb">Non-local update to B</span> B&rsquo;s guiding field changes <em>instantly</em>: the empty branch of $\\Psi$ no longer contributes to B&rsquo;s velocity. Even though B is still in flight and nothing physically traveled to it, the velocity field it follows shifts. <strong>This is the visible kink in B&rsquo;s trajectory</strong>; at the same moment, B&rsquo;s particle color updates to match the effective conditional guiding branch.</div>
<div class="step"><span class="nb">B reaches its detector</span> Guided by the surviving branch, B lands in the strongly correlated position. The observer reads the outcome. The correlation with A is guaranteed by the guidance equation &mdash; no communication needed.</div>

<h2>4. Simulation Guidance (discretized)</h2>
<p>At each step, the transverse velocity added to particle $k$ is proportional to the density difference at its current position:</p>
<div class="eq">$$v_n = \\frac{\\rho_{\\uparrow}(Q_k^\\perp) - \\rho_{\\downarrow}(Q_k^\\perp)}{\\rho_{\\uparrow}(Q_k^\\perp) + \\rho_{\\downarrow}(Q_k^\\perp)}\\cdot\\frac{\\delta}{N_{\\text{steps}}}$$</div>
<p>where $\\rho_{\\uparrow,\\downarrow}$ are Gaussian densities of the two branches at $Q_k^\\perp$ and $\\delta$ is the total branch separation at the detector. After the collapse step for B, only the surviving branch contributes: the velocity locks to $\\pm\\,\\delta/N_{\\text{steps}}$ &mdash; the trajectory kink.</p>

<h2>5. Equilibrium and Bell Correlations</h2>
<p>Because initial positions are Born-distributed, the simulated statistics reproduce quantum mechanics exactly:</p>
<div class="eq">$$P({+},{-})=P({-},{+})=\\frac{1}{2}\\cos^2\\!\\frac{\\Delta\\varphi}{2}, \\quad P({+},{+})=P({-},{-})=\\frac{1}{2}\\sin^2\\!\\frac{\\Delta\\varphi}{2}$$</div>
<div class="eq">$$C(\\varphi_A,\\varphi_B) = -\\cos(\\Delta\\varphi)$$</div>
<p>This violates the CHSH inequality (classical bound $|S|\\leq 2$) up to $2\\sqrt{2}\\approx 2.83$. Bohmian mechanics achieves this through its explicit non-locality in the guidance equation &mdash; <em>not</em> through pre-assigned hidden variables, which is exactly why it is compatible with Bell&rsquo;s theorem.</p>

<p style="font-size:12px;color:#445566;border-top:1px solid rgba(40,70,140,0.25);
  padding-top:12px;margin-top:20px;">
  <strong style="color:#607090">References:</strong>
  D. Bohm, <em>Phys. Rev.</em> <strong>85</strong>, 166 &amp; 180 (1952). &mdash;
  P.R. Holland, <em>The Quantum Theory of Motion</em> (Cambridge, 1993). &mdash;
  D. D&uuml;rr &amp; S. Teufel, <em>Bohmian Mechanics</em> (Springer, 2009).
</p>
</body></html>`;

// ── Collapse tab (Copenhagen) ──────────────────────────────────────────────
const collapseHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body{margin:0;padding:22px 26px;background:#040a1c;color:#cce0ff;
    font-family:'Georgia',serif;font-size:14px;line-height:1.9;}
  h1{font-size:19px;color:#ff9966;margin-bottom:2px;}
  .sub{font-size:12px;color:#664433;margin-bottom:20px;}
  h2{font-size:14px;color:#ffbb88;font-weight:700;margin:22px 0 8px;
    border-bottom:1px solid rgba(255,120,60,0.2);padding-bottom:5px;}
  p{margin:8px 0 12px;}
  .eq{margin:12px 0;padding:10px 20px;text-align:center;
    background:rgba(60,20,10,0.5);border:1px solid rgba(255,120,60,0.2);
    border-radius:7px;font-size:15px;overflow-x:auto;}
  .step{background:rgba(50,15,5,0.5);border-left:3px solid #ff9966;
    border-radius:0 7px 7px 0;padding:10px 14px;margin:10px 0;}
  .nb{font-size:11px;font-weight:700;color:#ff9966;text-transform:uppercase;
    letter-spacing:.08em;margin-right:8px;}
</style>
<script>
MathJax={tex:{inlineMath:[['$','$']],displayMath:[['$$','$$']]},
  options:{skipHtmlTags:['script','noscript','style','textarea']}};
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
</head><body>
<h1>Collapse/Copenhagen &mdash; Wavefunction Collapse</h1>
<div class="sub">Orthodox interpretation &nbsp;&middot;&nbsp; no definite spin value before measurement</div>

<h2>1. Completeness</h2>
<p>In the Copenhagen interpretation the wave function $|\\Psi\\rangle$ is the <em>complete</em> description of reality. Before measurement, spin has no definite value &mdash; &ldquo;particle A is spin-up&rdquo; is simply not true prior to a measurement. In this visualization the packet is shown white while the two spin components are still fully superposed; near the Stern&ndash;Gerlach magnet it splits into two coloured branches (&#8593;/&#8595;), both of which are physically present until collapse.</p>
<div class="eq">$$|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}\\bigl(|{+}\\rangle_A|{-}\\rangle_B - |{-}\\rangle_A|{+}\\rangle_B\\bigr)$$</div>

<h2>2. Measurement Postulate</h2>
<p>When detector A measures spin along $\\hat{n}_A(\\varphi_A)$, only one outcome can be registered. The probability of each outcome is given by Born&rsquo;s rule:</p>
<div class="eq">$$P(A={+}) = \\langle\\Psi^-|\\,\\hat{P}^A_+\\otimes\\mathbf{1}_B\\,|\\Psi^-\\rangle = \\tfrac{1}{2}$$</div>
<p>Once outcome $A=+$ is obtained, the state <em>collapses</em> instantaneously to the correlated product state:</p>
<div class="eq">$$|\\Psi^-\\rangle\\;\\xrightarrow{A\\,\\text{measures }+}\\; |{+}\\rangle_A\\otimes|{-}\\rangle_B$$</div>

<h2>3. Collapse Sequence in the Simulation</h2>
<div class="step"><span class="nb">Before measurement</span> Both spin components are superimposed on each packet. No outcome exists yet. The simulation shows a white packet in this regime; when it reaches the magnet region, the packet splits and the two coloured branches become visible.</div>
<div class="step"><span class="nb">First detector fires</span> A Born-rule random outcome is drawn. Both wave functions collapse simultaneously: the surviving branch on A and the correlated branch on B are kept, the others vanish &mdash; even though B may be far away. This is the non-local collapse.</div>
<div class="step"><span class="nb">Second detector fires (~25% later)</span> B is now in a spin eigenstate of its own detector axis. Its outcome is completely determined by the prior collapse; no second random draw is needed.</div>

<h2>4. Quantum Correlations</h2>
<p>Joint probabilities for measuring along $\\hat{n}_A(\\varphi_A)$ and $\\hat{n}_B(\\varphi_B)$:</p>
<div class="eq">$$P({+},{-})=P({-},{+})=\\frac{1}{2}\\cos^2\\!\\tfrac{\\Delta\\varphi}{2}, \\quad P({+},{+})=P({-},{-})=\\frac{1}{2}\\sin^2\\!\\tfrac{\\Delta\\varphi}{2}$$</div>
<div class="eq">$$C(\\varphi_A,\\varphi_B)=\\langle\\sigma_A\\cdot\\hat{n}_A\\;\\sigma_B\\cdot\\hat{n}_B\\rangle=-\\cos(\\Delta\\varphi)$$</div>

<h2>5. Bell&rsquo;s Inequality and Its Violation</h2>
<p>Bell (1964) proved that <em>any</em> local hidden-variable theory must satisfy:</p>
<div class="eq">$$|E(a,b)-E(a,b')+E(a',b)+E(a',b')|\\leq 2 \\quad (\\text{CHSH})$$</div>
<p>Quantum mechanics predicts a maximum of $2\\sqrt{2}\\approx 2.83$ &mdash; exceeding the classical bound. The canonical Bell angles $a=0°, a'=45°, b=22.5°, b'=67.5°$ saturate this bound. Loophole-free experiments (Hensen 2015, Giustina 2015) confirm the violation unambiguously.</p>
<p>Copenhagen is agnostic about <em>why</em> the non-local correlations arise &mdash; it simply postulates that the joint state $|\\Psi^-\\rangle$ produces them via Born&rsquo;s rule. The collapse itself is an axiom, not a derived result.</p>

<h2>6. No Faster-Than-Light Signaling</h2>
<p>Despite the instantaneous collapse, no information travels faster than light. Observer B&rsquo;s marginal distribution is always $P(B=+)=\\tfrac{1}{2}$ regardless of A&rsquo;s angle choice or timing. Correlations only appear when A and B compare their records classically.</p>

<p style="font-size:12px;color:#445566;border-top:1px solid rgba(120,60,20,0.25);
  padding-top:12px;margin-top:20px;">
  <strong style="color:#607090">References:</strong>
  J.S. Bell, <em>Physics</em> <strong>1</strong>, 195 (1964). &mdash;
  J.F. Clauser et al., <em>Phys. Rev. Lett.</em> <strong>23</strong>, 880 (1969). &mdash;
  A. Aspect et al., <em>Phys. Rev. Lett.</em> <strong>49</strong>, 91 (1982). &mdash;
  B. Hensen et al., <em>Nature</em> <strong>526</strong>, 682 (2015).
</p>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// ── Main App ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const mountRef      = useRef(null);
  const phiARef       = useRef(null);
  const phiBRef       = useRef(null);
  const speedRef      = useRef(null);
  const waveBrightRef = useRef(null);
  const nonLocalBannerRef = useRef(null);

  // Mutable simulation state (no re-render on every tick)
  const S = useRef({
    phiA: 0, phiB: 90,
    speed: 1.0, running: true,
    interp: 'collapse',         // 'collapse' | 'bohmian'
    measuredSide: 'A',
    showWave: true, showParticles: true, waveBright: 1.0,
    showNLCue: false,
    nlFlash: 0,
    nlFrom: 'A',
    tick: 0, dirty: true,
    // Default camera: negative yaw keeps A on the left and B on the right,
    // with a slightly wider framing so both detectors are visible on load.
    camR: 24, camTheta: -0.3, camPhi: 0.18,
    target: new THREE.Vector3(0, 0, 0),
    drag: null,
    detDistA: Z_DET,        // live, draggable
    detDistB: Z_DET_FAR,    // live, draggable
    counts: { pp: 0, pm: 0, mp: 0, mm: 0 },
    collapsed: false,      // whether first detector has fired this cycle
    outcomeA: null,        // +1 or -1
    outcomeB: null,
    hitFired: [false, false], // [firstDetector, secondDetector] hit dots placed
  });

  const [phiA,         setPhiAUI]      = useState(0);
  const [phiB,         setPhiBUI]      = useState(90);
  const [speed,        setSpeedUI]     = useState(1);
  const [running,      setRunUI]       = useState(true);
  const [interp,       setInterpUI]    = useState('collapse');
  const [measuredSide, setMeasuredSideUI] = useState('A');
  const [showWave,     setShowWaveUI]  = useState(true);
  const [showNLCue,    setShowNLCueUI] = useState(false);
  const [showParticles,setShowPartUI]  = useState(true);
  const [counts,       setCountsUI]    = useState({ pp: 0, pm: 0, mp: 0, mm: 0 });
  const [activeTab,    setActiveTab]   = useState('sim');
  const [panelW,       setPanelW]      = useState(270);
  const [detDists,     setDetDistsUI]  = useState({ A: Z_DET, B: Z_DET_FAR });
  const legendARef = useRef(null);
  const legendBRef = useRef(null);
  const legendAZRef = useRef(null);
  const legendBZRef = useRef(null);

  const T = useRef(null); // Three.js objects

  // Setters sync both React state and mutable S ref
  const setPhiA    = v => {
    S.current.phiA = v; S.current.dirty = true; setPhiAUI(v); if (phiARef.current) phiARef.current.value = v;
    S.current.counts = { pp: 0, pm: 0, mp: 0, mm: 0 };
    setCountsUI({ pp: 0, pm: 0, mp: 0, mm: 0 });
    if (T.current) { T.current.hitsA.clear(); T.current.hitsB.clear(); }
  };
  const setPhiB    = v => {
    S.current.phiB = v; S.current.dirty = true; setPhiBUI(v); if (phiBRef.current) phiBRef.current.value = v;
    S.current.counts = { pp: 0, pm: 0, mp: 0, mm: 0 };
    setCountsUI({ pp: 0, pm: 0, mp: 0, mm: 0 });
    if (T.current) { T.current.hitsA.clear(); T.current.hitsB.clear(); }
  };
  const setSpeed   = v => { S.current.speed = v; setSpeedUI(v); if (speedRef.current) speedRef.current.value = v; };
  const setRunning = v => { S.current.running = v; setRunUI(v); };
  const setInterp  = v => { S.current.interp = v; setInterpUI(v); S.current.dirty = true; };
  const setMeasuredSide = v => { S.current.measuredSide = v; setMeasuredSideUI(v); };
  const setShowWave      = v => { S.current.showWave = v; setShowWaveUI(v); };
  const setWaveBright   = v => { S.current.waveBright = v; };
  const setShowNLCue = v => { S.current.showNLCue = v; setShowNLCueUI(v); };
  const setShowParticles = v => { S.current.showParticles = v; setShowPartUI(v); };
  const resetCounts = () => {
    S.current.counts = { pp: 0, pm: 0, mp: 0, mm: 0 };
    setCountsUI({ pp: 0, pm: 0, mp: 0, mm: 0 });
    if (T.current) { T.current.hitsA.clear(); T.current.hitsB.clear(); }
  };

  // Resize handle
  const resizeHandleRef = useRef(null);
  useEffect(() => {
    const handle = resizeHandleRef.current;
    if (!handle) return;
    const onMove = e => setPanelW(Math.max(200, Math.min(500, e.clientX)));
    const onUp   = e => { handle.releasePointerCapture(e.pointerId); handle.removeEventListener('pointermove', onMove); };
    const onDown = e => { e.preventDefault(); handle.setPointerCapture(e.pointerId); handle.addEventListener('pointermove', onMove); handle.addEventListener('pointerup', onUp, { once: true }); };
    handle.addEventListener('pointerdown', onDown);
    return () => handle.removeEventListener('pointerdown', onDown);
  }, []);

  // ── Three.js scene setup ─────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x07101e, 1);
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 200);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sun = new THREE.DirectionalLight(0x88aaff, 0.8);
    sun.position.set(3, 5, 3);
    scene.add(sun);

    function resize() {
      const w = el.clientWidth || 700, h = el.clientHeight || 440;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    function updateCam() {
      const { camR: r, camTheta: th, camPhi: ph, target: tg } = S.current;
      camera.position.set(
        tg.x + r * Math.sin(th) * Math.cos(ph),
        tg.y + r * Math.sin(ph),
        tg.z + r * Math.cos(th) * Math.cos(ph),
      );
      camera.lookAt(tg);
    }
    updateCam();

    const wPosA = new THREE.Vector3();
    const wPosB = new THREE.Vector3();
    function placeLegendX(node, xPx) {
      if (!node) return;
      const w = el.clientWidth || 1;
      const pad = 8;
      const boxW = node.offsetWidth || 150;
      const left = clamp(xPx - boxW * 0.5, pad, Math.max(pad, w - boxW - pad));
      node.style.left = `${left}px`;
      node.style.right = 'auto';
    }
    function updateLegendAnchors() {
      const aNode = legendARef.current;
      const bNode = legendBRef.current;
      if (!aNode && !bNode) return;
      detA.getWorldPosition(wPosA);
      detB.getWorldPosition(wPosB);
      const xA = (wPosA.clone().project(camera).x * 0.5 + 0.5) * (el.clientWidth || 1);
      const xB = (wPosB.clone().project(camera).x * 0.5 + 0.5) * (el.clientWidth || 1);
      placeLegendX(aNode, xA);
      placeLegendX(bNode, xB);
    }
    function updateLegendZValues(zA, zB) {
      const aNode = legendAZRef.current;
      const bNode = legendBZRef.current;
      if (aNode) aNode.textContent = zA.toFixed(1);
      if (bNode) bNode.textContent = `${zB >= 0 ? '+' : ''}${zB.toFixed(1)}`;
    }

    // ── Scene geometry ───────────────────────────────────────────────────────

    // Beam axes (A=left=-Z, B=right=+Z)
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -Z_DET - 0.5),
        new THREE.Vector3(0, 0,  Z_DET + 0.5),
      ]),
      new THREE.LineBasicMaterial({ color: 0x1a3a6e, transparent: true, opacity: 0.35 })
    ));

    // Source sphere at origin
    const srcMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    scene.add(srcMesh);

    // Source glow ring (entanglement symbol)
    const glowRingPts = Array.from({ length: 65 }, (_, i) => {
      const a = i / 64 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * 0.45, Math.sin(a) * 0.45, 0);
    });
    const glowRing = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(glowRingPts),
      new THREE.LineBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.5 })
    );
    scene.add(glowRing);

    // ── Detectors ────────────────────────────────────────────────────────────
    function makeDetector(zPos, color) {
      const grp = new THREE.Group();
      grp.position.z = zPos;
      // Screen
      grp.add(new THREE.Mesh(
        new THREE.PlaneGeometry(4, 4),
        new THREE.MeshBasicMaterial({
          color: color, transparent: true, opacity: 0.10,
          side: THREE.DoubleSide, depthWrite: false,
        })
      ));
      // Border
      grp.add(new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-2, -2, 0), new THREE.Vector3(2, -2, 0),
          new THREE.Vector3(2,  2, 0), new THREE.Vector3(-2,  2, 0),
        ]),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 })
      ));
      // Crosshair
      [[[-1.6, 0], [1.6, 0]], [[0, -1.6], [0, 1.6]]].forEach(([a, b]) => {
        grp.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a, 0), new THREE.Vector3(...b, 0)]),
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 })
        ));
      });
      scene.add(grp);
      return grp;
    }

    const detA = makeDetector(-Z_DET, 0x44ddff); // left, cyan
    const detB = makeDetector( Z_DET, 0xff9966); // right, orange

    // Non-local update link: brief pulse when first measurement determines the
    // distant side's effective guiding state.
    const nlPos = new Float32Array([
      0, 1.8, -Z_DET,
      0, 1.8,  Z_DET,
    ]);
    const nlGeo = new THREE.BufferGeometry();
    nlGeo.setAttribute('position', new THREE.BufferAttribute(nlPos, 3));
    const nlMat = new THREE.LineBasicMaterial({
      color: 0xffee88,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const nlLink = new THREE.Line(nlGeo, nlMat);
    scene.add(nlLink);

    // ── Stern-Gerlach magnets ────────────────────────────────────────────────────
    // Each magnet is placed 1.5 units in front of its detector screen and
    // rotated so the green (spin-↑) pole points along n̂(φ). The axis arrow
    // is a child of the magnet group so it always inherits the φ rotation.
    const MAG_OFFSET = 3.0; // distance from detector screen toward source

    // ── Angle-dependent measurement colors ────────────────────────────────────
    // The color basis is determined only by the magnet's own angle.
    // We preserve the established look at the two main reference points:
    //   φ =   0°  -> cyan / violet
    //   φ =  90°  -> lime / red-orange
    // and interpolate smoothly in between (returning to the φ=0 palette at 180°).
    const COLOR_A_UP = new THREE.Color(0x00ccff); // A ↑  cyan
    const COLOR_A_DN = new THREE.Color(0xcc44ff); // A ↓  violet
    const COLOR_B_UP = new THREE.Color(0x88ff44); // B ↑  lime
    const COLOR_B_DN = new THREE.Color(0xff4422); // B ↓  red-orange

    function axisColors(phi) {
      const a = (phi % 180) * Math.PI / 180;
      const mixP = Math.sin(a);
      return {
        up: COLOR_A_UP.clone().lerp(COLOR_B_UP, mixP),
        dn: COLOR_A_DN.clone().lerp(COLOR_B_DN, mixP),
      };
    }

    function makeMagnet(yokeColor, poleUpColor, poleDnColor) {
      const grp = new THREE.Group();
      const W = 1.60;    // pole width (perpendicular to measurement axis, X)
      const H = 0.50;    // pole height along measurement axis (Y)
      const D = 0.42;    // pole depth along beam axis (Z)
      const GAP = 0.52;  // gap between pole faces (beam travels through here)
      const yOff = GAP / 2 + H / 2;

      // Helper: Create tapered pole (wedge shape) using custom BufferGeometry
      // This represents the pole piece that creates the field gradient
      const createTaperedPole = (color, yPos) => {
        // Triangular prism: cross-section (X-Y plane) is a triangle
        // Apex points UPWARD toward the gap, wide base faces away from gap.
        // Extended in Z for the depth of the magnet.
        const verts = [
          // Back face at -D/2: triangle
           0,     H/2,  -D/2,  // 0 – apex (toward gap)
          -W/2,  -H/2,  -D/2,  // 1 – base left
           W/2,  -H/2,  -D/2,  // 2 – base right
          // Front face at +D/2: triangle
           0,     H/2,   D/2,  // 3 – apex
          -W/2,  -H/2,   D/2,  // 4 – base left
           W/2,  -H/2,   D/2,  // 5 – base right
        ];

        const indices = [
          // Back triangle
          0, 2, 1,
          // Front triangle
          3, 4, 5,
          // Bottom (wide) face
          1, 2, 5,  1, 5, 4,
          // Left slanted face
          0, 1, 4,  0, 4, 3,
          // Right slanted face
          0, 3, 5,  0, 5, 2,
        ];

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        geo.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
        geo.computeVertexNormals();

        const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ 
          color, 
          transparent: true, 
          opacity: 0.88,
          side: THREE.DoubleSide
        }));
        mesh.position.y = yPos;
        grp.add(mesh);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, linewidth: 2 })
        );
        edges.position.y = yPos;
        grp.add(edges);

        return mesh;
      };

      // Upper pole: flat, wide (S pole - uniform field)
      const flatGeo = new THREE.BoxGeometry(W * 1.05, H, D);
      const flatMesh = new THREE.Mesh(flatGeo, new THREE.MeshLambertMaterial({ 
        color: poleUpColor, 
        transparent: true, 
        opacity: 0.88 
      }));
      flatMesh.position.y = yOff;
      grp.add(flatMesh);
      
      const flatEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(flatGeo),
        new THREE.LineBasicMaterial({ color: poleUpColor, transparent: true, opacity: 0.9, linewidth: 2 })
      );
      flatEdges.position.y = yOff;
      grp.add(flatEdges);

      // Lower pole: tapered to sharp point (N pole - field gradient)
      createTaperedPole(poleDnColor, -yOff);

      // Yoke: two vertical bars on the sides, in the detector’s colour
      const yokeGeo = new THREE.BoxGeometry(0.14, GAP + H * 2.1, D * 0.9);
      const yokeMat = new THREE.MeshLambertMaterial({ color: yokeColor, transparent: true, opacity: 0.55 });
      [-W/2 - 0.14, W/2 + 0.14].forEach(xPos => {
        const yoke = new THREE.Mesh(yokeGeo, yokeMat);
        yoke.position.x = xPos;
        grp.add(yoke);
      });

      // Magnetic field lines showing gradient (denser lines indicate stronger gradient)
      const fieldLineColor = new THREE.Color(yokeColor).multiplyScalar(0.65);
      const lineOpacity = 0.50;
      for (let i = 0; i < 6; i++) {
        const y = -GAP * 0.48 + (i / 5) * GAP * 0.96;
        // Lines get shorter as they approach the tapered pole to show convergence
        const xExtent = W * 0.52 * (1 - 0.15 * Math.abs((i - 2.5) / 2.5));
        const linePts = [
          new THREE.Vector3(-xExtent, y, -D * 0.55),
          new THREE.Vector3( xExtent, y, -D * 0.55)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
        const line = new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ 
            color: fieldLineColor, 
            transparent: true, 
            opacity: lineOpacity,
            linewidth: 1
          })
        );
        grp.add(line);
      }

      // Axis arrow — child of the group, always points local +Y (= n̂(φ) in world).
      // Placed above the upper pole so it’s clearly visible.
      const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, yOff + H * 0.85, 0),
        1.3, 
        yokeColor, 
        0.32, 
        0.18
      );
      grp.add(arrow);

      grp.userData.setPoleColors = (upColor, dnColor) => {
        grp.children.forEach((child) => {
          // Identify meshes by their material properties
          if (child.isMesh && child.material?.color) {
            // Check if it's the tapered pole (has custom BufferGeometry)
            if (child.geometry?.type === 'BufferGeometry' && child.position.y > 0) {
              child.material.color.set(upColor);
            }
            // Lower flat pole
            else if (child.geometry?.type === 'BoxGeometry' && child.position.y < -0.1) {
              child.material.color.set(dnColor);
            }
          }
          // Update edge colors
          if (child.isLineSegments && child.material?.color) {
            if (child.position.y > 0 && child.position.y > 0.3) {
              child.material.color.set(upColor);
            } else if (child.position.y < -0.1) {
              child.material.color.set(dnColor);
            }
          }
        });
      };

      scene.add(grp);
      return grp;
    }

    const magA = makeMagnet(0x44ddff, COLOR_A_UP.getHex(), COLOR_A_DN.getHex());
    const magB = makeMagnet(0xff9966, COLOR_B_UP.getHex(), COLOR_B_DN.getHex());

    // Hit pools on each detector
    function makeHitPool(detGrp, n) {
      const splashes = Array.from({ length: n }, () => {
        const m = new THREE.Mesh(
          new THREE.RingGeometry(0.05, 0.20, 20),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
        );
        detGrp.add(m); return m;
      });
      const dots = Array.from({ length: n }, () => {
        const m = new THREE.Mesh(
          new THREE.CircleGeometry(0.06, 14),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide })
        );
        detGrp.add(m); return m;
      });
      let count = 0;
      return {
        add(x, y, color) {
          const i = count % n;
          splashes[i].position.set(x, y, 0.01);
          splashes[i].material.color.set(color); splashes[i].material.opacity = 0.7;
          dots[i].position.set(x, y, 0.02);
          dots[i].material.color.set(color); dots[i].material.opacity = 0.95;
          count++;
        },
        clear() {
          splashes.forEach(m => m.material.opacity = 0);
          dots.forEach(m => m.material.opacity = 0);
          count = 0;
        },
      };
    }
    const hitsA = makeHitPool(detA, 60);
    const hitsB = makeHitPool(detB, 60);

    // ── Wave-packet slabs (volumetric, shader) ────────────────────────────────
    // Two sets: one for particle A (left side, z<0), one for B (z>0).
    // Each slab stack renders the TWO spinor branches as colored Gaussians.
    const N_SLABS = 36;
    const SLAB_H  = 2.8;
    const K_WAVE  = 3.2;

    const slabVert = `
      varying vec2 vUv; varying vec3 vPos;
      void main(){ vUv=uv; vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
    `;
    // Fragment: renders a pre-split packet (white by default, or instantaneously
    // recolored in collapse mode after the distant detector fires) and, after the
    // magnet, the local up/down branch colors for this side.
    const slabFrag = `
      uniform float uSigXY, uSigZ;
      uniform float uCUpX, uCUpY, uCDnX, uCDnY;  // branch centres
      uniform float uWz, uSlabZ, uPhase;
      uniform float uIsPost;   // 0=superposition, 1=separated, 2=collapsed(+), 3=collapsed(-)
      uniform float uBright, uAlphaMax;
      uniform float uAmpUp, uAmpDown;  // conditional Born-rule weights (0–1) for each branch
      uniform vec3 uPreColor;          // pre-split packet color (white initially)
      uniform vec3 uColorUp;           // ↑-branch color for this side
      uniform vec3 uColorDn;           // ↓-branch color for this side
      varying vec2 vUv; varying vec3 vPos;

      float g2(float x,float y,float cx,float cy,float s){
        float dx=(x-cx)/s, dy=(y-cy)/s;
        return exp(-0.5*(dx*dx+dy*dy));
      }
      float gz(float z,float cz,float sz){ float d=(z-cz)/sz; return exp(-0.5*d*d); }

      void main(){
        float x=vPos.x, y=vPos.y, z=uSlabZ;
        float gzV=gz(z,uWz,uSigZ);
        float phase=cos(${K_WAVE.toFixed(1)}*(z-uWz));
        float cp=phase*0.5+0.5;

        vec3 col; float dens;
        vec2 uvC=vUv-0.5;
        float vig=1.0-smoothstep(0.38,0.50,length(uvC));

        if(uIsPost < 0.5){
          // pre-split packet — white initially; in collapse mode the distant
          // packet changes color immediately after the first detector fires.
          float g=g2(x,y,0.0,0.0,uSigXY);
          dens=g*gzV;
          col=uPreColor*mix(0.68,1.0,cp);
        } else if(uIsPost < 1.5){
          // separated: two colored branches, amplitude-weighted by Born probabilities.
          // Before any measurement: uAmpUp=uAmpDown=1 (equal branches).
          // After the other side fires (Copenhagen): branches become unequal;
          //   the branch weights reflect P(this=± | other=outcome).
          float gUp=g2(x,y,uCUpX,uCUpY,uSigXY)*uAmpUp;
          float gDn=g2(x,y,uCDnX,uCDnY,uSigXY)*uAmpDown;
          dens=max(gUp,gDn)*gzV;
          float tp=gUp/(gUp+gDn+1e-6);
          vec3 cUp=mix(uColorUp*0.12, uColorUp, cp);
          vec3 cDn=mix(uColorDn*0.12, uColorDn, cp);
          col=mix(cDn,cUp,tp);
        } else if(uIsPost < 2.5){
          // collapsed to spin-up branch
          float gUp=g2(x,y,uCUpX,uCUpY,uSigXY);
          dens=gUp*gzV;
          col=mix(uColorUp*0.12, uColorUp, cp);
        } else {
          // collapsed to spin-down branch
          float gDn=g2(x,y,uCDnX,uCDnY,uSigXY);
          dens=gDn*gzV;
          col=mix(uColorDn*0.12, uColorDn, cp);
        }

        if(dens<0.08) discard;
        float d2=dens*dens;
        float alpha=d2*vig*uBright*7.0;
        alpha=clamp(alpha,0.0,uAlphaMax);
        if(alpha<0.005) discard;
        gl_FragColor=vec4(col*(0.5+0.5*dens)*uBright, alpha);
      }
    `;

    const baseUniforms = {
      uSigXY:   { value: SIG * 1.1 },
      uSigZ:    { value: SIG * 1.5 },
      uCUpX:    { value: 0 }, uCUpY: { value: 0 },
      uCDnX:    { value: 0 }, uCDnY: { value: 0 },
      uWz:      { value: 0 },
      uSlabZ:   { value: 0 },
      uPhase:   { value: 0 },
      uIsPost:  { value: 0 },
      uBright:  { value: 0.55 },
      uAlphaMax:{ value: 0.32 },
      uAmpUp:   { value: 1.0 },
      uAmpDown: { value: 1.0 },
      uPreColor:{ value: new THREE.Color(0xffffff) },
      uColorUp: { value: new THREE.Color(0xffffff) },
      uColorDn: { value: new THREE.Color(0xffffff) },
    };
    const slabGeo = new THREE.PlaneGeometry(SLAB_H * 2, SLAB_H * 2, 1, 1);

    function makeSlabStack(zFrom, zTo, colorUp, colorDn) {
      return Array.from({ length: N_SLABS }, (_, i) => {
        const mat = new THREE.ShaderMaterial({
          vertexShader: slabVert,
          fragmentShader: slabFrag,
          uniforms: THREE.UniformsUtils.clone(baseUniforms),
          transparent: true, depthWrite: false,
          blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        });
        mat.uniforms.uColorUp.value.copy(colorUp);
        mat.uniforms.uColorDn.value.copy(colorDn);
        const mesh = new THREE.Mesh(slabGeo, mat);
        const fixedZ = zFrom + (i + 0.5) / N_SLABS * (zTo - zFrom);
        mesh.position.z = fixedZ;
        mat.uniforms.uSlabZ.value = fixedZ;
        scene.add(mesh);
        return mesh;
      });
    }

    const slabsA = makeSlabStack(-Z_DET_FAR, Z_SRC - 0.3, COLOR_A_UP, COLOR_A_DN);
    const slabsB = makeSlabStack( Z_SRC + 0.3, Z_DET_FAR,  COLOR_B_UP, COLOR_B_DN);

    // ── Bohmian particles — ONE per side (that's the whole point!) ────────────
    const N_BOHM = 1;

    function makeBohmParticles(n) {
      const dots  = Array.from({ length: n }, () => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.10, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0 }));
        scene.add(m); return m;
      });
      const glows = Array.from({ length: n }, () => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0, depthWrite: false }));
        scene.add(m); return m;
      });
      const lines = Array.from({ length: n }, () => {
        const pos = new Float32Array((STEPS + 1) * 3);
        const col = new Float32Array((STEPS + 1) * 3);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5 }));
        scene.add(line); return { geo, pos, col, line };
      });
      return { dots, glows, lines };
    }
    const bohmA = makeBohmParticles(N_BOHM);
    const bohmB = makeBohmParticles(N_BOHM);

    // Pre-compute Bohmian trajectories for a given set of params
    let trajsA = [], trajsB = [];
    let hitRegistered = [false, false]; // [bohmA reached det, bohmB reached det]

    function buildTrajectories() {
      const s = S.current;
      const firstIsA = s.measuredSide === 'A';
      const colorsA = axisColors(s.phiA);
      const colorsB = axisColors(s.phiB);
      const detDistA = s.detDistA;
      const detDistB = s.detDistB;
      const distFirst  = firstIsA ? detDistA : detDistB;
      const distSecond = firstIsA ? detDistB : detDistA;

      // Step in the SECOND particle's trajectory at which the first detector fires.
      const fracFirst = distFirst / distSecond;
      const collapseStepSecond = Math.round(STEPS * clamp(fracFirst, 0.05, 0.95));

      // ── First particle ──────────────────────────────────────────────────────
      // Initial position: random Gaussian sample, NO pre-assignment of outcome.
      // The guidance equation determines the outcome from the dynamics alone.
      const x0First = (Math.random() - 0.5) * SIG * 2.0;
      const phiFirst = firstIsA ? s.phiA : s.phiB;
      const sideFirst = firstIsA ? -1 : 1;
      const resFirst = integrateBohmian(x0First, phiFirst, sideFirst, distFirst);
      const isUpFirst = resFirst.isUp;  // outcome emerges from dynamics

      // ── Second particle ─────────────────────────────────────────────────────
      // Also starts at a random Gaussian position — guided by BOTH branches
      // until step collapseStepSecond, when the first detector fires.
      // At that moment the joint wave function changes non-locally: the empty
      // branch disappears and the surviving branch is the one correlated with
      // the first particle's outcome (from singlet Born-rule correlations).
      const x0Second = (Math.random() - 0.5) * SIG * 2.0;
      const phiSecond = firstIsA ? s.phiB : s.phiA;
      const sideSecond = firstIsA ? 1 : -1;

      // Conditional probability: given first outcome, what does QM predict for second?
      // P(second=+ | first=+) = 2*pp = sin²(Δφ/2)
      // P(second=+ | first=-) = 2*pm = cos²(Δφ/2)
      const { pp, pm } = singletProbs(s.phiA, s.phiB);
      const probSecondUp = isUpFirst ? (2 * pp) : (2 * pm);
      const isUpSecond = Math.random() < probSecondUp;

      const resSecond = integrateBohmian(
        x0Second, phiSecond, sideSecond, distSecond,
        collapseStepSecond, isUpSecond   // collapse + forced branch
      );

      if (firstIsA) {
        trajsA = [{ pts: resFirst.pts,  isUp: isUpFirst  }];
        trajsB = [{ pts: resSecond.pts, isUp: isUpSecond }];
      } else {
        trajsB = [{ pts: resFirst.pts,  isUp: isUpFirst  }];
        trajsA = [{ pts: resSecond.pts, isUp: isUpSecond }];
      }

      // Upload trajectory geometry with per-vertex color.
      // The second particle's trail transitions from white-ish pre-split to its
      // outcome color after the non-local change becomes relevant.
      [
        {
          trajs: trajsA,
          bohm: bohmA,
          isSecond: !firstIsA,
          colorUp: [colorsA.up.r, colorsA.up.g, colorsA.up.b],
          colorDn: [colorsA.dn.r, colorsA.dn.g, colorsA.dn.b],
        },
        {
          trajs: trajsB,
          bohm: bohmB,
          isSecond: firstIsA,
          colorUp: [colorsB.up.r, colorsB.up.g, colorsB.up.b],
          colorDn: [colorsB.dn.r, colorsB.dn.g, colorsB.dn.b],
        },
      ].forEach(({ trajs, bohm, isSecond, colorUp, colorDn }) => {
        const { pts, isUp } = trajs[0];
        const fl = bohm.lines[0];
        const [finalR, finalG, finalB] = isUp ? colorUp : colorDn;
        pts.forEach((p, j) => {
          fl.pos[j * 3] = p.x; fl.pos[j * 3 + 1] = p.y; fl.pos[j * 3 + 2] = p.z;
          // Pre-separation: white-ish; post-separation: outcome color.
          // For the second particle the color kinks at collapseStepSecond.
          const splitStep = isSecond ? collapseStepSecond : Math.round(STEPS * 0.5);
          const t = clamp((j - splitStep) / 20, 0, 1);
          fl.col[j * 3]     = lerp(1.0, finalR, t);
          fl.col[j * 3 + 1] = lerp(1.0, finalG, t);
          fl.col[j * 3 + 2] = lerp(1.0, finalB, t);
        });
        fl.geo.attributes.position.needsUpdate = true;
        fl.geo.attributes.color.needsUpdate = true;
        fl.geo.setDrawRange(0, pts.length);
        fl.line.visible = false;
      });

      hitRegistered[0] = hitRegistered[1] = false;
    }
    buildTrajectories();

    // ── Input ────────────────────────────────────────────────────────────────
    // Raycaster for detector hit-testing
    const raycaster = new THREE.Raycaster();
    const ndcMouse  = new THREE.Vector2();
    let draggingDet = null; // null | 'A' | 'B'
    let dragStartX  = 0;
    let dragStartDist = 0;

    // Project screen-X movement onto world-Z axis: Δz = ΔscreenX * dz/dx
    function screenDxToWorldDz(screenDx) {
      // Approximate: move a point at the detector's world Z along the camera
      // right vector, then read how much world-Z changes per pixel.
      const right = new THREE.Vector3();
      right.crossVectors(
        new THREE.Vector3().subVectors(S.current.target, camera.position).normalize(),
        new THREE.Vector3(0, 1, 0),
      ).normalize();
      const { clientWidth: W } = el;
      // FOV-based scale: world units per pixel at the camera distance
      const dist = S.current.camR;
      const fovRad = camera.fov * Math.PI / 180;
      const unitsPerPx = 2 * dist * Math.tan(fovRad / 2) / W;
      return right.z * screenDx * unitsPerPx * 3.5;
    }

    function hitTestDetectors(e) {
      const rect = el.getBoundingClientRect();
      ndcMouse.set(
        ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        -((e.clientY - rect.top)  / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndcMouse, camera);
      const children = [
        ...(detA.children), ...(detB.children)
      ];
      const hits = raycaster.intersectObjects(children, false);
      if (!hits.length) return null;
      // Determine which detector was hit by checking the Z sign of the hit object.
      // Guard against Three.js objects whose parent was cleared (e.g. during HMR).
      const parent = hits[0].object.parent;
      if (!parent) return null;
      const hitZ = parent.position.z;
      return hitZ < 0 ? 'A' : 'B';
    }

    function onDown(e) {
      // Try detector drag first (left button only)
      if ((e.button ?? 0) === 0) {
        const which = hitTestDetectors(e);
        if (which) {
          draggingDet = which;
          dragStartX = e.clientX;
          dragStartDist = which === 'A' ? S.current.detDistA : S.current.detDistB;
          el.setPointerCapture(e.pointerId);
          el.style.cursor = 'ew-resize';
          return;
        }
      }
      S.current.drag = { btn: e.button ?? 0, x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      const s = S.current;
      if (draggingDet) {
        const dz = screenDxToWorldDz(e.clientX - dragStartX);
        // A is on -Z side: dragging right = moving away from source = larger dist
        const sign = draggingDet === 'A' ? -1 : 1;
        const newDist = clamp(dragStartDist + sign * dz, 2.0, 20.0);
        if (draggingDet === 'A') s.detDistA = newDist;
        else                     s.detDistB = newDist;
        // Automatically derive which detector is first from distance
        s.measuredSide = s.detDistA <= s.detDistB ? 'A' : 'B';
        setMeasuredSideUI(s.measuredSide);
        s.dirty = true;
        T.current?.setDetDistsUI({ A: s.detDistA, B: s.detDistB });
        return;
      }
      if (!s.drag) return;
      const dx = e.clientX - s.drag.x, dy = e.clientY - s.drag.y;
      s.drag.x = e.clientX; s.drag.y = e.clientY;
      if (s.drag.btn === 0) {
        s.camTheta -= dx * 0.007;
        s.camPhi = clamp(s.camPhi + dy * 0.007, -1.2, 1.2);
      } else {
        const fwd   = new THREE.Vector3().subVectors(s.target, camera.position).normalize();
        const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
        const up    = new THREE.Vector3().crossVectors(right, fwd).normalize();
        const spd   = s.camR * 0.001;
        s.target.addScaledVector(right, -dx * spd);
        s.target.addScaledVector(up,     dy * spd);
      }
      updateCam();
    }
    function onUp(e) {
      if (draggingDet) {
        draggingDet = null;
        el.style.cursor = 'grab';
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        return;
      }
      S.current.drag = null;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = 'grab';
    }
    function onHover(e) {
      if (draggingDet || S.current.drag) return;
      const which = hitTestDetectors(e);
      el.style.cursor = which ? 'ew-resize' : 'grab';
    }
    function onWheel(e) {
      e.preventDefault();
      S.current.camR = clamp(S.current.camR * (e.deltaY > 0 ? 1.10 : 0.91), 3, 50);
      updateCam();
    }
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointermove', onHover);
    el.addEventListener('pointerup',   onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('contextmenu', e => e.preventDefault());

    T.current = {
      scene, camera, renderer,
      detA, detB,
      nlLink,
      magA, magB,
      slabsA, slabsB,
      bohmA, bohmB,
      hitsA, hitsB,
      buildTrajectories,
      updateCam,
      setCountsUI: c => setCountsUI({ ...c }),
      setDetDistsUI: d => setDetDistsUI({ ...d }),
    };

    // ── Render loop ──────────────────────────────────────────────────────────
    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      const s = S.current;
      const Tr = T.current;
      if (!Tr) return;

      if (s.dirty) { Tr.buildTrajectories(); s.dirty = false; }
      if (s.running) s.tick += s.speed;

      updateCam();

      const frac = (s.tick % PERIOD) / PERIOD; // 0→1 each cycle
      // Both particles travel at the same speed. In one full cycle the
      // farther particle covers Z_DET_FAR; the closer one covers Z_DET
      // and arrives at frac = FRAC_FIRST ≈ 0.80.
      const travelDist = Math.max(s.detDistA, s.detDistB) * frac;
      const detDistA = s.detDistA;
      const detDistB = s.detDistB;
      // Per-particle trajectory index (0→STEPS over each particle's own journey)
      const tIdxA = clamp(Math.round(Math.min(travelDist, detDistA) / detDistA * STEPS), 0, STEPS);
      const tIdxB = clamp(Math.round(Math.min(travelDist, detDistB) / detDistB * STEPS), 0, STEPS);

      // Reset at the start of each new cycle
      if (frac < 0.02 && s.collapsed) {
        s.collapsed = false;
        s.outcomeA = null;
        s.outcomeB = null;
        s.nlFlash = 0;
        hitRegistered[0] = hitRegistered[1] = false;
        s.hitFired[0] = s.hitFired[1] = false;
        s.dirty = true;
      }

      // ── First detector fires when first particle arrives ──────────────────
      const firstFired  = travelDist >= Math.min(s.detDistA, s.detDistB);
      const secondFired = travelDist >= Math.max(s.detDistA, s.detDistB) * 0.99;

      if (firstFired && !s.collapsed) {
        s.collapsed = true;
        s.nlFlash = s.showNLCue ? 1.0 : 0;
        s.nlFrom = s.measuredSide;
        // Read outcomes from pre-assigned Bohmian trajectories
        s.outcomeA = trajsA[0]?.isUp ? 1 : -1;
        s.outcomeB = trajsB[0]?.isUp ? 1 : -1;
        const key = (s.outcomeA === 1 ? 'p' : 'm') + (s.outcomeB === 1 ? 'p' : 'm');
        s.counts[key]++;
        Tr.setCountsUI(s.counts);
      }

      const collapsed = s.collapsed;
      const outcomeA  = s.outcomeA;
      const outcomeB  = s.outcomeB;

      // ── Move detectors + orient magnets (fixed offset from screen) ────────
      Tr.detA.position.z = -detDistA;
      Tr.detB.position.z =  detDistB;
      const nnA = nHat(s.phiA);
      const nnB = nHat(s.phiB);
      const colorsA = axisColors(s.phiA);
      const colorsB = axisColors(s.phiB);
      // Magnets are 1.5 units in front of (toward source from) each detector.
      // R_z(-φ) maps local +Y → n̂(φ); the child arrow inherits this rotation.
      Tr.magA.position.z = -(detDistA - MAG_OFFSET);
      Tr.magA.rotation.z = -s.phiA * Math.PI / 180;
      Tr.magB.position.z =  (detDistB - MAG_OFFSET);
      Tr.magB.rotation.z = -s.phiB * Math.PI / 180;
      Tr.magA.userData.setPoleColors?.(colorsA.up, colorsA.dn);
      Tr.magB.userData.setPoleColors?.(colorsB.up, colorsB.dn);
      updateLegendAnchors();
      updateLegendZValues(-detDistA, detDistB);
      if (Tr.nlLink) {
        const fromDetZ = s.nlFrom === 'A' ? -detDistA : detDistB;
        const remoteWaveZ = s.nlFrom === 'A'
          ? Math.min(travelDist, detDistB)
          : -Math.min(travelDist, detDistA);
        const arr = Tr.nlLink.geometry.attributes.position.array;
        // Draw from measured detector -> remote wave packet (not detector -> detector).
        arr[0] = 0; arr[1] = 1.8; arr[2] = fromDetZ;
        arr[3] = 0; arr[4] = 0.6; arr[5] = remoteWaveZ;
        Tr.nlLink.geometry.attributes.position.needsUpdate = true;
        Tr.nlLink.material.opacity = s.showNLCue ? Math.min(0.9, s.nlFlash * 0.8) : 0;
      }
      const nlBanner = nonLocalBannerRef.current;
      if (nlBanner) {
        const from = s.nlFrom;
        const to = from === 'A' ? 'B' : 'A';
        nlBanner.textContent = `NON-LOCAL UPDATE: ${from} measured -> ${to} wave updates instantly`;
        nlBanner.style.opacity = (s.showNLCue && s.nlFlash > 0.02) ? String(Math.min(0.96, s.nlFlash)) : '0';
      }
      if (s.nlFlash > 0) s.nlFlash *= 0.965;

      // ── Wave-packet slab update ───────────────────────────────────────────
      const sw = s.showWave;
      // Per-particle travel fractions (0→1 over each particle's own journey)
      const fracA = Math.min(travelDist, detDistA) / detDistA;
      const fracB = Math.min(travelDist, detDistB) / detDistB;
      // Wave packet centres — stop advancing once particle reaches its detector
      const wZA = -Math.min(travelDist, detDistA);
      const wZB =  Math.min(travelDist, detDistB);

      // updateSlabs: each side gets its own travel fraction → correct separation.
      // Copenhagen:
      //   • The measured side (reached its own detector) collapses to one branch.
      //   • The UNMEASURED side still has two branches whose relative amplitudes
      //     reflect P(this=± | other=outcome) from Born rule.
      //     Only equal (1:1) before any measurement; unequal after first fires.
      //     Collapses to one branch only when THIS side’s detector fires.
      // Bohmian: both branches always persist, never collapse.
      // detDist: total distance from source to this side's detector.
      // Splitting begins when the wave reaches the magnet (MAG_OFFSET in front
      // of the screen), so splitFrac = (detDist - MAG_OFFSET) / detDist.
      function updateSlabs(slabs, wZ, phiVal, outcome, particleFrac, thisMeasured, ampUp, ampDown, detDist, colors, partnerOutcome, partnerColors) {
        const splitFrac = (detDist - MAG_OFFSET) / detDist;
        const postFracP = particleFrac > splitFrac ? (particleFrac - splitFrac) / (1 - splitFrac) : 0;
        const sepP   = postFracP * KICK;
        const sigXYP = SIG * (1 + postFracP * 0.4);
        const nn     = nHat(phiVal);
        const upCx   =  nn.x * sepP, upCy  =  nn.y * sepP;
        const dnCx   = -nn.x * sepP, dnCy  = -nn.y * sepP;
        // 0=superposition  1=two branches  2=collapsed↑  3=collapsed↓
        let isPostVal = 0;
        let aUp = 1, aDn = 1;
        if (particleFrac >= splitFrac) {
          if (thisMeasured && outcome !== null && s.interp === 'collapse') {
            // Copenhagen: collapse to the actual outcome branch.
            isPostVal = outcome === 1 ? 2 : 3;
          } else if (thisMeasured && outcome !== null && s.interp === 'bohmian') {
            // Bohmian: wave doesn't collapse but we know which branch the
            // particle is in — show only that branch so wave matches particle.
            isPostVal = outcome === 1 ? 2 : 3;
          } else {
            // Still in superposition before this side's detector fires.
            isPostVal = 1;
            aUp = ampUp;
            aDn = ampDown;
          }
        }
        slabs.forEach(mesh => {
          if (!sw) { mesh.visible = false; return; }
          const u = mesh.material.uniforms;
          u.uColorUp.value.copy(colors.up);
          u.uColorDn.value.copy(colors.dn);
          if (collapsed && !thisMeasured) {
            // Both interpretations: once the remote detector fires, the outcome
            // of THIS particle is determined (by entanglement / Bohmian guidance).
            // Tint the pre-split wave to the partner's non-selected branch color
            // so the viewer can read the anti-correlation before the particle arrives.
            u.uPreColor.value.copy(partnerOutcome === 1 ? partnerColors.dn : partnerColors.up);
          } else {
            u.uPreColor.value.setRGB(1, 1, 1);
          }
          u.uSigXY.value    = sigXYP;
          u.uSigZ.value     = SIG * 1.5;
          u.uCUpX.value     = upCx; u.uCUpY.value = upCy;
          u.uCDnX.value     = dnCx; u.uCDnY.value = dnCy;
          u.uWz.value       = wZ;
          u.uIsPost.value   = isPostVal;
          u.uBright.value   = 0.55 * s.waveBright;
          u.uAlphaMax.value = Math.min(0.32 * s.waveBright, 0.95);
          u.uAmpUp.value    = aUp;
          u.uAmpDown.value  = aDn;
          mesh.visible      = true;
        });
      }

      // ── Per-side measurement state and conditional amplitudes ─────────────
      // In Copenhagen:
      //   measuredA = this side’s detector has fired (A’s wave collapses).
      //   measuredB = this side’s detector has fired (B’s wave collapses).
      // After the FIRST detector fires but before the SECOND fires, the unmeasured
      // wave still has two branches with Born-rule conditional amplitude weighting:
      //   P(second=± | first=outcome) = sin²(Δφ/2) or cos²(Δφ/2)
      const firstIsA = s.measuredSide === 'A';
      const measuredA = firstIsA ? collapsed : secondFired;
      const measuredB = firstIsA ? secondFired : collapsed;

      // Compute conditional amplitude weights for the UNMEASURED wave.
      // When both or neither detector has fired, each branch has equal weight = 1.
      let ampUpA = 1, ampDownA = 1;
      let ampUpB = 1, ampDownB = 1;
      if (collapsed && s.interp === 'collapse') {
        const firstOutcome = firstIsA ? outcomeA : outcomeB; // +1 or -1
        const df = (s.phiA - s.phiB) * Math.PI / 180;
        // P(second=+ | first=±) for singlet state
        const pUp = firstOutcome === 1 ? Math.sin(df / 2) ** 2 : Math.cos(df / 2) ** 2;
        const pDn = 1 - pUp;
        // Apply to whichever side is the SECOND (unmeasured) side.
        // After second fires, that side collapses via thisMeasured — amps irrelevant.
        if (firstIsA) { ampUpB = pUp; ampDownB = pDn; }
        else          { ampUpA = pUp; ampDownA = pDn; }
      }

      updateSlabs(slabsA, wZA, s.phiA, outcomeA, fracA, measuredA, ampUpA, ampDownA, detDistA, colorsA, outcomeB, colorsB);
      updateSlabs(slabsB, wZB, s.phiB, outcomeB, fracB, measuredB, ampUpB, ampDownB, detDistB, colorsB, outcomeA, colorsA);

      // ── Bohmian particles ─────────────────────────────────────────────────
      const showP = s.showParticles && s.interp === 'bohmian';

      [
        {
          trajs: trajsA, bohm: bohmA, hitPool: hitsA, tIdx: tIdxA, hitKey: 0,
          upHex: colorsA.up.getHex(), dnHex: colorsA.dn.getHex(),
          thisMeasured: measuredA, partnerOutcome: outcomeB,
          partnerUpHex: colorsB.up.getHex(), partnerDnHex: colorsB.dn.getHex(),
        },
        {
          trajs: trajsB, bohm: bohmB, hitPool: hitsB, tIdx: tIdxB, hitKey: 1,
          upHex: colorsB.up.getHex(), dnHex: colorsB.dn.getHex(),
          thisMeasured: measuredB, partnerOutcome: outcomeA,
          partnerUpHex: colorsA.up.getHex(), partnerDnHex: colorsA.dn.getHex(),
        },
      ].forEach(({ trajs, bohm, hitPool, tIdx: myTIdx, hitKey, upHex, dnHex, thisMeasured, partnerOutcome, partnerUpHex, partnerDnHex }) => {
        const { pts, isUp } = trajs[0];
        // Determine the step at which the wave splits inside the magnet so we
        // can colour the particle as soon as it enters the branch it will follow.
        const detDist = hitKey === 0 ? detDistA : detDistB;
        const splitStep = Math.round((detDist - MAG_OFFSET) / detDist * STEPS);
        const hasSplit = myTIdx >= splitStep;
        const remoteMeasured = collapsed && !thisMeasured;
        const remoteCol = partnerOutcome === 1 ? partnerDnHex : partnerUpHex;
        const col = (hasSplit || thisMeasured)
          ? (isUp ? upHex : dnHex)
          : (remoteMeasured ? remoteCol : 0xffffff);
        if (!showP) {
          bohm.dots[0].visible       = false;
          bohm.glows[0].visible      = false;
          bohm.lines[0].line.visible = false;
          return;
        }
        const pt = pts[Math.min(myTIdx, pts.length - 1)];
        if (!pt) return;
        bohm.dots[0].position.copy(pt);
        bohm.glows[0].position.copy(pt);
        bohm.dots[0].visible  = true;
        bohm.glows[0].visible = true;
        bohm.dots[0].material.color.set(col);
        bohm.glows[0].material.color.set(col);
        bohm.dots[0].material.opacity  = 0.95;
        bohm.glows[0].material.opacity = 0.18;
        bohm.lines[0].line.visible = true;
        bohm.lines[0].geo.setDrawRange(0, myTIdx + 1);

        // Hit dot when this particle reaches its own detector
        if (myTIdx >= STEPS - 1 && !hitRegistered[hitKey]) {
          hitRegistered[hitKey] = true;
          const endPt = pts[STEPS];
          hitPool.add(endPt.x, endPt.y, col);
        }
      });

      // Copenhagen: first detector fires when first particle arrives,
      //             second detector fires when second particle arrives.
      if (s.interp === 'collapse') {
        const rr = () => (Math.random() - 0.5) * SIG * 0.9;
        const firstIsA = s.measuredSide === 'A';
        if (collapsed && !s.hitFired[0]) {
          s.hitFired[0] = true;
          const oc1  = firstIsA ? outcomeA : outcomeB;
          const nn1  = nHat(firstIsA ? s.phiA : s.phiB);
          const s1   = oc1 === 1 ? 1 : -1;
          // First hit: use the color of whichever side fired first
          const col1 = firstIsA ? (oc1 === 1 ? colorsA.up.getHex() : colorsA.dn.getHex())
                                 : (oc1 === 1 ? colorsB.up.getHex() : colorsB.dn.getHex());
          if (firstIsA) hitsA.add(nn1.x * KICK * s1 + rr(), nn1.y * KICK * s1 + rr(), col1);
          else          hitsB.add(nn1.x * KICK * s1 + rr(), nn1.y * KICK * s1 + rr(), col1);
        }
        if (secondFired && !s.hitFired[1]) {
          s.hitFired[1] = true;
          const oc2  = firstIsA ? outcomeB : outcomeA;
          const nn2  = nHat(firstIsA ? s.phiB : s.phiA);
          const s2   = oc2 === 1 ? 1 : -1;
          // Second hit: use the color of the *other* side
          const col2 = firstIsA ? (oc2 === 1 ? colorsB.up.getHex() : colorsB.dn.getHex())
                                 : (oc2 === 1 ? colorsA.up.getHex() : colorsA.dn.getHex());
          if (firstIsA) hitsB.add(nn2.x * KICK * s2 + rr(), nn2.y * KICK * s2 + rr(), col2);
          else          hitsA.add(nn2.x * KICK * s2 + rr(), nn2.y * KICK * s2 + rr(), col2);
        }
      }

      Tr.renderer.render(Tr.scene, Tr.camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointermove', onHover);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#07101e', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .tbb{padding:8px 18px;cursor:pointer;font-family:monospace;font-size:13px;
          border:none;border-bottom:3px solid transparent;background:transparent;color:#6888aa;}
        .tba{color:#aaddff;border-bottom-color:#4488ff;}
        .tbb:hover{color:#cce0ff;}
        .rh{width:5px;cursor:col-resize;background:rgba(40,80,200,0.15);flex-shrink:0;
          transition:background 0.15s;touch-action:none;user-select:none;}
        .rh:hover,.rh:active{background:rgba(80,140,255,0.4);}
        input[type=range]{touch-action:auto;pointer-events:auto;cursor:pointer;}
      `}</style>

      {/* Tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', height: 38, flexShrink: 0,
        background: 'rgba(4,10,30,0.98)', borderBottom: '1px solid rgba(40,80,180,0.3)',
        paddingLeft: 12, gap: 4,
      }}>
        <span style={{ fontSize: 11, color: '#4060a0', fontFamily: 'monospace', letterSpacing: '0.08em', marginRight: 12 }}>
          BELL EXPERIMENT
        </span>
        <button className={'tbb' + (activeTab === 'sim' ? ' tba' : '')} onClick={() => setActiveTab('sim')}>Simulation</button>
        <button className={'tbb' + (activeTab === 'trajectories' ? ' tba' : '')} onClick={() => setActiveTab('trajectories')}>Pilot-Wave</button>
        <button className={'tbb' + (activeTab === 'collapse' ? ' tba' : '')} onClick={() => setActiveTab('collapse')}>Collapse/Copenhagen</button>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: 0 }}>
        {/* Left panel */}
        <div style={{ width: panelW, minWidth: 200, flexShrink: 0, background: 'rgba(8,18,45,0.98)', overflowY: 'auto', height: '100%' }}>
          <ControlPanel
            interp={interp} setInterp={setInterp}
            phiA={phiA} setPhiA={setPhiA} phiARef={phiARef}
            phiB={phiB} setPhiB={setPhiB} phiBRef={phiBRef}
            speed={speed} setSpeed={setSpeed} speedRef={speedRef}
            running={running} setRunning={setRunning}
            showWave={showWave} setShowWave={setShowWave}
            waveBrightRef={waveBrightRef} setWaveBright={setWaveBright}
            showNLCue={showNLCue} setShowNLCue={setShowNLCue}
            showParticles={showParticles} setShowParticles={setShowParticles}
            resetCounts={resetCounts}
            counts={counts}
            phiAVal={phiA} phiBVal={phiB}
          />
        </div>

        {/* Resize handle */}
        <div className="rh" ref={resizeHandleRef} />

        {/* Right: canvas or theory */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', height: '100%' }}>
          <div ref={mountRef} style={{
            width: '100%', height: '100%', cursor: 'grab',
            display: activeTab === 'sim' ? 'block' : 'none',
          }} />

          {/* Overlay labels */}
          {activeTab === 'sim' && (() => {
            const cA = axisColorsCss(phiA);
            const cB = axisColorsCss(phiB);
            const Swatch = ({ color }) => (
              <span style={{
                display: 'inline-block', width: 9, height: 9, borderRadius: 2,
                background: color, marginRight: 3, verticalAlign: 'middle',
              }} />
            );
            const SpinRow = ({ up, dn }) => (
              <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11, color: '#b8d4ff' }}>
                <span><Swatch color={up} />↑ spin</span>
                <span><Swatch color={dn} />↓ spin</span>
                <span><Swatch color='rgba(255,255,255,0.7)' />⊙ entangled</span>
              </div>
            );
            return (
              <>
                <div ref={nonLocalBannerRef} style={{
                  position: 'absolute', top: 46, left: '50%', transform: 'translateX(-50%)',
                  zIndex: 11, opacity: 0, pointerEvents: 'none',
                  fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.03em',
                  color: '#ffe688', background: 'rgba(35,25,6,0.86)',
                  border: '1px solid rgba(255,230,136,0.55)', borderRadius: 5,
                  padding: '4px 10px', boxShadow: '0 0 18px rgba(255,230,136,0.22)',
                }}>
                  NON-LOCAL UPDATE
                </div>
                <div ref={legendARef} style={{ position: 'absolute', top: 10, left: 12, zIndex: 10,
                  fontFamily: 'monospace', fontSize: 12, color: '#44ddff',
                  background: 'rgba(4,10,30,0.80)', borderRadius: 6, padding: '5px 9px',
                  border: '1px solid ' + (measuredSide === 'A' ? 'rgba(68,221,255,0.8)' : 'rgba(68,221,255,0.3)') }}>
                  <div>
                    ← A  φ_A={phiA}°  z=<span ref={legendAZRef}>{(-detDists.A).toFixed(1)}</span>
                    {measuredSide === 'A'
                      ? <span style={{ marginLeft: 6, color: '#ffee44', fontSize: 10 }}>★ FIRST</span>
                      : <span style={{ marginLeft: 6, color: '#7090b8', fontSize: 10 }}>SECOND</span>}
                  </div>
                  <SpinRow up={cA.up} dn={cA.dn} />
                </div>
                <div ref={legendBRef} style={{ position: 'absolute', top: 10, left: 220, zIndex: 10,
                  fontFamily: 'monospace', fontSize: 12, color: '#ff9966',
                  background: 'rgba(4,10,30,0.80)', borderRadius: 6, padding: '5px 9px',
                  border: '1px solid ' + (measuredSide === 'B' ? 'rgba(255,153,102,0.8)' : 'rgba(255,153,102,0.3)') }}>
                  <div>
                    {measuredSide === 'B'
                      ? <span style={{ marginRight: 6, color: '#ffee44', fontSize: 10 }}>★ FIRST</span>
                      : <span style={{ marginRight: 6, color: '#7090b8', fontSize: 10 }}>SECOND</span>}
                    B  φ_B={phiB}°  z=<span ref={legendBZRef}>{detDists.B >= 0 ? '+' : ''}{detDists.B.toFixed(1)}</span>  →
                  </div>
                  <SpinRow up={cB.up} dn={cB.dn} />
                </div>
              </>
            );
          })()}

          {(activeTab === 'trajectories' || activeTab === 'collapse') && (
            <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
              <iframe
                key={activeTab}
                srcDoc={activeTab === 'trajectories' ? trajectoryHtml : collapseHtml}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={activeTab === 'trajectories' ? 'Pilot-Wave' : 'Collapse/Copenhagen'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
