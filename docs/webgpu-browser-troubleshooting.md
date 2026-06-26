# WebGPU Browser Troubleshooting

Use this checklist when a WebGPU app fails on hosted URLs but works locally.

## Typical Symptoms

- Alert says: `No WebGPU adapter found`
- App works in one browser (for example Edge) but fails in another (for example Chrome)
- App works in VS Code internal browser but fails in external browser

## Quick Triage

1. Test the same URL in Edge and Chrome.
2. Test in a private/incognito window.
3. Test with a clean browser profile.
4. Confirm the app works on localhost.

If one browser works and another fails on the same machine and URL, the issue is usually browser configuration, not deployment.

## Chrome Checks

1. Open `chrome://settings/system` and enable **Use hardware acceleration when available**.
2. Open `chrome://flags` and reset unusual graphics/WebGPU flags to **Default**.
3. Open `chrome://gpu` and review **Graphics Feature Status** for disabled items.
4. Open `chrome://policy` and verify no enterprise policy is disabling GPU/WebGPU.
5. Temporarily disable extensions and retest.

## Clean Profile Test (Windows)

Run Chrome with a temporary profile:

```powershell
chrome.exe --user-data-dir=%TEMP%\chrome-webgpu-clean --no-first-run
```

If this works, the original Chrome profile has a local configuration issue.

## Hosting Notes

- DNS CNAME setup alone does not modify browser GPU behavior.
- GitHub Pages cannot be relied on for custom response headers like `Permissions-Policy`.
- If needed, host WebGPU apps on infrastructure where HTTP headers are fully controllable.

## Team Recommendation

- Treat Edge as the known-good browser for WebGPU demos.
- Keep a graceful fallback message in WebGPU apps.
- Use staging first (`qontic-dev`) before promoting to production.
