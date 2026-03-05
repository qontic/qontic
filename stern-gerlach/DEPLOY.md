# stern-gerlach — Deployment Notes

## Live URL
`http://bonner-gpu.rice.edu/bonner-gpu/bm/stern-gerlach/`

## Server path
`bonner-gpu.rice.edu:/var/www/html/bonner-gpu/bm/stern-gerlach/`

---

## Project structure

```
stern-gerlach/
├── sg_3d.jsx          ← single source file (React + Three.js). Self-mounting:
│                         has createRoot(...).render(<App />) at the bottom.
│                         NO export default — it IS the app entry point.
├── theme.css          ← global CSS variables / shared styles (referenced in index.html)
├── index.html         ← Vite entry HTML. Points to sg_3d.jsx directly via
│                         <script type="module" src="/sg_3d.jsx">
├── vite.config.js     ← base: "./"  ← required for sub-path deployment
├── package.json       ← react@18, react-dom@18, three, vite, @vitejs/plugin-react
├── src/
│   └── main.jsx       ← only does  import "../sg_3d.jsx"  (sg_3d self-mounts)
└── dist/              ← production build output (gitignored)
    ├── index.html
    └── assets/
        ├── index-<hash>.js
        └── index-<hash>.css
```

## Dependency notes
- Only `react`, `react-dom`, and `three` are runtime deps.
- `three` (~665 kB minified) causes a chunk-size warning — expected, ignore it.
- `sg_3d.jsx` imports `react-dom/client` directly (it owns the root mount).

---

## How to deploy

### One-time setup
```bash
cd stern-gerlach && npm install
```

### Quick deploy (VS Code task)
`Ctrl+Shift+B` → **Deploy all: commit, push & deploy stern-gerlach**

This runs in sequence:
1. `git add -A && git commit && git push`
2. `cd stern-gerlach && npm run build`
3. `rsync -az stern-gerlach/dist/ bonner-gpu.rice.edu:/var/www/html/bonner-gpu/bm/stern-gerlach/`

### Manual deploy (no commit)
```bash
cd /home/pyepes/qontic
cd stern-gerlach && npm run build && cd ..
rsync -az --info=progress2 stern-gerlach/dist/ \
  bonner-gpu.rice.edu:/var/www/html/bonner-gpu/bm/stern-gerlach/
```

---

## What was learned (Mar 5 2026)

| Issue | Fix |
|---|---|
| `sg_3d.jsx` is self-mounting (no `export default`) | `src/main.jsx` must only do `import "../sg_3d.jsx"` — never wrap it in `<App />` |
| Vite deployed under sub-path | `vite.config.js` must have `base: "./"` for relative asset URLs |
| `theme.css` is wired in `index.html`, not in `sg_3d.jsx` | Keep the `<link rel="stylesheet" href="./theme.css">` in `index.html`; Vite copies it to `dist/` |
| Build outputs deterministic hashes | If hashes match server → content is identical, no re-upload needed |
| No `--delete` on rsync | Safe — avoids removing files placed on server manually |

---

## Comparing local vs deployed

Run this from the monorepo root to check if a rebuild is needed:
```bash
# Build locally
cd stern-gerlach && npm run build && cd ..

# Compare JS hash in dist/ vs server
diff \
  <(ls stern-gerlach/dist/assets/*.js | xargs basename) \
  <(ssh bonner-gpu.rice.edu "ls /var/www/html/bonner-gpu/bm/stern-gerlach/assets/*.js | xargs -I{} basename {}")
# Empty output = same content, no deploy needed
```
