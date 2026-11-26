/* lang.js — EN/TH switch for project pages.
   Uses the same saved choice ("sfs-lang") as the homepage, so the whole site stays in one language.
   Mark text with data-l="en" / data-l="th"; project.css hides the other language.
   Load in <head> without defer so the right language shows on first paint. */
(function () {
  "use strict";
  var KEY = "sfs-lang";
  var root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(lang) {
    root.lang = lang;
    var opts = document.querySelectorAll(".lang-option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle("active", opts[i].getAttribute("data-lang") === lang);
    }
  }

  apply(saved() === "th" ? "th" : "en");

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.lang);
    var btn = document.getElementById("lang-switcher");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = root.lang === "th" ? "en" : "th";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { }
    });
  });
})();
