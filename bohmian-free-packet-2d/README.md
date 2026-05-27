# Bohmian Particle in a Box

WebGL2 Bohmian mechanics simulation of a Gaussian wave packet in a hard-wall box. The packet starts moving to the right and reflects from the box boundaries.

- `Schrodinger`: `v = j / rho`
- `Pauli spin (+z)`: `v = j / rho + (s hbar / (m rho)) * (d_y rho, -d_x rho)`
- `Pauli spin (-z)`: `v = j / rho - (s hbar / (m rho)) * (d_y rho, -d_x rho)`

The wave field is advanced with a scalar Schrodinger stepper using hard-wall edge sampling. In the Pauli modes this corresponds to a pure factorized spin state with fixed spin along `+z` or `-z`, no component mixing, and no magnetic field, so only the trajectory law changes. The `spin s` slider controls the spin strength from `0` to `2` in half-integer steps.



## Controls

- `physics mode` switches between the three trajectory laws and resets the run.
- `Reset` restarts the wave, particles, and trails.
- `Pause` stops time stepping.
- `R` resets the simulation.
