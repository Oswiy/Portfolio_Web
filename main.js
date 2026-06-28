/* ─────────────────────────────────────────
   SCROLL REVEAL
   Triggers .is-visible when an element
   with .reveal enters the viewport.
───────────────────────────────────────── */
(function () {
  const revealEls = document.querySelectorAll(".reveal");

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 },
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
