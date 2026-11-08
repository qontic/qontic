# Three-resource publication review

## Scope

Publish the analytical double-slit companion notebook, Weak Position Measurement,
and Atom Mach–Zehnder as separate resources. Recommend the companion notebook
first in Double Slit; cross-list Mach–Zehnder in Measurement and Delayed Choice.
Keep the existing pilot-wave double-slit notebook as further study.

Weak Position Measurement uses `weak-position-measurement-simulation` so that it
cannot be confused with the existing production barrier model. The public
`apps/comparative/measurement/` path and its identifier are retained.

## Focused corrections

- Notebook: distinguish the prepared wavefunction from the post-measurement
  state; label the rescaled wave rendering accurately; qualify the symmetric
  no-detector trajectory question. Report gamma directly as the fraction of
  interference remaining instead of treating the broad envelope as fringes.
- Pointer app: describe its adjustable weak-to-resolved regime, keeping the
  system–pointer and pointer–record stages distinct from postselection protocols.
- Interferometer: explain idealized optics, schematic path segments and the
  separate Gaussian crossing model. Qualify GRW waiting-time estimates and
  interaction-free terminology. Clarify that prediction text stays in-browser.

## Validation

- Notebook complex transverse field compared with the analytical app at nine
  wavelength/separation combinations, three propagation distances and 81
  transverse positions: maximum relative discrepancy 1.73e-14.
- Six Mach–Zehnder setups: 20,000 midpoint samples per setup reproduce the exact
  0, 1/4, 1/2 and 1 output probabilities; crossing trajectories tested for finite
  coordinates and symmetric non-crossing at four offsets.
- Analytic pointer displacement compared with independent 200,000-step
  quadrature for seven starting coordinates: maximum absolute difference 3.43e-6.
- Both catalogs build; recommended ordering, multiple-module listing, unique
  IDs and rejection of invalid module/recommendation references checked.
- Desktop browser preview: notebook batch counts and reading modes; prediction
  locking and feedback; pointer collapse and four Many-Worlds branch panels;
  module guidance and all three resource entry points.

This is a focused release review, not validation of every parameter combination.
Phone layouts and video recording were not tested in this review. Source
probabilities are those of the stated idealized models, not a reconstruction of
all experimental imperfections. New notebook template files and the optional
four-account control are included; other shared visual templates are retained.
