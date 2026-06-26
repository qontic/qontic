(() => {
  const RETURN_TAB_KEY = "qontic:returnTab";
  const VALID_TABS = new Set(["comparative", "pilot-wave", "notebook", "all"]);

  function normalizeTab(tab) {
    return VALID_TABS.has(tab) ? tab : null;
  }

  function returnTab() {
    const params = new URLSearchParams(window.location.search);
    return (
      normalizeTab(params.get("from")) ||
      normalizeTab(sessionStorage.getItem(RETURN_TAB_KEY)) ||
      "notebook"
    );
  }

  function updateBackLinks() {
    const href = `../../index.html#${returnTab()}`;
    document.querySelectorAll("a.nav-button").forEach((link) => {
      if (/back to main page/i.test(link.textContent || "")) {
        link.setAttribute("href", href);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBackLinks);
  } else {
    updateBackLinks();
  }
})();
