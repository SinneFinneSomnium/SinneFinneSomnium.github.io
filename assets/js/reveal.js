/* reveal.js — shared by Homepage, Company and project pages.
   Fades elements in as they scroll into view, and smooth-scrolls in-page links. */
document.addEventListener("DOMContentLoaded", function () {
  var targets = document.querySelectorAll(".glass-card, .section-title, .scroll-indicator, [data-reveal]");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (el) {
      el.classList.add("fade-in");
      observer.observe(el);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = anchor.getAttribute("href");
      if (href === "#") { e.preventDefault(); return; } // placeholder link: do nothing
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
