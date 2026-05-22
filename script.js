document.addEventListener("DOMContentLoaded", function () {

  // ===== DOM References =====
  var loadingScreen = document.getElementById("loading-screen");
  var loaderText = document.getElementById("loader-text");
  var welcomeScreen = document.getElementById("welcome-screen");
  var loginWrapper = document.getElementById("login-wrapper");
  var loginContainer = document.getElementById("login-container");
  var video = document.querySelector(".bg-video");
  var titleElement = document.getElementById("dynamic-title");
  var bgMusic = document.getElementById("bg-music");
  var volSlider = document.getElementById("vol-slider");
  var volValue = document.getElementById("vol-value");
  var audioControls = document.getElementById("audio-controls");
  var musicToggle = document.getElementById("music-toggle");
  var musicIcon = document.getElementById("music-icon");
  var visualizer = document.getElementById("visualizer");
  var songNameEl = document.getElementById("song-name");
  var loginHeading = document.getElementById("login-heading");
  var loginForm = document.getElementById("login-form");
  var errorToast = document.getElementById("error-toast");
  var cursorGlow = document.getElementById("cursor-glow");
  var canvas = document.getElementById("particles");
  var ctx = canvas.getContext("2d");

  // ===== Media State =====
  var musicPlaying = false;
  var bgVideos = [];
  var bgMusicList = [];
  var currentVideoIndex = -1;
  var currentMusicIndex = -1;
  var videoFadeTimer = null;

  // ===== Custom Cursor =====
  document.addEventListener("mousemove", function (e) {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
  });

  // ===== Particle System =====
  var particles = [];
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
  for (var i = 0; i < 80; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
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
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
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
  var titleText = "\u2728 Welcome \u2728";
  var ti = 0;
  function typeTitle() {
    if (ti < titleText.length) {
      titleElement.textContent += titleText[ti];
      ti++;
      setTimeout(typeTitle, 120);
    }
  }
  typeTitle();

  // ===== Loading Animation =====
  var dots = 0;
  var dotInterval = setInterval(function () {
    loaderText.textContent = "Loading" + ".".repeat(dots);
    dots = (dots + 1) % 4;
  }, 500);

  // ===== Random Picker (no consecutive repeat) =====
  function pickRandom(arr, lastIndex) {
    if (arr.length === 0) return -1;
    if (arr.length === 1) return 0;
    var next;
    do {
      next = Math.floor(Math.random() * arr.length);
    } while (next === lastIndex);
    return next;
  }

  // ===== Background Video System (Random + Fade) =====
  function startVideoWithFade(idx) {
    if (bgVideos.length === 0) return;
    currentVideoIndex = idx;
    video.src = bgVideos[idx].url;
    video.load();
    video.play().catch(function () { });

    // Fade in
    video.style.opacity = "1";

    // After 10s visible, fade out then pick next
    clearTimeout(videoFadeTimer);
    videoFadeTimer = setTimeout(function () {
      // Fade out
      video.style.opacity = "0";
      // After fade-out transition (1.5s), swap to next
      setTimeout(function () {
        var nextIdx = pickRandom(bgVideos, currentVideoIndex);
        startVideoWithFade(nextIdx);
      }, 4000);
    }, 15000);
  }

  // ===== Background Music System (Random Shuffle) =====
  function startMusic(idx) {
    if (bgMusicList.length === 0) return;
    currentMusicIndex = idx;
    bgMusic.src = bgMusicList[idx].url;
    bgMusic.load();

    // Update song name display
    if (songNameEl) {
      songNameEl.textContent = bgMusicList[idx].name;
    }

    var targetVol = volSlider.value / 100;
    bgMusic.volume = 0;

    var playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        musicPlaying = true;
        updateMusicUI();
        // Fade in volume
        var fadeInterval = setInterval(function () {
          if (bgMusic.volume < targetVol) {
            bgMusic.volume = Math.min(targetVol, bgMusic.volume + 0.005);
          } else {
            clearInterval(fadeInterval);
          }
        }, 50);
      }).catch(function () {
        musicPlaying = false;
        updateMusicUI();
        bgMusic.volume = targetVol;
      });
    }
  }

  // When current song ends, play next random song
  bgMusic.addEventListener("ended", function () {
    var nextIdx = pickRandom(bgMusicList, currentMusicIndex);
    if (nextIdx >= 0) {
      startMusic(nextIdx);
    }
  });

  // ===== Load Assets from assets.json =====
  fetch("assets.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      bgVideos = data.videos || [];
      bgMusicList = data.music || [];

      // Start random video
      if (bgVideos.length > 0) {
        var firstVideo = pickRandom(bgVideos, -1);
        startVideoWithFade(firstVideo);
      }

      // Prepare music (will try to play after user interaction or in sequence)
      if (bgMusicList.length > 0) {
        var firstMusic = pickRandom(bgMusicList, -1);
        currentMusicIndex = firstMusic;
        bgMusic.src = bgMusicList[firstMusic].url;
        if (songNameEl) {
          songNameEl.textContent = bgMusicList[firstMusic].name;
        }
      }
    })
    .catch(function (err) { console.error("Failed to load assets.json", err); });

  // ===== Sequence: Loading → Welcome → Login =====
  setTimeout(function () {
    loadingScreen.classList.add("hidden");
    clearInterval(dotInterval);
    setTimeout(function () {
      loadingScreen.style.display = "none";
      welcomeScreen.classList.add("visible");
    }, 1500);
  }, 4000);

  setTimeout(function () {
    welcomeScreen.classList.remove("visible");
    welcomeScreen.classList.add("hidden");
    setTimeout(function () {
      welcomeScreen.style.display = "none";
      loginWrapper.classList.add("visible");
      audioControls.classList.add("visible");
      typeLoginHeading();
      tryPlayMusic();
    }, 2000);
  }, 8000);

  // ===== Login Heading Typing =====
  function typeLoginHeading() {
    var text = "SinneFinneSomnium";
    var idx = 0;
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
    if (bgMusicList.length === 0 && !bgMusic.src) return;
    startMusic(currentMusicIndex >= 0 ? currentMusicIndex : 0);
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
      musicIcon.textContent = "\uD83D\uDD07";
      visualizer.classList.remove("active");
    } else if (vol < 0.4) {
      musicIcon.textContent = "\uD83D\uDD09";
      visualizer.classList.add("active");
    } else {
      musicIcon.textContent = "\uD83D\uDD0A";
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

  // ===== Volume Control =====
  volSlider.addEventListener("input", function (e) {
    e.stopPropagation();
    var val = volSlider.value;
    bgMusic.volume = val / 100;
    volSlider.style.background = "linear-gradient(to right, #6c9fff " + val + "%, rgba(255,255,255,0.12) " + val + "%)";
    volValue.textContent = val + "%";
    updateMusicUI();
  });

  volSlider.addEventListener("click", function (e) { e.stopPropagation(); });
  volSlider.addEventListener("mousedown", function (e) { e.stopPropagation(); });

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
    if (video) {
      video.style.transform = "translate(" + bgX + "px, " + bgY + "px)";
    }
  });

  // ===== Login System =====
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "1234") {
      loginWrapper.style.opacity = "0";
      loginWrapper.style.transform = "scale(1.05)";
      loginWrapper.style.transition = "all 0.8s ease";
      setTimeout(function () {
        window.location.href = "Home/Homepage.html";
      }, 800);
    } else {
      errorToast.classList.add("visible");
      loginContainer.style.animation = "none";
      loginContainer.offsetHeight;
      loginContainer.style.animation = "";
      setTimeout(function () {
        errorToast.classList.remove("visible");
      }, 3000);
    }
  });

});