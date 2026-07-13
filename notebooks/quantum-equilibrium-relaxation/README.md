# RelaxationBox2D

Canvas/WebGL2 2D Bohmian particle-in-a-box relaxation demo.

The wave is an analytic superposition of rectangular hard-wall eigenstates,

`psi(x,y,t) = sum c_k sin(nx_k*pi*x/Lx) sin(ny_k*pi*y/Ly) exp(-i E_k t / hbar)`,

and particles can follow either the Schrodinger current or the Pauli spin-current velocity

`v = (hbar / m) Im(conj(psi) grad psi) / |psi|^2`.

`v_pauli = v + (hbar s / m rho) (d_y rho, -d_x rho)`.

The wave, particle glow, particle stamping, trail fade, trail render, and transform-feedback particle update passes are in `shaders/` and mirror the shader formulas used by the `BohmianTunneling` project.

Particle positions live in ping-pong GPU buffers after reset. Changing the particle count or initial distribution reseeds on the CPU once; real-time stepping then stays on the GPU. The trajectory update uses RK4 with an `ODE substeps` control; million-particle settings are possible, but large dots and trails can become fill-rate limited because every particle is still drawn and stamped each frame.

The particle update shader caps the guiding velocity when `max speed` is above zero. This keeps near-node velocities from producing very large jumps; set it to `0` in the full applet to disable the cap.

## Wave Presets

- `1`: ground state `(1,1)`
- `2`: two-state shear `(1,1) + (3,2)`
- `3`: three-state fold `(1,2) + (2,1) + (3,3)`

## Controls

- `state` switches between the ground state and superposition presets.
- `max speed` caps the particle guiding velocity; `0` disables the cap.
- `guiding law` switches between Schrodinger and Pauli particle velocities.
- `spin strength` controls the Pauli spin-current term.
- `init particles` chooses Born-rule, uniform, or centered square seeding.
- `square size` controls the initial square side length when square seeding is selected.
- `draw trails` shows the particle history over the phase-colored density.
- `Reset` restarts time, particles, and trails.
- `Pause` stops time stepping.
- `R` resets the run; `Space` toggles pause.

Serve the folder with a local static server and open `index.html`.
