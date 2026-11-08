# Double Slit — Numerical Simulation

The canonical numerical app now uses the extended WebGL2 implementation formerly
called Double Slit 2.0, including up/down, right/left and radial starting-position
colors. It retains the existing stable resource ID and URL, so there is one
numerical app in the catalog. The numerical notebook retains its original
focused applets and unchanged text. The standalone app has its own full controls.

Simulation shaders, color grouping, histogram, which-slit model and recording
code are copied unchanged. Only the two shared UI import URLs are redirected
to app-local snapshots, and the page/shell labels are standardized.
