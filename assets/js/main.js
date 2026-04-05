(function () {
  "use strict";

  var SECTION_ORDER = [
    "top",
    "about",
    "why-us",
    "industries",
    "process",
    "products",
    "contact",
  ];

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    /* Lucide icons (UMD attaches to globalThis.lucide; strict mode needs explicit global) */
    var L = typeof globalThis !== "undefined" ? globalThis.lucide : null;
    if (L && typeof L.createIcons === "function") {
      L.createIcons();
    }

    /* Fixed header: elevate on scroll */
    var siteHeader = document.getElementById("site-header");
    var scrollTicking = false;
    function updateHeaderScroll() {
      if (!siteHeader) return;
      siteHeader.classList.toggle("site-header--scrolled", window.scrollY > 24);
      scrollTicking = false;
    }
    function onScrollHeader() {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateHeaderScroll);
        scrollTicking = true;
      }
    }
    updateHeaderScroll();
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    /* Mobile nav */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (toggle && nav) {
      function setNavOpen(open) {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        nav.classList.toggle("is-open", open);
        document.body.style.overflow = open ? "hidden" : "";
      }

      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        setNavOpen(!open);
      });

      nav.querySelectorAll(".nav__link[data-nav]").forEach(function (link) {
        link.addEventListener("click", function () {
          if (window.matchMedia("(max-width: 767px)").matches) {
            setNavOpen(false);
          }
        });
      });

      window.addEventListener("resize", function () {
        if (window.matchMedia("(min-width: 768px)").matches) {
          setNavOpen(false);
        }
      });
    }

    /* Scroll spy */
    var navLinks = document.querySelectorAll(".site-nav .nav__link[data-nav]");
    var visibleSections = new Set();

    function setActiveNav(id) {
      navLinks.forEach(function (a) {
        var href = a.getAttribute("href") || "";
        var match = href.charAt(0) === "#" && href.slice(1) === id;
        a.classList.toggle("is-active", match);
        if (match) {
          a.setAttribute("aria-current", "location");
        } else {
          a.removeAttribute("aria-current");
        }
      });
    }

    function pickActiveSection() {
      var activeId = null;
      for (var i = 0; i < SECTION_ORDER.length; i++) {
        if (visibleSections.has(SECTION_ORDER[i])) {
          activeId = SECTION_ORDER[i];
          break;
        }
      }
      if (!activeId) {
        activeId = "top";
      }
      setActiveNav(activeId);
    }

    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          if (entry.isIntersecting) {
            visibleSections.add(id);
          } else {
            visibleSections.delete(id);
          }
        });
        pickActiveSection();
      },
      {
        root: null,
        rootMargin: "-12% 0px -55% 0px",
        threshold: 0,
      }
    );

    SECTION_ORDER.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        spyObserver.observe(el);
      }
    });

    /* Reveal on scroll */
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }

    /* Formspree thank-you redirect */
    if (new URLSearchParams(window.location.search).get("thanks") === "1") {
      var thanks = document.getElementById("form-thanks");
      var form = document.getElementById("contact-form");
      if (thanks) {
        thanks.hidden = false;
      }
      if (form) {
        form.hidden = true;
      }
    }
  });
})();
