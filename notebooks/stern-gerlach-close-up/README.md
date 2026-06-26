# Stern-Gerlach Close Up

An educational Q-Ontic notebook and WebGPU Bohmian simulation of a Gaussian
Pauli spinor passing through a Stern-Gerlach magnetic-field gradient.

- `index.html` contains the notebook with three focused close-up demos and one
  simplified pilot-wave Stern-Gerlach applet.
- `full-applet.html` contains the original-scale applet and complete controls.
- `multiview-applet/` contains the copied comparison applet. Its embedded mode
  is restricted to the pilot-wave view, while its full page retains all views.

The wave field is now an up-polarized two-component Pauli spinor advanced on a 3D grid stored in WebGPU storage buffers and updated with compute shaders. The tunnel is 1.5x taller in z than its x/y dimensions. The defaults favor cleaner reflection over speed: a higher grid resolution, a longer resolved de Broglie wavelength, and fourth-order finite-difference stencils for the Pauli Laplacian and particle guidance gradients. Bohmian particles are seeded from the same Gaussian density and guided by the Pauli current:

`v = (j_conv + (s hbar / m) curl(Psi^dagger sigma Psi)) / rho`

The default initial spinor is `+z` / up, so the spin-current slider value `0.5` matches the usual `hbar / 2m` Pauli spin current. The `SG z-gradient` toggle enables the Stern-Gerlach field used by the spin Zeeman term. The wave and particles wrap periodically across the x faces, while y/z remain hard-walled.

A translucent detector plate is placed at the right end of the shortened tunnel, one repeated cell to the right of the center cell. Particles freeze to the plate when they reach it; the detector does not modify the wave evolution.

## Controls

- `grid x/y` changes the base simulation resolution; the z dimension is 1.5x larger.
- Drag the canvas to orbit around the box center; wheel zooms.
- `particle count` is capped lower than the 2D version for 3D performance.
- `density cloud` draws the 3D wave density as a projected point cloud.
- `SG z-gradient` and `SG strength` control the Stern-Gerlach-style vertical gradient.
- `Reset` restarts the wave, particles, and trails.
- `Pause` stops time stepping.
- `R` resets the simulation.

## License and Credit

This project is released under the MIT License. Copyright (c) 2026 anssiZander. See `LICENSE` for the full license text.
