document.addEventListener("DOMContentLoaded", function () {

  // ===== DOM References =====
  const loadingScreen = document.getElementById("loading-screen");
  const loaderText = document.getElementById("loader-text");
  const welcomeScreen = document.getElementById("welcome-screen");
  const loginWrapper = document.getElementById("login-wrapper");
  const loginContainer = document.getElementById("login-container");
  const video = document.querySelector(".bg-video");
  const titleElement = document.getElementById("dynamic-title");
  const bgMusic = document.getElementById("bg-music");
  const volSlider = document.getElementById("vol-slider");
  const volValue = document.getElementById("vol-value");
  const audioControls = document.getElementById("audio-controls");
  const musicToggle = document.getElementById("music-toggle");
  const musicIcon = document.getElementById("music-icon");
  const visualizer = document.getElementById("visualizer");
  const loginHeading = document.getElementById("login-heading");
  const loginForm = document.getElementById("login-form");
  const errorToast = document.getElementById("error-toast");
  const cursorGlow = document.getElementById("cursor-glow");
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  // ===== Music State (single source of truth) =====
  let musicPlaying = false;

  // ===== Custom Cursor =====
  document.addEventListener("mousemove", function (e) {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
  });

  // ===== Particle System =====
  let particles = [];
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1
    };
  }
  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(108, 159, 255, " + p.opacity + ")";
      ctx.fill();
    });
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(108, 159, 255, " + (0.08 * (1 - dist / 120)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ===== Title Typing Effect =====
  const titleText = "\u2728 Welcome \u2728";
  let ti = 0;
  function typeTitle() {
    if (ti < titleText.length) {
      titleElement.textContent += titleText[ti];
      ti++;
      setTimeout(typeTitle, 120);
    }
  }
  typeTitle();

  // ===== Loading Animation =====
  let dots = 0;
  const dotInterval = setInterval(function () {
    loaderText.textContent = "Loading" + ".".repeat(dots);
    dots = (dots + 1) % 4;
  }, 500);

  // ===== Background Videos =====
  const bgVideos = [
    "bg/1.mp4","bg/2.mp4","bg/3.mp4","bg/4.mp4",
    "bg/5.mp4","bg/6.mp4","bg/7.mp4","bg/8.mp4",
    "bg/9.mp4","bg/10.mp4","bg/11.mp4"
  ];
  let currentVideoIndex = 0;

  function startVideoCycle() {
    setInterval(function() {
      video.style.opacity = "0"; // Start fade out
      setTimeout(function() {
        currentVideoIndex = (currentVideoIndex + 1) % bgVideos.length;
        video.src = bgVideos[currentVideoIndex];
        video.load();
        video.play();
        video.style.opacity = "1"; // Fade back in
      }, 3000); // Wait for the 3s CSS opacity transition
    }, 10000); // Change every 10 seconds
  }

  // ===== Sequence: Loading → Welcome → Login =====

  // Step 1: After 4s, hide loading, show welcome
  setTimeout(function () {
    loadingScreen.classList.add("hidden");
    clearInterval(dotInterval);
    setTimeout(function () {
      loadingScreen.style.display = "none";
      welcomeScreen.classList.add("visible");
    }, 1500);
  }, 4000);

  // Step 2: After 8s, hide welcome, show login + video + controls
  setTimeout(function () {
    welcomeScreen.classList.remove("visible");
    welcomeScreen.classList.add("hidden");
    setTimeout(function () {
      welcomeScreen.style.display = "none";

      // Show login
      loginWrapper.classList.add("visible");

      // Load & show background video
      video.src = bgVideos[currentVideoIndex];
      video.load();
      video.style.opacity = "1";
      startVideoCycle();

      // Show audio controls
      audioControls.classList.add("visible");

      // Type login heading
      typeLoginHeading();

      // Try auto-play music
      tryPlayMusic();

    }, 2000);
  }, 8000);

  // ===== Login Heading Typing =====
  function typeLoginHeading() {
    const text = "SinneFinneSomnium";
    let idx = 0;
    loginHeading.textContent = "";
    function typeChar() {
      if (idx < text.length) {
        loginHeading.textContent += text[idx];
        idx++;
        setTimeout(typeChar, 60);
      }
    }
    typeChar();
  }

  // ===== Music Functions =====
  bgMusic.volume = volSlider.value / 100;

  function tryPlayMusic() {
    bgMusic.volume = 0; // Start at 0 for fade in
    var targetVol = volSlider.value / 100;
    var playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        musicPlaying = true;
        updateMusicUI();
        
        // Fade in effect
        var fadeInterval = setInterval(function () {
          if (bgMusic.volume < targetVol) {
            bgMusic.volume = Math.min(targetVol, bgMusic.volume + 0.005);
          } else {
            clearInterval(fadeInterval);
          }
        }, 50);

      }).catch(function () {
        // Autoplay blocked — will start on first user interaction
        musicPlaying = false;
        updateMusicUI();
        bgMusic.volume = targetVol; // Reset volume if failed
      });
    }
  }

  function toggleMusic() {
    if (!musicPlaying) {
      bgMusic.play().then(function () {
        musicPlaying = true;
        updateMusicUI();
      }).catch(function () {
        console.log("Music play failed");
      });
    } else {
      bgMusic.pause();
      musicPlaying = false;
      updateMusicUI();
    }
  }

  function updateMusicUI() {
    var vol = bgMusic.volume;
    if (!musicPlaying || vol === 0) {
      musicIcon.textContent = "\uD83D\uDD07"; // muted
      visualizer.classList.remove("active");
    } else if (vol < 0.4) {
      musicIcon.textContent = "\uD83D\uDD09"; // low
      visualizer.classList.add("active");
    } else {
      musicIcon.textContent = "\uD83D\uDD0A"; // loud
      visualizer.classList.add("active");
    }
  }

  // Start music on first user interaction (if autoplay was blocked)
  function onFirstInteraction() {
    if (!musicPlaying) {
      tryPlayMusic();
    }
    document.removeEventListener("click", onFirstInteraction);
    document.removeEventListener("keydown", onFirstInteraction);
    document.removeEventListener("touchstart", onFirstInteraction);
  }
  document.addEventListener("click", onFirstInteraction);
  document.addEventListener("keydown", onFirstInteraction);
  document.addEventListener("touchstart", onFirstInteraction);

  // ===== Volume Control (BUG FIX) =====
  volSlider.addEventListener("input", function (e) {
    // Stop event from bubbling to document click (which triggers music start)
    e.stopPropagation();

    var val = volSlider.value;
    bgMusic.volume = val / 100;

    // Update slider fill visual
    volSlider.style.background = "linear-gradient(to right, #6c9fff " + val + "%, rgba(255,255,255,0.12) " + val + "%)";

    // Update percentage display
    volValue.textContent = val + "%";

    // Update icon based on volume
    updateMusicUI();
  });

  // Prevent slider click from triggering document-level music start
  volSlider.addEventListener("click", function (e) { e.stopPropagation(); });
  volSlider.addEventListener("mousedown", function (e) { e.stopPropagation(); });

  // Initialize slider visual
  var initVal = volSlider.value;
  volSlider.style.background = "linear-gradient(to right, #6c9fff " + initVal + "%, rgba(255,255,255,0.12) " + initVal + "%)";

  // ===== Music Toggle =====
  musicToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleMusic();
  });

  // ===== Parallax Effect =====
  document.addEventListener("mousemove", function (e) {
    var x = (e.clientX / window.innerWidth - 0.5) * -12;
    var y = (e.clientY / window.innerHeight - 0.5) * -12;
    if (loginContainer) {
      loginContainer.style.transform = "translate(" + x + "px, " + y + "px)";
    }
    var bgX = (e.clientX / window.innerWidth - 0.5) * 8;
    var bgY = (e.clientY / window.innerHeight - 0.5) * 8;
    video.style.transform = "translate(" + bgX + "px, " + bgY + "px)";
  });

  // ===== Login System =====
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "1234") {
      // Success — fade out and redirect
      loginWrapper.style.opacity = "0";
      loginWrapper.style.transform = "scale(1.05)";
      loginWrapper.style.transition = "all 0.8s ease";
      setTimeout(function () {
        window.location.href = "Home/homepage.html";
      }, 800);
    } else {
      // Error — show toast
      errorToast.classList.add("visible");
      // Shake the login container
      loginContainer.style.animation = "none";
      loginContainer.offsetHeight; // force reflow
      loginContainer.style.animation = "";

      setTimeout(function () {
        errorToast.classList.remove("visible");
      }, 3000);
    }
  });

});