/* login.js — index.html: particles, intro sequence (loading → welcome → login) and the login form.
   Background video + music come from media.js. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var loadingScreen = $("loading-screen");
  var loaderText = $("loader-text");
  var welcomeScreen = $("welcome-screen");
  var loginWrapper = $("login-wrapper");
  var loginContainer = $("login-container");
  var loginHeading = $("login-heading");
  var loginForm = $("login-form");
  var errorToast = $("error-toast");
  var audioControls = $("audio-controls");
  var cursorGlow = $("cursor-glow");
  var video = document.querySelector(".bg-video");
  var canvas = $("particles");
  var ctx = canvas.getContext("2d");
  var hasMouse = window.matchMedia("(hover: hover)").matches;

  var media = SFSMedia.create({ assetsUrl: "assets/media.json" });

  /* ---------- Typing helper ---------- */
  function typeText(el, text, delay) {
    var i = 0;
    el.textContent = "";
    (function next() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(next, delay);
      }
    })();
  }

  typeText(document.querySelector("title"), "✨ Welcome ✨", 120);

  /* ---------- Particle network ---------- */
  var particles = [];
  var LINK_DIST = 120, LINK_DIST_SQ = LINK_DIST * LINK_DIST;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  for (var n = 0; n < 80; n++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  function drawParticles() {
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(108, 159, 255, " + p.opacity + ")";
      ctx.fill();
    }

    ctx.lineWidth = 0.5;
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var distSq = dx * dx + dy * dy;
        if (distSq < LINK_DIST_SQ) {   // compare squared distance: no sqrt for far pairs
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = "rgba(108, 159, 255, " + (0.08 * (1 - Math.sqrt(distSq) / LINK_DIST)) + ")";
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ---------- Cursor glow + parallax (mouse only, once per frame) ---------- */
  if (hasMouse) {
    var mouseX = 0, mouseY = 0, frameQueued = false;
    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (frameQueued) return;
      frameQueued = true;
      requestAnimationFrame(function () {
        frameQueued = false;
        cursorGlow.style.left = mouseX + "px";
        cursorGlow.style.top = mouseY + "px";
        var rx = mouseX / window.innerWidth - 0.5;
        var ry = mouseY / window.innerHeight - 0.5;
        loginContainer.style.transform = "translate(" + (rx * -12) + "px, " + (ry * -12) + "px)";
        if (video) video.style.transform = "translate(" + (rx * 8) + "px, " + (ry * 8) + "px)";
      });
    });
  }

  /* ---------- Intro: Loading → Welcome → Login (about 3s; click or press a key to skip) ---------- */
  var LOADING_MS = 800, LOADING_FADE_MS = 500, WELCOME_MS = 1300, WELCOME_FADE_MS = 500;
  var introTimers = [];
  var loginShown = false;

  var dots = 0;
  var dotInterval = setInterval(function () {
    loaderText.textContent = "Loading" + ".".repeat(dots);
    dots = (dots + 1) % 4;
  }, 250);

  introTimers.push(setTimeout(function () {
    loadingScreen.classList.add("hidden");
    clearInterval(dotInterval);
    introTimers.push(setTimeout(function () {
      loadingScreen.style.display = "none";
      welcomeScreen.classList.add("visible");
    }, LOADING_FADE_MS));
  }, LOADING_MS));

  introTimers.push(setTimeout(showLogin, LOADING_MS + LOADING_FADE_MS + WELCOME_MS));

  function showLogin() {
    if (loginShown) return;
    loginShown = true;
    introTimers.forEach(clearTimeout);
    clearInterval(dotInterval);
    loadingScreen.classList.add("hidden");
    welcomeScreen.classList.remove("visible");
    welcomeScreen.classList.add("hidden");
    setTimeout(function () {
      loadingScreen.style.display = "none";
      welcomeScreen.style.display = "none";
      loginWrapper.classList.add("visible");
      audioControls.classList.add("visible");
      typeText(loginHeading, "SinneFinneSomnium", 60);
      media.tryPlayMusic();
    }, WELCOME_FADE_MS);
  }

  // Skip the intro with a click or any key
  loadingScreen.addEventListener("click", showLogin);
  welcomeScreen.addEventListener("click", showLogin);
  document.addEventListener("keydown", function skipIntro() {
    document.removeEventListener("keydown", skipIntro);
    showLogin();
  });

  /* ---------- Login form ----------
     Note: this is a fun gate, not real security — anyone can read this file. */
  var errorTimer = null;
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var username = $("username").value.trim();
    var password = $("password").value.trim();

    if (username === "admin" && password === "1234") {
      loginWrapper.style.transition = "all 0.8s ease";
      loginWrapper.style.opacity = "0";
      loginWrapper.style.transform = "scale(1.05)";
      setTimeout(function () { window.location.href = "Home/Homepage.html"; }, 800);
      return;
    }

    // Restart the shake on the card and the toast, even on repeated tries
    errorToast.classList.remove("visible");
    loginContainer.classList.remove("shake");
    void loginContainer.offsetWidth;
    errorToast.classList.add("visible");
    loginContainer.classList.add("shake");
    clearTimeout(errorTimer);
    errorTimer = setTimeout(function () {
      errorToast.classList.remove("visible");
      loginContainer.classList.remove("shake");
    }, 3000);
  });
});
