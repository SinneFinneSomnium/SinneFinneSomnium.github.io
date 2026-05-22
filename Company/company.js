document.addEventListener("DOMContentLoaded", function () {
  // Scroll fade-in animations
  var fadeElements = document.querySelectorAll(".glass-card, .section-title");
  fadeElements.forEach(function (el) { el.classList.add("fade-in"); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(function (el) { observer.observe(el); });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
