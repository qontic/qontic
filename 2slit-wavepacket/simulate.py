"""
Python port of matlab2D_double_slit.m
Runs the split-operator simulation and saves key diagnostics to JSON
so we can compare with the JS/WebGL version.
"""
import numpy as np
import json, os

# ── Physical constants ────────────────────────────────────────
hb  = 1.054571817e-34
m   = 9.10938356e-31
q   = 1.602176634e-19

# ── Grid ─────────────────────────────────────────────────────
Nx, Ny   = 256, 256
Lx, Ly   = 100e-9, 100e-9
Dx, Dy   = Lx/(Nx-1), Ly/(Ny-1)

x = np.arange(Nx) * Dx   # shape (Nx,)
y = np.arange(Ny) * Dy   # shape (Ny,)

# k-grid (fftshift order for MATLAB-style fftshift(fft2))
kx = np.fft.fftshift(np.fft.fftfreq(Nx, d=Dx/(2*np.pi)))  # shape (Nx,)
ky = np.fft.fftshift(np.fft.fftfreq(Ny, d=Dy/(2*np.pi)))  # shape (Ny,)
KX, KY = np.meshgrid(kx, ky, indexing='ij')  # shape (Nx, Ny)

# ── Time ─────────────────────────────────────────────────────
Dt = 0.05e-15
Nt = 11500

# ── Barrier potential (MATLAB exact) ─────────────────────────
V = np.zeros((Nx, Ny))
cte = 10 * q

i_bar  = Nx // 2          # floor(3*Nx/6) = floor(Nx/2)
win    = 10
jini1  = Ny//2 - 20       # lower slit centre
jini2  = Ny//2 + 20       # upper slit centre

# Barrier: all y except the two slit windows
slit_open = np.zeros(Ny, dtype=bool)
slit_open[jini1-win : jini1+win] = True
slit_open[jini2-win : jini2+win] = True
barrier_y = ~slit_open

V[i_bar : i_bar+6, barrier_y] = cte

print(f"Barrier x-cols: {i_bar}..{i_bar+5}  ({i_bar*Dx*1e9:.1f}–{(i_bar+5)*Dx*1e9:.1f} nm)")
print(f"Slit 1 centre pixel: {jini1}  y={jini1*Dy*1e9:.1f} nm   half-width={win} px = {win*Dy*1e9:.1f} nm")
print(f"Slit 2 centre pixel: {jini2}  y={jini2*Dy*1e9:.1f} nm   half-width={win} px = {win*Dy*1e9:.1f} nm")

# ── Initial wave packet ───────────────────────────────────────
velox  = 1.0e5
sigmax = 6.0e-9
xc     = 20.0e-9

veloy  = 0.0
sigmay = 10.0e-9
yc     = Ly / 2

psix = (1/np.sqrt(2)) * (1/(2*np.pi*sigmax**2))**0.25 * \
       np.exp(-(x - xc)**2 / (4*sigmax**2)) * \
       np.exp(1j * m * velox * (x - xc) / hb)          # (Nx,)

psiy = (1/np.sqrt(2)) * (1/(2*np.pi*sigmay**2))**0.25 * \
       np.exp(-(y - yc)**2 / (4*sigmay**2)) * \
       np.exp(1j * m * veloy * (y - yc) / hb)          # (Ny,)

psi = psix[:, np.newaxis] * psiy[np.newaxis, :]        # (Nx, Ny)

# Normalise with trapz (matches MATLAB)
norm = np.sqrt(np.trapz(np.trapz(np.abs(psi)**2, x, axis=0), y))
psi /= norm
print(f"Initial norm: {np.trapz(np.trapz(np.abs(psi)**2, x, axis=0), y):.8f}")

# ── Propagators ───────────────────────────────────────────────
Tprop = np.exp(-1j * (hb*(KX**2 + KY**2)/(2*m)) * Dt)  # k-space, fftshift order
Vprop = np.exp(-1j * V * Dt / (2*hb))                   # real-space

# ── Time loop ─────────────────────────────────────────────────
numgrafic = 15
stepgrafic = Nt // numgrafic

P_list   = []   # norm at each snapshot
t_list   = []   # time at each snapshot

# Snapshot rho arrays for later comparison
snapshots = []  # list of {'t_fs': ..., 'P': ..., 'rho_right_half': ...}

def take_snapshot(it, psi):
    rho = np.abs(psi)**2
    P   = float(np.trapz(np.trapz(rho, x, axis=0), y))
    t_fs = it * Dt / 1e-15
    # Right-half integrated density (after barrier) as a 1D y-profile
    i_right = i_bar + 6
    rho_right = rho[i_right:, :].sum(axis=0) * Dx  # (Ny,)  integrated over x
    return {'t_fs': t_fs, 'P': P,
            'rho_right': rho_right.tolist(),
            'rho_left':  rho[:i_bar, :].sum(axis=0).tolist()}

# Snapshot at t=0
snapshots.append(take_snapshot(0, psi))

print(f"\nRunning {Nt} steps ({Nt*Dt/1e-15:.1f} fs) …")
for it in range(1, Nt+1):
    psi = Vprop * psi
    psi_k = np.fft.fftshift(np.fft.fft2(psi))
    psi_k = Tprop * psi_k
    psi   = np.fft.ifft2(np.fft.ifftshift(psi_k))
    psi   = Vprop * psi

    if it % stepgrafic == 0:
        snap = take_snapshot(it, psi)
        snapshots.append(snap)
        print(f"  t={snap['t_fs']:7.1f} fs   P={snap['P']:.6f}")

# Final norm
rho_final = np.abs(psi)**2
P_final = float(np.trapz(np.trapz(rho_final, x, axis=0), y))
print(f"\nFinal norm at t={Nt*Dt/1e-15:.1f} fs:  P = {P_final:.6f}")

# ── Save results ─────────────────────────────────────────────
results = {
    'params': {
        'Nx': Nx, 'Ny': Ny, 'Lx_nm': Lx*1e9, 'Ly_nm': Ly*1e9,
        'Dt_fs': Dt/1e-15, 'Nt': Nt, 'total_time_fs': Nt*Dt/1e-15,
        'sigmax_nm': sigmax*1e9, 'sigmay_nm': sigmay*1e9,
        'velox': velox, 'xc_nm': xc*1e9,
        'slit_x_frac': i_bar/(Nx-1),
        'slit1_y_frac': jini1/(Ny-1),
        'slit2_y_frac': jini2/(Ny-1),
        'slit_halfwidth_frac': win/(Ny-1),
        'barrier_thick_px': 6,
    },
    'snapshots': snapshots,
    'final_P': P_final,
    'rho_final_right': rho_final[i_bar+6:, :].sum(axis=0).tolist(),
}

out = '/home/pyepes/qontic/2slit-wavepacket/matlab_reference.json'
with open(out, 'w') as f:
    json.dump(results, f)
print(f"\nSaved reference data → {out}")
