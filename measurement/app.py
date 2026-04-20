"""
Bohmian Measurement — Analytic Gaussian Model
Everything is analytic (no PDE solving).
All frames rendered once into a GIF; browser plays it — zero Python per frame.
"""

import io
import numpy as np
import streamlit as st
import matplotlib.pyplot as plt
from PIL import Image

# ── Grids (fixed) ─────────────────────────────────────────────────────────────
NX, NXI = 200, 200
x   = np.linspace(-12, 12, NX)
xi  = np.linspace(-10, 10, NXI)
dxi = xi[1] - xi[0]

# ── Exact barrier transmission ────────────────────────────────────────────────
def exact_T(k0, V0, a=0.5):
    if V0 <= 0: return 1.0
    E = 0.5 * k0**2
    if E <= 0: return 0.0
    dV = V0 - E
    if abs(dV) < 1e-9:
        return 1.0 / (1.0 + 0.5 * V0**2 * a**2)
    if dV > 0:
        kv = np.sqrt(2 * dV)
        return 1.0 / (1.0 + V0**2 * np.sinh(kv * a)**2 / (4 * E * dV))
    kv = np.sqrt(-2 * dV)
    return 1.0 / (1.0 + V0**2 * np.sin(kv * a)**2 / (4 * E * (-dV)))

# ── GIF builder — runs once, cached ──────────────────────────────────────────
@st.cache_data(show_spinner="Rendering animation…")
def build_gif(k0, V0, lam, sigma, outcome, N=80, fps=18):
    T  = float(np.clip(exact_T(k0, V0), 0.0, 1.0))
    R  = 1.0 - T
    v0 = float(k0)
    x0 = -8.0
    t_s  = abs(x0) / v0
    s_xi = 1.5
    times = np.linspace(0, t_s + 7.0, N)

    def gauss2d(x_mu, xi_mu, sx):
        gx  = np.exp(-0.5 * ((x  - x_mu) / sx  )**2)
        gxi = np.exp(-0.5 * ((xi - xi_mu) / s_xi)**2)
        return np.outer(gx, gxi)

    # pre-compute global vmax for a stable colormap
    vmax = 0.0
    frames_data = []
    for t in times:
        blend = float(0.5 * (1 + np.tanh(6 * (t - t_s))))
        dt_a  = max(0.0, t - t_s)
        x_in  = x0 + v0 * t
        x_T   =  v0 * dt_a
        x_R   = -v0 * dt_a
        xi_p  = lam * dt_a * 0.5

        rho2d = ((1 - blend) * gauss2d(x_in, 0.0,  sigma)
                 + blend * (T * gauss2d(x_T, +xi_p, sigma)
                           + R * gauss2d(x_R, -xi_p, sigma)))

        # Bohmian dot
        if t <= t_s:
            BX, BXi = x_in, 0.0
        else:
            f   = min(blend * 2, 1.0)
            BX  = (1-f)*x_in + f*(x_T  if outcome=="transmit" else x_R)
            BXi = f * (xi_p if outcome=="transmit" else -xi_p)

        vmax = max(vmax, float(rho2d.max()))
        frames_data.append((t, rho2d.astype(np.float32), BX, BXi))

    # render each frame to PNG → collect PIL images
    pil_frames = []
    traj_x, traj_xi = [], []

    for t, rho2d, BX, BXi in frames_data:
        traj_x.append(BX); traj_xi.append(BXi)

        # 1D curves
        rho_x = (rho2d.sum(axis=1) * dxi)              # orthodox (both)
        ixi   = int(np.clip((BXi - xi[0]) / dxi, 0, NXI-1))
        rho_c = rho2d[:, ixi].copy()                   # conditional (one)
        # normalise to same peak for visual comparison
        rho_x /= (rho_x.max() + 1e-30)
        rho_c /= (rho_c.max() + 1e-30)

        fig, (ax_top, ax_bot) = plt.subplots(
            2, 1, figsize=(7, 6),
            gridspec_kw={"height_ratios": [2, 1], "hspace": 0.55},
            facecolor="#111"
        )
        for ax in (ax_top, ax_bot):
            ax.set_facecolor("#111")
            ax.tick_params(colors="0.65", labelsize=8)
            for sp in ax.spines.values(): sp.set_edgecolor("0.25")
            ax.xaxis.label.set_color("0.85")
            ax.yaxis.label.set_color("0.85")

        # ── 2D heatmap ──
        ax_top.imshow(rho2d.T, origin="lower",
                      extent=[x[0],x[-1],xi[0],xi[-1]],
                      aspect="auto", cmap="inferno",
                      vmin=0, vmax=vmax*0.5, interpolation="bilinear")
        ax_top.axvspan(-0.5, 0.5, color="cyan", alpha=0.07)
        ax_top.axvline(0, color="white", lw=0.5, alpha=0.2, ls="--")
        ax_top.axhline(0, color="white", lw=0.5, alpha=0.2, ls="--")
        tail = 50
        ax_top.plot(traj_x[-tail:], traj_xi[-tail:], color="white", lw=1.0, alpha=0.5)
        ax_top.plot(BX, BXi, "o", color="white", ms=8, zorder=10)

        # label the two lobes
        ax_top.text(0.97, 0.97,
                    f"transmitted\nT = {T:.2f}\n(x>0, ξ>0)",
                    color="#60c8ff", fontsize=7.5, ha="right", va="top",
                    transform=ax_top.transAxes)
        ax_top.text(0.03, 0.03,
                    f"reflected\nR = {R:.2f}\n(x<0, ξ<0)",
                    color="#ffb347", fontsize=7.5, ha="left", va="bottom",
                    transform=ax_top.transAxes)

        dot_label = "→ transmitted" if outcome=="transmit" else "← reflected"
        ax_top.set_title(f"|Φ(x,ξ)|²   t = {t:.1f}   •   particle: {dot_label}",
                         fontsize=9, color="white")
        ax_top.set_xlabel("electron position  x", color="0.85")
        ax_top.set_ylabel("pointer position  ξ", color="0.85")

        # ── 1D panel ──
        ax_bot.fill_between(x, 0, rho_x, color="#4dabf7", alpha=0.45,
                             label="orthodox: both branches  ∫|Φ|²dξ")
        ax_bot.fill_between(x, 0, rho_c,  color="#ff922b", alpha=0.75,
                             label="Bohmian: one branch  |Φ(x,ξ(t))|²")
        ax_bot.axvline(BX, color="white", lw=1.0, ls="--", alpha=0.55)
        ax_bot.set_xlim(x[0], x[-1]); ax_bot.set_ylim(bottom=0)
        ax_bot.set_xlabel("x", color="0.85")
        ax_bot.set_title("1D view", fontsize=9, color="white")
        ax_bot.legend(fontsize=7, loc="upper right",
                      facecolor="#1a1a1a", edgecolor="0.3", labelcolor="0.85")

        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=88, bbox_inches="tight", facecolor="#111")
        plt.close(fig)
        buf.seek(0)
        pil_frames.append(Image.open(buf).convert("RGB"))

    gif_buf = io.BytesIO()
    pil_frames[0].save(gif_buf, format="GIF", save_all=True,
                       append_images=pil_frames[1:],
                       duration=int(1000/fps), loop=0)
    return gif_buf.getvalue(), T, R


# ── UI ────────────────────────────────────────────────────────────────────────
st.set_page_config(layout="centered", page_title="Bohmian Measurement")
st.title("Bohmian Measurement")

with st.sidebar:
    st.header("Parameters")
    k0      = st.slider("Electron momentum  k₀",  1.0, 8.0,  4.0, 0.5)
    V0      = st.slider("Barrier height  V₀",      0.0, 20.0, 8.0, 0.5)
    lam     = st.slider("Coupling  λ",             0.0, 3.0,  1.5, 0.1,
                        help="λ=0: no pointer → no branching in ξ")
    sigma   = st.slider("Wavepacket width  σ",     0.5, 2.5,  1.0, 0.1)
    outcome = st.radio("Bohmian particle ends up…",
                       ["transmit", "reflect"],
                       format_func=lambda s: "→ transmitted" if s=="transmit" else "← reflected")
    st.markdown("---")
    st.markdown(
        "**Reading the animation**\n\n"
        "After hitting the barrier the wave function **always splits into two lobes** "
        "(upper-right & lower-left).  "
        "The **white dot** is the Bohmian particle — one lobe only, chosen above.\n\n"
        "Bottom: blue = orthodox 1D (both packets always visible).  "
        "Orange = what the Bohmian particle actually experiences (one packet)."
    )

gif_bytes, T, R = build_gif(k0, V0, lam, sigma, outcome)
st.image(gif_bytes)
st.caption(f"T = {T:.2f}   R = {R:.2f}   |   k₀={k0}  V₀={V0}  λ={lam}  σ={sigma}")
