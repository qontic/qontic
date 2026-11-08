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

## Standalone WebGL2 app retained

The owner clarified that the numerical notebook and a standalone WebGL2 app
must both remain discoverable. `apps/pilot-wave/double-slit-webgl/` is now a
published app entry opening the notebook's existing full-applet.html directly
with standalone controls. No simulation source or shader is changed. This is
the numerical app whose playback could not be rechecked in the WebGL2-lacking
test browser; it is distinct from the older archived standalone implementation.

## Single numerical app and teaching order

The owner requested one numerical app and clearer listing titles. The numerical
app used by the numerical notebook remains the single cataloged numerical
simulation. Double Slit 2.0 is retained only as an unlisted development reference;
its source and direct URL, and its classic comparison copy, remain available.
It is an extended fork of the notebook app (histogram, illustrative which-slit
mode, recording tools and numerical-boundary differences), not a separate
teaching topic. Those extensions are not promoted in this consolidation.

Listing titles are now Analytical Simulation, Analytical Notebook, Numerical
Simulation and Numerical Notebook, all prefixed by Double Slit. The Double Slit
module follows that numbered order. The weak-velocity draft remains optional
advanced material on dev. Notebook text, simulation source and all resource IDs
are unchanged. Next cleanup candidate remains Classical Limit.
