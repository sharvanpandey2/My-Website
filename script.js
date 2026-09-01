/* =========================================================================
   SR-ONE WEBSITE — SCRIPT.JS (v2)
   =========================================================================
   EVERYTHING YOU NEED TO EDIT REGULARLY LIVES IN THE "CONFIG" BLOCK BELOW.
   ========================================================================= */

// =============================
// SR-ONE WEBSITE CONFIGURATION
// =============================
const CONFIG = {
  companyName: "SR-ONE Consultancy",
  contactEmail: "sharvanpandey81@gmail.com",

  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE.
  // See /google-apps-script/Code.gs and the README for full setup steps.
  googleScriptUrl: "PASTE_GOOGLE_SCRIPT_URL_HERE",

  // EDIT SOCIAL LINKS HERE — used by the footer icon links.
  socialLinks: {
    linkedin: "#",
    instagram: "#",
    facebook: "#",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initScrollReveal();
  initServiceAccordion();
  initTabs();
  initTiltEffect();
  initTestimonialSlider();
  initContactForm();
  initLegalOverlays();
  initSocialLinks();
});

/* -------------------------------------------------------------------------
   NAVBAR
------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* -------------------------------------------------------------------------
   MOBILE HAMBURGER MENU
------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const actions = document.getElementById("navActions");
  const backdrop = document.getElementById("navBackdrop");
  if (!toggle || !links) return;

  const closeMenu = () => {
    toggle.classList.remove("open");
    links.classList.remove("mobile-open");
    actions.classList.remove("mobile-open");
    backdrop.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  const openMenu = () => {
    toggle.classList.add("open");
    links.classList.add("mobile-open");
    actions.classList.add("mobile-open");
    backdrop.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    links.classList.contains("mobile-open") ? closeMenu() : openMenu();
  });
  backdrop.addEventListener("click", closeMenu);
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

/* -------------------------------------------------------------------------
   SCROLL SPY
------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

/* -------------------------------------------------------------------------
   SCROLL REVEAL
------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
}

/* -------------------------------------------------------------------------
   SERVICES — expand/collapse accordion cards.
   Each [data-service] card toggles independently when its header is
   clicked; the capability tags stay hidden until then, which is what
   keeps the Services section short by default.
------------------------------------------------------------------------- */
function initServiceAccordion() {
  const cards = document.querySelectorAll("[data-service]");
  if (!cards.length) return;

  cards.forEach((card) => {
    const head = card.querySelector(".service-head");
    head.addEventListener("click", () => {
      const isOpen = card.classList.contains("is-open");
      card.classList.toggle("is-open", !isOpen);
      head.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

/* -------------------------------------------------------------------------
   TABS — generic tab switcher used by the "Approach" and "Proof" sections.
   Matches elements by data-tab-group so multiple tab components can share
   this one function.
------------------------------------------------------------------------- */
function initTabs() {
  const groups = new Set();
  document.querySelectorAll("[data-tab-group]").forEach((el) => groups.add(el.dataset.tabGroup));

  groups.forEach((groupName) => {
    const buttons = document.querySelectorAll(`.tab-switch[data-tab-group="${groupName}"] button`);
    const panels = document.querySelectorAll(`.tab-panel[data-tab-group="${groupName}"]`);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
        panels.forEach((p) => p.classList.toggle("active", p.dataset.tabPanel === target));
      });
    });
  });
}

/* -------------------------------------------------------------------------
   TILT EFFECT — a subtle (max ~5deg) pointer-following tilt on service and
   case cards, disabled on touch devices and when reduced motion is set.
   This is the one "hover has personality" moment on the site; everything
   else stays calm on purpose.
------------------------------------------------------------------------- */
function initTiltEffect() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (prefersReducedMotion || isTouch) return;

  const cards = document.querySelectorAll(".service-card, .case-card");
  const maxTilt = 5;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

/* -------------------------------------------------------------------------
   TESTIMONIAL SLIDER
------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testimonial-dot");
  if (!slides.length) return;

  let current = 0;
  let timer;

  const showSlide = (index) => {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    current = index;
  };
  const next = () => showSlide((current + 1) % slides.length);
  const startAutoplay = () => {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slide));
      startAutoplay();
    });
  });

  startAutoplay();
}

/* -------------------------------------------------------------------------
   CONTACT FORM — validation + submission to Google Apps Script
------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const successBox = document.getElementById("formSuccess");
  const errorBox = document.getElementById("formError");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldValid(groupId, valid) {
    const group = document.getElementById(groupId);
    if (group) group.classList.toggle("invalid", !valid);
  }

  function validate() {
    let valid = true;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const query = form.query.value.trim();
    const services = form.querySelectorAll('input[name="services"]:checked');
    const consent = form.consent.checked;

    setFieldValid("group-firstName", firstName.length > 0);
    if (!firstName) valid = false;

    setFieldValid("group-lastName", lastName.length > 0);
    if (!lastName) valid = false;

    const emailOk = emailRegex.test(email);
    setFieldValid("group-email", emailOk);
    if (!emailOk) valid = false;

    setFieldValid("group-services", services.length > 0);
    if (services.length === 0) valid = false;

    setFieldValid("group-query", query.length > 0);
    if (!query) valid = false;

    const consentErrorBox = document.getElementById("group-consent-error");
    if (!consent) {
      valid = false;
      if (consentErrorBox) consentErrorBox.style.display = "block";
    } else if (consentErrorBox) {
      consentErrorBox.style.display = "none";
    }

    return valid;
  }

  ["firstName", "lastName", "email", "query"].forEach((name) => {
    form[name].addEventListener("input", () => {
      document.getElementById(`group-${name}`).classList.remove("invalid");
    });
  });
  form.querySelectorAll('input[name="services"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      document.getElementById("group-services").classList.remove("invalid");
    });
  });

  function setLoading(isLoading) {
    submitBtn.classList.toggle("loading", isLoading);
    submitBtn.disabled = isLoading;
  }
  function hideStatuses() {
    successBox.classList.remove("show");
    errorBox.classList.remove("show");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideStatuses();

    if (!validate()) {
      const firstInvalid = form.querySelector(".invalid, .consent-row");
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const services = Array.from(form.querySelectorAll('input[name="services"]:checked')).map((cb) => cb.value);
    const payload = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      mobile: form.mobile.value.trim(),
      company: form.company.value.trim(),
      services: services.join(", "),
      query: form.query.value.trim(),
      consent: form.consent.checked ? "Yes" : "No",
    };

    setLoading(true);

    try {
      if (!CONFIG.googleScriptUrl || CONFIG.googleScriptUrl.includes("PASTE_")) {
        console.warn(
          "SR-ONE: googleScriptUrl is not configured yet. Form data was not sent anywhere. " +
            "See the README for setup steps."
        );
        await new Promise((res) => setTimeout(res, 600));
      } else {
        const response = await fetch(CONFIG.googleScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!result || result.status !== "success") {
          throw new Error((result && result.message) || "Submission failed");
        }
      }

      successBox.classList.add("show");
      form.reset();
      form.querySelectorAll(".form-group").forEach((g) => g.classList.remove("invalid"));
    } catch (err) {
      console.error("SR-ONE contact form error:", err);
      errorBox.classList.add("show");
    } finally {
      setLoading(false);
    }
  });
}

/* -------------------------------------------------------------------------
   LEGAL OVERLAYS
------------------------------------------------------------------------- */
function initLegalOverlays() {
  const privacyOverlay = document.getElementById("privacyOverlay");
  const termsOverlay = document.getElementById("termsOverlay");
  const openPrivacy = document.getElementById("openPrivacy");
  const openTerms = document.getElementById("openTerms");

  const open = (overlay) => (e) => {
    e.preventDefault();
    overlay.classList.add("show");
  };
  if (openPrivacy) openPrivacy.addEventListener("click", open(privacyOverlay));
  if (openTerms) openTerms.addEventListener("click", open(termsOverlay));

  document.querySelectorAll("[data-close-legal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      privacyOverlay.classList.remove("show");
      termsOverlay.classList.remove("show");
    });
  });
  [privacyOverlay, termsOverlay].forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("show");
    });
  });
}

/* -------------------------------------------------------------------------
   SOCIAL LINKS
------------------------------------------------------------------------- */
function initSocialLinks() {
  const map = {
    footerLinkedIn: CONFIG.socialLinks.linkedin,
    footerInstagram: CONFIG.socialLinks.instagram,
    footerFacebook: CONFIG.socialLinks.facebook,
  };
  Object.entries(map).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el && url) el.setAttribute("href", url);
  });
}
