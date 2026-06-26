# Classical Limit

WebGPU pilot-wave applet for exploring how a free Gaussian packet in a reflecting box approaches a more classical-looking regime.

The wave uses finite-difference Schrodinger evolution in WebGPU compute passes. The displayed density/phase and the Bohmian particle guidance both read from that evolved wave state, so the particles are guided by the simulated wave rather than by a separate analytic approximation.

The app exposes fixed presets through four version buttons instead of a group of free physics sliders.
The presets keep the on-screen drift speed close to each other, while changing the effective quantum scale:

- `Quantum packet`: `hbar = 24`, `hbar / mass = 96`, `sigma = 72 grid cells`, `dt = 0.002`, `steps/frame = 120`, `sim scale = 1`.
- `Semi-Quantum`: `hbar = 0.18`, `hbar / mass = 12`, `sigma = 96 grid cells`, `dt = 0.018`, `steps/frame = 25`, `sim scale = 3`.
- `Semi-Classical`: `hbar = 0.018`, `hbar / mass = 2.2`, `sigma = 44 grid cells`, `dt = 0.05`, `steps/frame = 25`, `sim scale = 4`, smooth purple density render.
- `Classical`: no wave visualization or wave guidance; a single particle follows straight hard-wall bounces with a trail.

The initial velocity angle is `45deg`.
The `velocity angle` slider rotates the initial plane-wave momentum from `-90deg` to `90deg`.
The `particle seed` field controls the deterministic random initialization of particle positions and can also be set with `?seed=123`.
The visual controls can toggle phase, particles, and trails, and adjust particle count, particle appearance, and trail appearance without changing the fixed physics presets.
The recording button captures the WebGPU canvas only at 60 fps, excluding UI overlays and the credit badge, and downloads an MP4/WebM file depending on browser support.
Mouse-wheel scrolling over the canvas zooms the view; double-clicking the canvas resets the view.

The guidance law is purely Schrodinger/Bohmian, with no Pauli spin-current term.

At the quantum end, the larger `hbar / mass` gives stronger wave spreading and more curved particle trails.
At the classical end, the smaller `hbar / mass` reduces spreading while keeping the phase wavelength above the grid's aliasing limit.
The semi-quantum preset uses a larger `dt`, but fewer steps per frame, so the packet moves across the screen at roughly the same rate as the quantum preset.
The semi-classical preset uses a larger internal grid, lower spreading, a smooth phase-free purple density render, and stronger density masking to prioritize a compact ball-like packet and sharper reflected particle trajectories.
The wave reset initializes the leapfrog state with a finite-difference phase backstep to avoid seeding a counter-propagating numerical branch.
The semi-classical preset also applies a smooth render-only density mask below `rho = 0.003..0.02`, hiding residual low-density artifacts without changing the simulated wave or particle guidance.
