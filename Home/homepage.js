document.addEventListener("DOMContentLoaded", function () {

  // ===== Background Video =====
  var video = document.querySelector(".bg-video");
  // Updated to load background videos from Google Drive (replace VIDEO_ID_x with actual file IDs)
  var bgVideos = [
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_1",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_2",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_3",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_4",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_5",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_6",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_7",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_8",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_9",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_10",
    "https://drive.google.com/uc?export=download?id=VIDEO_ID_11",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_12",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_13",
    "https://drive.google.com/uc?export=download&id=VIDEO_ID_14"
  ];
  let currentVideoIndex = 0;
  video.src = bgVideos[currentVideoIndex];
  video.style.opacity = "1";

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

  // ===== Hero Tagline Typing =====
  var taglines = [
    "Creative Developer & Designer",
    "Building Beautiful Experiences",
    "Code · Design · Create"
  ];
  var taglineEl = document.getElementById("hero-tagline");
  var tIdx = 0, cIdx = 0, deleting = false;

  function typeTagline() {
    var current = taglines[tIdx];
    if (!deleting) {
      taglineEl.textContent = current.substring(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        setTimeout(function () { deleting = true; typeTagline(); }, 2000);
        return;
      }
      setTimeout(typeTagline, 80);
    } else {
      taglineEl.textContent = current.substring(0, cIdx);
      cIdx--;
      if (cIdx < 0) {
        deleting = false;
        cIdx = 0;
        tIdx = (tIdx + 1) % taglines.length;
        setTimeout(typeTagline, 400);
        return;
      }
      setTimeout(typeTagline, 40);
    }
  }
  setTimeout(typeTagline, 1500);

  // ===== Navbar Scroll Effect =====
  var navbar = document.getElementById("navbar");
  var mainContent = document.getElementById("main-content");

  mainContent.addEventListener("scroll", function () {
    // This is for the body scroll
  });

  window.addEventListener("scroll", function () {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active nav link
    var sections = document.querySelectorAll(".section");
    var links = document.querySelectorAll(".nav-link");
    sections.forEach(function (sec) {
      var top = sec.offsetTop - 120;
      var bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        var id = sec.getAttribute("id");
        links.forEach(function (l) { l.classList.remove("active"); });
        var activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
        if (activeLink) activeLink.classList.add("active");
      }
    });
  });

  // ===== Mobile Menu =====
  var hamburger = document.getElementById("nav-hamburger");
  var mobileMenu = document.getElementById("mobile-menu");

  hamburger.addEventListener("click", function () {
    mobileMenu.classList.toggle("open");
  });

  // Close mobile menu on link click
  document.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
    });
  });

  // ===== Scroll Animations (Intersection Observer) =====
  var fadeElements = document.querySelectorAll(".glass-card, .section-title, .scroll-indicator");
  fadeElements.forEach(function (el) { el.classList.add("fade-in"); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(function (el) { observer.observe(el); });

  // ===== Animated Stat Counters =====
  var statNums = document.querySelectorAll(".stat-num");
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-target"));
        var count = 0;
        var step = Math.ceil(target / 40);
        var interval = setInterval(function () {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(interval);
          }
          el.textContent = count;
        }, 40);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(function (el) { statsObserver.observe(el); });

  // ===== Animated Skill Bars =====
  var skillFills = document.querySelectorAll(".skill-fill");
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var width = entry.target.getAttribute("data-width");
        entry.target.style.width = width + "%";
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(function (el) { skillObserver.observe(el); });

  // ===== Smooth scroll for nav links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ===== Dynamic Quote Generator =====
  var quotes = [
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Make it simple, but significant.", author: "Don Draper" },
    { text: "Art is science made clear.", author: "Jean Cocteau" },
    { text: "Programs must be written for people to read, and only secondarily for machines to execute.", author: "Harold Abelson" },
    { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
    { text: "To create something exceptional, your mindset must be relentlessly focused on the smallest detail.", author: "Giorgio Armani" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" }
  ];

  var quoteTextEl = document.getElementById("quote-text");
  var quoteAuthorEl = document.getElementById("quote-author");
  var newQuoteBtn = document.getElementById("new-quote-btn");
  var currentQuoteIndex = 0;

  function shuffleQuote() {
    if (!quoteTextEl || !quoteAuthorEl) return;
    
    var nextIndex;
    // Don't repeat the same quote sequentially
    do {
      nextIndex = Math.floor(Math.random() * quotes.length);
    } while (nextIndex === currentQuoteIndex && quotes.length > 1);

    currentQuoteIndex = nextIndex;
    var selectedQuote = quotes[currentQuoteIndex];

    // Fade out
    quoteTextEl.classList.add("quote-fade-out");
    quoteAuthorEl.classList.add("quote-fade-out");

    setTimeout(function () {
      quoteTextEl.textContent = selectedQuote.text;
      quoteAuthorEl.innerHTML = "&mdash; " + selectedQuote.author;
      
      // Fade in
      quoteTextEl.classList.remove("quote-fade-out");
      quoteAuthorEl.classList.remove("quote-fade-out");
    }, 300);
  }

  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", function (e) {
      e.preventDefault();
      shuffleQuote();
    });
  }

  // Auto-cycle quote every 12 seconds
  var quoteCycleInterval = setInterval(shuffleQuote, 12000);

  // Clear interval on manual button click to prevent immediate double jump
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", function() {
      clearInterval(quoteCycleInterval);
      quoteCycleInterval = setInterval(shuffleQuote, 12000);
    });
  }

  // ===== Background Music & Audio Controls =====
  var bgMusic = document.getElementById("bg-music");
  var volSlider = document.getElementById("vol-slider");
  var volValue = document.getElementById("vol-value");
  var musicToggle = document.getElementById("music-toggle");
  var musicIcon = document.getElementById("music-icon");
  var visualizer = document.getElementById("visualizer");
  var musicPlaying = false;

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
        musicPlaying = false;
        updateMusicUI();
        bgMusic.volume = targetVol;
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

  // Start music on first user interaction
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

  // Volume Control
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

  // Initialize slider visual
  var initVal = volSlider.value;
  volSlider.style.background = "linear-gradient(to right, #6c9fff " + initVal + "%, rgba(255,255,255,0.12) " + initVal + "%)";

  // Music Toggle
  musicToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleMusic();
  });

  // Start trying to play music (might be blocked by browser until interaction)
  setTimeout(tryPlayMusic, 1000);

});
