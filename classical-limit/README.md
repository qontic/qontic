# Classical Limit

WebGPU pilot-wave applet for exploring how a free Gaussian packet in a reflecting box approaches a more classical-looking regime.

The wave uses finite-difference Schrodinger evolution in WebGPU compute passes. The displayed density/phase and the Bohmian particle guidance both read from that evolved wave state, so the particles are guided by the simulated wave rather than by a separate analytic approximation.

The app now exposes two fixed presets through a single switch button instead of a group of free sliders.
Both presets keep the packet width and on-screen drift speed close to each other, while changing the effective quantum scale:

- `Quantum packet`: `hbar = 6`, `hbar / mass = 6`, `sigma = 24px`, `dt = 0.04`, `steps/frame = 15`.
- `Classical packet`: `hbar = 0.06`, `hbar / mass = 1.5`, `sigma = 24px`, `dt = 0.15`, `steps/frame = 4`.

The `velocity angle` slider rotates the initial plane-wave momentum from `-90deg` to `90deg`.
The visual controls can toggle phase, particles, and trails, and adjust particle count, particle appearance, and trail appearance without changing the fixed physics presets.
Mouse-wheel scrolling over the canvas zooms the view; double-clicking the canvas resets the view.

The guidance law is purely Schrodinger/Bohmian, with no Pauli spin-current term.

At the quantum end, the larger `hbar / mass` gives stronger wave spreading and more curved particle trails.
At the classical end, the smaller `hbar / mass` reduces spreading while keeping the phase wavelength above the grid's aliasing limit.
The classical preset uses a larger `dt`, but fewer steps per frame, so the packet moves across the screen at roughly the same rate as the quantum preset.
The wave reset initializes the leapfrog state with a finite-difference phase backstep to avoid seeding a counter-propagating numerical branch.
The classical preset also applies a smooth render-only density mask below `rho = 0.0002..0.002`, hiding residual low-density artifacts without changing the simulated wave or particle guidance.
