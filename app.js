(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const glow = document.getElementById("cursorGlow");
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const sections = ["work", "about", "notes"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  // Mouse-follow ambient light. It is decorative only, so pointer devices get
  // a small desktop-only enhancement; touch and reduced-motion users keep a
  // clean static page.
  if (glow && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame = null;

    const render = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      glow.style.transform = `translate(${currentX - 270}px, ${currentY - 270}px)`;
      frame = null;
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frame = window.requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.style.opacity = "1";
      if (!frame) frame = window.requestAnimationFrame(render);
    }, { passive: true });

    document.addEventListener("pointerleave", () => {
      glow.style.opacity = "0";
    });
  }

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
      revealObserver.observe(item);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.22 });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }
})();
