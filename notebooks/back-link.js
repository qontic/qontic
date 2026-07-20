(() => {
  const NOTEBOOKS = [
    { slug: "delayed-choice", title: "Delayed Choice" },
    { slug: "double-slit-webgl", title: "Double Slit in Bohmian Mechanics" },
    { slug: "free-packet-2d", title: "Free Packet 2D" },
    { slug: "klein-tunneling", title: "Klein Tunneling" },
    { slug: "particle-box-3d", title: "Particle Box 3D" },
    { slug: "potential-well-revision-4-6", title: "Potential Well Revision" },
    { slug: "quantum-equilibrium-relaxation", title: "Quantum Equilibrium Relaxation" },
    { slug: "stern-gerlach-close-up", title: "Stern-Gerlach Close-Up" },
    { slug: "tunneling", title: "Tunneling" }
  ];

  function safeReturnHref() {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.get("returnTo");

    if (explicit) {
      try {
        const url = new URL(explicit, window.location.href);
        if (url.origin === window.location.origin) return url.href;
      } catch (_) {}
    }

    if (document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        if (referrer.origin === window.location.origin && referrer.href !== window.location.href) {
          return referrer.href;
        }
      } catch (_) {}
    }

    return "../../index.html";
  }

  function getCurrentNotebookSlug() {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "";
    return lastSegment === "index.html" ? segments[segments.length - 2] || null : lastSegment || null;
  }

  function createLink(label, href, extraClass) {
    const link = document.createElement("a");
    link.className = `nav-button ${extraClass}`.trim();
    link.setAttribute("href", href);
    link.textContent = label;
    return link;
  }

  function addNavigationFooter() {
    if (document.querySelector(".notebook-footer-nav")) return;

    const currentSlug = getCurrentNotebookSlug();
    const currentIndex = NOTEBOOKS.findIndex((notebook) => notebook.slug === currentSlug);
    const footer = document.createElement("nav");
    footer.className = "notebook-footer-nav";
    footer.setAttribute("aria-label", "Notebook navigation");

    footer.appendChild(
      createLink("Back", safeReturnHref(), "footer-nav-button footer-nav-button-main")
    );

    if (currentIndex > 0) {
      const previous = NOTEBOOKS[currentIndex - 1];
      footer.appendChild(
        createLink(`Previous notebook: ${previous.title}`, `../${previous.slug}/index.html`, "footer-nav-button")
      );
    }

    if (currentIndex >= 0 && currentIndex < NOTEBOOKS.length - 1) {
      const next = NOTEBOOKS[currentIndex + 1];
      footer.appendChild(
        createLink(`Next notebook: ${next.title}`, `../${next.slug}/index.html`, "footer-nav-button")
      );
    }

    const main = document.querySelector("main");
    (main || document.body).appendChild(footer);
  }

  function injectStyles() {
    if (document.getElementById("notebook-footer-styles")) return;

    const style = document.createElement("style");
    style.id = "notebook-footer-styles";
    style.textContent = `
      .notebook-footer-nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
        margin: 2.25rem 0 1.5rem;
        padding: 0 1rem;
      }
      .footer-nav-button {
        background: linear-gradient(135deg, #2f7ccf 0%, #4f9bd8 100%);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        box-shadow: 0 10px 22px rgba(47, 124, 207, 0.24);
      }
      .footer-nav-button-main {
        background: linear-gradient(135deg, #0f4c81 0%, #1c6cb2 100%);
        box-shadow: 0 10px 22px rgba(15, 76, 129, 0.24);
      }
      .footer-nav-button:hover,
      .footer-nav-button:focus-visible {
        background: linear-gradient(135deg, #2568ab 0%, #3b7fb9 100%);
        color: #fff;
        transform: translateY(-1px);
      }
      @media (max-width: 700px) {
        .notebook-footer-nav {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function updateExistingBackLinks() {
    const href = safeReturnHref();
    document.querySelectorAll("a.nav-button").forEach((link) => {
      if (/back/i.test(link.textContent || "")) {
        link.setAttribute("href", href);
        if (/back to main page/i.test(link.textContent || "")) link.textContent = "Back";
      }
    });
  }

  function initialize() {
    injectStyles();
    addNavigationFooter();
    updateExistingBackLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();