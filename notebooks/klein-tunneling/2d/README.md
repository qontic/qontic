# KleinTunneling2D

WebGL2-rendered relativistic Dirac packet demo for Klein tunneling against a
vertical scalar potential barrier.

The simulation evolves a two-component spinor in two space dimensions:

```text
i hbar d_t psi =
[-i hbar c (sigma_x d_x + sigma_y d_y) + m c^2 sigma_z + V(x)] psi.
```

It uses a split-step method:

- exact scalar-potential phase in position space,
- exact free Dirac kinetic plus mass rotation in 2D Fourier space,
- wide smooth absorbing sponge layers to suppress periodic FFT wraparound.

The initial state is a positive-energy 2D Gaussian packet moving from the left.
Normal incidence is the cleanest Klein-tunneling comparison, and the angle
control can be used to probe oblique incidence. A high enough barrier enters
the Klein zone when `V > E + m c^2`.

Very high supercritical barriers require very short wavelengths inside the wall:

```text
q ~= sqrt((V - E)^2 - (m c^2)^2) / (hbar c).
```

The app caps the effective wall height when that wavelength would fall below
the grid resolution. Without this guard, the FFT solver aliases the
negative-energy barrier mode and can make density appear on the far side faster
than the Dirac current can carry Bohmian particles.

The yellow dots are Bohmian positions guided by the full 2D Dirac current:

```text
rho = psi^dagger psi
j = c psi^dagger (sigma_x, sigma_y) psi
rdot = j / rho
```

The `amp view` toggle changes only the background diagnostic between total
spinor density and lower-component density. The lower-component view is useful
for seeing relativistic branch mixing, but the particles still use the full
Dirac spinor guidance field.

## Controls

- `wall height` adjusts the scalar potential barrier.
- `wall width` changes the finite barrier thickness.
- `angle deg` changes the packet incidence angle.
- `amp view` switches the background between total density and lower-component density.
- `packet k`, `mass`, and `Dirac c` reset the packet because they change the
  incident spinor and energy.
- The stats panel shows `E`, `mc^2`, the Klein threshold `E + mc^2`, and the
  left/wall/right probability integrals.

Serve the folder with a local static server and open `index.html`.
