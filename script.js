
/* ========================================
   VOX MUNDI MUN 3.0
   Main JavaScript
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.querySelector(".page-loader");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  /* ======================================
     1. PAGE LOADER
  ====================================== */

  const hideLoader = () => {
    if (loader) {
      loader.classList.add("loaded");
    }
  };

  // Wait for the page's images and other resources.
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, {
      once: true
    });
  }

  // Fallback so a slow image doesn't leave the loader stuck.
  window.setTimeout(hideLoader, 2500);


  /* ======================================
     2. MOBILE NAVIGATION
  ====================================== */

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    body.classList.remove("menu-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      body.classList.toggle("menu-open", isOpen);
    });

    // Close the menu when a navigation link is selected.
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close when Escape is pressed.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Restore the desktop layout when resizing back.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  /* ======================================
     3. SMOOTH SCROLLING
  ====================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      // Ignore empty hash links.
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      // Update the URL without a sudden jump.
      if (window.location.hash !== targetId) {
        history.pushState(null, "", targetId);
      }
    });
  });


  /* ======================================
     4. SCROLL REVEAL ANIMATIONS
  ====================================== */

  const revealTargets = [
    ".section-index",
    ".section-heading",
    ".about-copy",
    ".about-image",
    ".principle-card",
    ".founder-content",
    ".committee-card",
    ".conference-intro",
    ".conference-stats",
    ".register-panel",
    ".footer-main"
  ];

  revealTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      // Avoid applying reveal twice to the same element.
      if (!element.classList.contains("reveal")) {
        element.classList.add("reveal");
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  const showElement = (element) => {
    element.classList.add("visible");
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers.
    revealElements.forEach(showElement);
  }


  /* ======================================
     5. FOOTER YEAR
  ====================================== */

  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ======================================
     6. COMMITTEE CARD LINKS
  ====================================== */

  document.querySelectorAll(".committee-card").forEach((card) => {
    const link = card.querySelector(".committee-link");

    if (!link) return;

    // Make the card keyboard-friendly without
    // overriding the link's normal click behavior.
    card.setAttribute("tabindex", "0");

    card.addEventListener("keydown", (event) => {
      if (
        event.target === card &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        link.click();
      }
    });
  });


  /* ======================================
     7. REGISTRATION LINK SAFETY
  ====================================== */

  document.querySelectorAll(
    'a[href^="https://forms.gle/"]'
  ).forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });


  /* ======================================
     8. OPTIONAL BACK-TO-TOP SUPPORT
     Works if a #back-to-top link is added.
  ====================================== */

  const backToTop = document.querySelector("#back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth"
      });
    });
  }

});
