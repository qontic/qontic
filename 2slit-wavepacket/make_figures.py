"""
Double-slit quantum simulation – figure generator.
Produces PNG images without matplotlib (uses PIL + numpy only).

Output files (in figures/ folder):
  snapshot_001.png … snapshot_NNN.png   – 2D |ψ|² at various times
  summary_grid.png                       – all snapshots in one grid
  interference_profile.png               – final y-profile right of barrier
  norm_vs_time.png                       – ‖ψ‖² vs t trace
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os, struct, time

OUT = os.path.join(os.path.dirname(__file__), 'figures')
os.makedirs(OUT, exist_ok=True)

# ─────────────────────────────────────────────────────────────
# Colormap helpers
# ─────────────────────────────────────────────────────────────

def plasma_colormap(t):
    """Plasma colormap matching the JS simulation LUT  t ∈ [0,1] → (R,G,B) uint8.
    Same control stops as PLASMA_STOPS in main.js."""
    t = np.clip(t, 0.0, 1.0)
    STOPS = np.array([
        [0.15,  0.05,  0.60],
        [0.28,  0.02,  0.70],
        [0.47,  0.01,  0.72],
        [0.63,  0.10,  0.65],
        [0.78,  0.16,  0.54],
        [0.90,  0.24,  0.42],
        [0.97,  0.36,  0.30],
        [0.99,  0.50,  0.17],
        [0.99,  0.65,  0.05],
        [0.95,  0.81,  0.04],
        [0.95,  0.99,  0.15],
    ], dtype=np.float32)
    n   = len(STOPS) - 1
    s   = t * n
    lo  = np.clip(np.floor(s).astype(int), 0, n - 1)
    f   = (s - lo)[..., np.newaxis]
    col = STOPS[lo] + f * (STOPS[lo + 1] - STOPS[lo])
    col = np.clip(col, 0.0, 1.0)
    return (col[..., 0] * 255).astype(np.uint8), \
           (col[..., 1] * 255).astype(np.uint8), \
           (col[..., 2] * 255).astype(np.uint8)


def hot_colormap(t):
    """Vectorised hot colormap  t ∈ [0,1]  →  (R,G,B) uint8."""
    t = np.clip(t, 0.0, 1.0)
    r = np.clip(t * 3.0,       0, 1)
    g = np.clip(t * 3.0 - 1.0, 0, 1)
    b = np.clip(t * 3.0 - 2.0, 0, 1)
    return (r * 255).astype(np.uint8), \
           (g * 255).astype(np.uint8), \
           (b * 255).astype(np.uint8)


def rho_to_image(rho, size=None, vmax=None, gamma=0.35):
    """Convert a 2D |ψ|² array to a PIL Image using the plasma colormap.

    gamma=0.35 matches the JS 2D flat view (Math.pow(t, 0.35)).
    rho shape: (Nx, Ny)  → image displayed with x→right, y→up.
    """
    arr = rho.T                          # (Ny, Nx)  → rows=y, cols=x
    arr = arr[::-1, :]                   # flip y so y=0 is at bottom
    if vmax is None:
        vmax = arr.max() or 1.0
    t = np.clip(arr / vmax, 0.0, 1.0) ** gamma
    R, G, B = plasma_colormap(t)
    rgb = np.stack([R, G, B], axis=-1)  # (Ny, Nx, 3)
    img = Image.fromarray(rgb, mode='RGB')
    if size:
        img = img.resize(size, Image.NEAREST)
    return img


def add_label(img, text, pos=(8, 6), color=(255, 255, 200)):
    """Overlay a text label on a PIL image (in-place on a copy)."""
    out = img.copy()
    draw = ImageDraw.Draw(out)
    # Draw a dark shadow first for readability
    draw.text((pos[0]+1, pos[1]+1), text, fill=(0, 0, 0))
    draw.text(pos, text, fill=color)
    return out


def draw_barrier_line(img, x_frac, color=(255, 100, 100)):
    """Draw a vertical line at x_frac to indicate the barrier position."""
    out = img.copy()
    draw = ImageDraw.Draw(out)
    x = int(x_frac * img.width)
    draw.line([(x, 0), (x, img.height)], fill=color, width=1)
    return out


# ─────────────────────────────────────────────────────────────
# Simple line-plot → PIL
# ─────────────────────────────────────────────────────────────

def line_plot(xs, ys, labels=None, title='', xlabel='', ylabel='',
              width=640, height=300, colors=None,
              markers=None, bg=(20, 20, 30)):
    """
    Minimal line-plot renderer using PIL.
    xs, ys: lists of 1D arrays (one per trace)
    Returns a PIL Image.
    """
    if not isinstance(xs[0], (list, np.ndarray)):
        xs, ys = [xs], [ys]
    DEFAULT_COLORS = [(100, 220, 100), (100, 180, 255),
                      (255, 180, 80),  (255, 100, 100)]
    if colors is None:
        colors = DEFAULT_COLORS[:len(xs)]

    PAD = {'left': 55, 'right': 20, 'top': 30, 'bottom': 40}
    W = width - PAD['left'] - PAD['right']
    H = height - PAD['top'] - PAD['bottom']

    all_x = np.concatenate([np.asarray(x) for x in xs])
    all_y = np.concatenate([np.asarray(y) for y in ys])
    x0, x1 = all_x.min(), all_x.max()
    y0, y1 = all_y.min(), all_y.max()
    if x1 == x0: x1 = x0 + 1
    if y1 == y0: y1 = y0 + 1
    # add 5% margin on y
    dy = (y1 - y0) * 0.05
    y0 -= dy; y1 += dy

    img = Image.new('RGB', (width, height), color=bg)
    draw = ImageDraw.Draw(img)

    def px(x, y):
        cx = PAD['left'] + int((x - x0) / (x1 - x0) * W)
        cy = PAD['top'] + H - int((y - y0) / (y1 - y0) * H)
        return cx, cy

    # Grid lines
    for k in range(5):
        yv = y0 + k * (y1 - y0) / 4
        y_px = px(x0, yv)[1]
        draw.line([(PAD['left'], y_px), (PAD['left'] + W, y_px)],
                  fill=(50, 50, 60), width=1)
        draw.text((2, y_px - 6), f'{yv:.3f}', fill=(180, 180, 180))

    # Traces
    for xi, yi, col in zip(xs, ys, colors):
        xi, yi = np.asarray(xi), np.asarray(yi)
        pts = [px(xi[j], yi[j]) for j in range(len(xi))]
        for j in range(len(pts) - 1):
            draw.line([pts[j], pts[j + 1]], fill=col, width=2)
        for pt in pts:
            draw.ellipse([pt[0]-3, pt[1]-3, pt[0]+3, pt[1]+3], fill=col)

    # Axes
    draw.line([(PAD['left'], PAD['top']),
               (PAD['left'], PAD['top'] + H)], fill=(200, 200, 200), width=2)
    draw.line([(PAD['left'], PAD['top'] + H),
               (PAD['left'] + W, PAD['top'] + H)], fill=(200, 200, 200), width=2)

    # X tick labels
    for k in range(5):
        xv = x0 + k * (x1 - x0) / 4
        cx = px(xv, y0)[0]
        draw.line([(cx, PAD['top'] + H), (cx, PAD['top'] + H + 4)],
                  fill=(200, 200, 200))
        draw.text((cx - 16, PAD['top'] + H + 6), f'{xv:.0f}',
                  fill=(180, 180, 180))

    # Labels
    if title:
        draw.text((PAD['left'] + W // 2 - 5 * len(title) // 2, 6),
                  title, fill=(230, 230, 230))
    if xlabel:
        draw.text((PAD['left'] + W // 2 - 5 * len(xlabel) // 2,
                   height - 14), xlabel, fill=(200, 200, 200))
    if ylabel:
        for k, ch in enumerate(ylabel):
            draw.text((4, PAD['top'] + H // 2 - 6 * len(ylabel) // 2 + k * 12),
                      ch, fill=(200, 200, 200))

    # Legend
    if labels:
        for k, (lbl, col) in enumerate(zip(labels, colors)):
            lx = PAD['left'] + W - 120
            ly = PAD['top'] + 10 + k * 18
            draw.line([(lx, ly + 6), (lx + 20, ly + 6)], fill=col, width=2)
            draw.text((lx + 24, ly), lbl, fill=col)
    return img


def bar_plot_1d(y_arr, xs=None, title='', ylabel='',
                width=640, height=300, color=(80, 200, 120),
                bg=(20, 20, 30)):
    """Simple bar/filled area plot of a 1D array."""
    n = len(y_arr)
    if xs is None:
        xs = np.arange(n)
    return line_plot([xs], [y_arr], title=title, ylabel=ylabel,
                     width=width, height=height, colors=[color], bg=bg)


# ─────────────────────────────────────────────────────────────
# Physics simulation  (exact copy of simulate.py)
# ─────────────────────────────────────────────────────────────

def run_simulation():
    hb  = 1.054571817e-34
    m   = 9.10938356e-31
    q   = 1.602176634e-19

    Nx, Ny   = 256, 256
    Lx, Ly   = 100e-9, 100e-9
    Dx, Dy   = Lx / (Nx - 1), Ly / (Ny - 1)

    x = np.arange(Nx) * Dx
    y = np.arange(Ny) * Dy

    kx = np.fft.fftshift(np.fft.fftfreq(Nx, d=Dx / (2 * np.pi)))
    ky = np.fft.fftshift(np.fft.fftfreq(Ny, d=Dy / (2 * np.pi)))
    KX, KY = np.meshgrid(kx, ky, indexing='ij')

    Dt = 0.05e-15
    Nt = 11500

    V = np.zeros((Nx, Ny))
    cte   = 10 * q
    i_bar = Nx // 2
    win   = 10
    jini1 = Ny // 2 - 20
    jini2 = Ny // 2 + 20

    slit_open = np.zeros(Ny, dtype=bool)
    slit_open[jini1 - win: jini1 + win] = True
    slit_open[jini2 - win: jini2 + win] = True
    V[i_bar: i_bar + 6, ~slit_open] = cte

    velox  = 1.0e5
    veloy  = 0.0
    sigmax = 6.0e-9
    xc     = 20.0e-9
    sigmay = 10.0e-9
    yc     = Ly / 2

    psix = (1 / np.sqrt(2)) * (1 / (2 * np.pi * sigmax ** 2)) ** 0.25 * \
           np.exp(-(x - xc) ** 2 / (4 * sigmax ** 2)) * \
           np.exp(1j * m * velox * (x - xc) / hb)
    psiy = (1 / np.sqrt(2)) * (1 / (2 * np.pi * sigmay ** 2)) ** 0.25 * \
           np.exp(-(y - yc) ** 2 / (4 * sigmay ** 2)) * \
           np.exp(1j * m * veloy * (y - yc) / hb)
    psi  = psix[:, np.newaxis] * psiy[np.newaxis, :]
    norm = np.sqrt(np.trapz(np.trapz(np.abs(psi) ** 2, x, axis=0), y))
    psi /= norm

    Tprop = np.exp(-1j * (hb * (KX ** 2 + KY ** 2) / (2 * m)) * Dt)
    Vprop = np.exp(-1j * V * Dt / (2 * hb))

    numsnaps = 16
    stepsnap = Nt // numsnaps

    print(f"Grid: {Nx}×{Ny},  steps: {Nt},  total: {Nt*Dt/1e-15:.1f} fs")
    print(f"Barrier at x={i_bar}..{i_bar+5}  slits at j={jini1}±{win}, j={jini2}±{win}")

    snaps  = []   # list of (t_fs, rho_2d)
    norm_t = []   # (t_fs, norm)

    # t=0
    rho0 = np.abs(psi) ** 2
    snaps.append((0.0, rho0.copy()))
    norm_t.append((0.0, float(np.trapz(np.trapz(rho0, x, axis=0), y))))

    t0 = time.time()
    for it in range(1, Nt + 1):
        psi = Vprop * psi
        psi_k = np.fft.fftshift(np.fft.fft2(psi))
        psi_k = Tprop * psi_k
        psi   = np.fft.ifft2(np.fft.ifftshift(psi_k))
        psi   = Vprop * psi

        if it % stepsnap == 0:
            rho = np.abs(psi) ** 2
            t_fs = it * Dt / 1e-15
            P    = float(np.trapz(np.trapz(rho, x, axis=0), y))
            snaps.append((t_fs, rho.copy()))
            norm_t.append((t_fs, P))
            elapsed = time.time() - t0
            eta = elapsed / it * (Nt - it)
            print(f"  step {it:5d}/{Nt}  t={t_fs:7.1f} fs  ‖ψ‖²={P:.6f}  "
                  f"[{elapsed:.1f}s elapsed, ~{eta:.0f}s left]")

    return snaps, norm_t, i_bar, Ny, Dx, Dy, Lx, Ly, x, y


# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  2-slit quantum simulation  –  figure generator")
    print("=" * 60)

    snaps, norm_t, i_bar, Ny, Dx, Dy, Lx, Ly, x, y = run_simulation()

    IMG_SIZE = (512, 512)    # display size for each snapshot image

    # global vmax for consistent colour scale across all frames
    vmax = max(rho.max() for _, rho in snaps)

    saved = []
    for idx, (t_fs, rho) in enumerate(snaps):
        img = rho_to_image(rho, size=IMG_SIZE, vmax=vmax, gamma=0.4)
        img = draw_barrier_line(img, x_frac=(i_bar / (rho.shape[0] - 1)),
                                color=(255, 80, 80))
        img = add_label(img, f't = {t_fs:.1f} fs', pos=(10, 8))
        fname = os.path.join(OUT, f'snapshot_{idx:03d}.png')
        img.save(fname)
        saved.append(fname)
        print(f"  Saved {fname}")

    # ── Summary grid  ───────────────────────────────────────
    COLS = 4
    ROWS = (len(snaps) + COLS - 1) // COLS
    THUMB = 256
    grid = Image.new('RGB', (COLS * THUMB, ROWS * THUMB), color=(10, 10, 15))
    for idx, (t_fs, rho) in enumerate(snaps):
        img = rho_to_image(rho, size=(THUMB, THUMB), vmax=vmax, gamma=0.4)
        img = draw_barrier_line(img, i_bar / (rho.shape[0] - 1),
                                color=(255, 80, 80))
        img = add_label(img, f'{t_fs:.0f} fs', pos=(6, 4), color=(255, 255, 180))
        col_idx = idx % COLS
        row_idx = idx // COLS
        grid.paste(img, (col_idx * THUMB, row_idx * THUMB))
    grid_path = os.path.join(OUT, 'summary_grid.png')
    grid.save(grid_path)
    print(f"\n  Summary grid → {grid_path}")

    # ── Final interference y-profile  ───────────────────────
    t_final, rho_final = snaps[-1]
    i_right = i_bar + 6              # first column after barrier
    # integrate over the right half x (after barrier)
    profile = rho_final[i_right:, :].sum(axis=0) * Dx   # (Ny,)
    y_nm = y * 1e9                                        # nm

    fig_intf = line_plot(
        [y_nm], [profile],
        title=f'Interference pattern (right of barrier)  t={t_final:.0f} fs',
        xlabel='y  (nm)', ylabel='prob',
        width=700, height=350,
        colors=[(80, 200, 255)])
    intf_path = os.path.join(OUT, 'interference_profile.png')
    fig_intf.save(intf_path)
    print(f"  Interference profile → {intf_path}")

    # ── Norm vs time  ────────────────────────────────────────
    t_arr = np.array([n[0] for n in norm_t])
    P_arr = np.array([n[1] for n in norm_t])

    fig_norm = line_plot(
        [t_arr], [P_arr],
        title='‖ψ‖² vs time',
        xlabel='t (fs)', ylabel='‖ψ‖²',
        width=700, height=300,
        colors=[(100, 230, 100)])
    norm_path = os.path.join(OUT, 'norm_vs_time.png')
    fig_norm.save(norm_path)
    print(f"  Norm vs time       → {norm_path}")

    # ── Early vs late wavefunction comparison  ───────────────
    # Show first frame left of barrier vs last frame right of barrier side by side
    _, rho_early = snaps[0]
    _, rho_late  = snaps[-1]

    comp_w, comp_h = 1024, 512
    comp = Image.new('RGB', (comp_w, comp_h), color=(10, 10, 15))
    left_img  = rho_to_image(rho_early, size=(512, 512), vmax=vmax, gamma=0.4)
    right_img = rho_to_image(rho_late,  size=(512, 512), vmax=vmax, gamma=0.4)

    left_img  = draw_barrier_line(left_img,  i_bar / (rho_early.shape[0]-1))
    right_img = draw_barrier_line(right_img, i_bar / (rho_late.shape[0]-1))
    _, t_early = snaps[0][0],  snaps[0][0]
    left_img  = add_label(left_img,  f'Initial  t={snaps[0][0]:.0f} fs')
    right_img = add_label(right_img, f'Final    t={snaps[-1][0]:.0f} fs')

    comp.paste(left_img,  (0, 0))
    comp.paste(right_img, (512, 0))
    comp_path = os.path.join(OUT, 'comparison_early_late.png')
    comp.save(comp_path)
    print(f"  Early/late compare → {comp_path}")

    print("\n" + "=" * 60)
    print(f"  All figures saved to: {OUT}/")
    print(f"  Snapshots:   {len(snaps)}")
    print(f"  Final ‖ψ‖²: {P_arr[-1]:.6f}")
    print("=" * 60)


if __name__ == '__main__':
    main()
