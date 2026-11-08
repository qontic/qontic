# Double-slit cleanup decision — 8 November 2026

The project owner approved archiving the older standalone numerical app and
keeping both notebooks. The analytical and numerical notebooks have distinct
roles; neither replaces the other.

- `notebooks/double-slit/`: **Double Slit: Three Accounts — Analytical Notebook**.
  Simplified forward-propagation model, without wall reflections.
- `notebooks/double-slit-webgl/`: **Double Slit: Wave Dynamics — Numerical Notebook**.
  Its own grid simulation, slit barrier, reflected waves and pilot-wave trajectories.
- `apps/pilot-wave/double-slit-numerical/`: compatibility landing page, outside the
  catalog, linking to the preserved app in `archive/double-slit-numerical/`.
- Double Slit 2.0, its classic copy and the numerical notebook's original applet
  comparison files are retained unchanged.

Dependency inspection confirms the numerical notebook imports its own main.js,
shaders and common notebook controls, not the archived app. Archived assets and
simulation sources are byte-identical; only the archive entry HTML has labels
and shared-path adjustments. Both catalogs build and retain both notebooks.
Browser checks verify the listings and compatibility links; numerical playback
could not be rechecked because the test browser reports WebGL2 unavailable.

Next cleanup candidate: review Classical Limit while keeping the original
WebGPU implementation as a reference. Remaining catalog work includes Hydrogen
Atom, Stern–Gerlach Close-Up and intended Dirac Momentum visibility.
