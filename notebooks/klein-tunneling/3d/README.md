# KleinTunneling3D

WebGPU 3+1D Dirac packet demo for Klein tunneling against a finite scalar
potential slab.

The simulation evolves a four-component Dirac spinor in three space dimensions:

```text
i hbar d_t psi =
[-i hbar c alpha.grad + m c^2 beta + V(x)] psi
```

The initial packet is a positive-energy Gaussian moving in the +x direction.
The `spin axis` control chooses the Pauli reference spinor used to build the
positive-energy Dirac spinor: `+Z`, `+X`, or `+Y`. The orange slab is a smooth
finite barrier. The nominal Klein zone begins when

```text
V > E + m c^2
```

where `E` is the incident packet energy.

The yellow particles are Bohmian configurations guided by the full Dirac
current:

```text
rho = psi^dagger psi
j   = c psi^dagger alpha psi
v   = j / rho
```

## Notes

- The 3D wave and Bohmian particles are advanced on the GPU.
- Very high supercritical barriers are capped to keep the negative-energy
  wavelength inside the wall resolved by the grid. The stats panel reports
  `V clipped` when this guard is active.
- Rendering, density cloud, glowing particles, trails, camera tools, and
  recording are based on `DiracPacketSplitting3D`.
- The grid is periodic like the source WebGPU project, so late-time outgoing
  waves can wrap around. Focus on early and middle-time interaction with the
  slab for the tunneling comparison.

## Running

Serve this folder with a local static server and open `index.html` in a current
Chrome or Edge desktop browser with WebGPU available.
