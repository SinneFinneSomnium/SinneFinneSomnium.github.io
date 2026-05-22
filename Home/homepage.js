document.addEventListener("DOMContentLoaded", function () {

  // ===== Translations =====
  var translations = {
    en: {
      nav_brand: "SinneFinneSomnium",
      nav_home: "Home",
      nav_about: "About",
      nav_skills: "Skills",
      nav_projects: "Projects",
      nav_contact: "Contact",
      hero_greeting: "Hello, I'm",
      clock_label: "Bangkok Time",
      btn_projects: "View Projects",
      btn_contact: "Contact Me",
      btn_shuffle: "Shuffle Quote",
      scroll: "Scroll",
      section_about: "About Me",
      about_title: "Who am I?",
      about_p1: "I'm a creative developer passionate about building beautiful digital experiences. I love combining art and technology to create something truly unique.",
      about_p2: "From web development to creative coding, I explore the intersection of design and engineering to craft immersive, interactive projects.",
      stat_projects: "Projects",
      stat_tech: "Technologies",
      stat_years: "Years Experience",
      section_skills: "Skills & Technologies",
      section_projects: "Projects",
      section_contact: "Get In Touch",
      contact_desc: "Have a question or want to work together? Feel free to reach out!",
      sidebar_library: "My Library",
      sidebar_quotes: "Mindful Quotes",
      sidebar_tools: "Tools",
      sidebar_certificates: "Certificates",
      sidebar_company: "My Company"
    },
    th: {
      nav_brand: "SinneFinneSomnium",
      nav_home: "หน้าแรก",
      nav_about: "เกี่ยวกับ",
      nav_skills: "ทักษะ",
      nav_projects: "โปรเจกต์",
      nav_contact: "ติดต่อ",
      hero_greeting: "สวัสดี ผมชื่อ",
      clock_label: "เวลากรุงเทพฯ",
      btn_projects: "ดูโปรเจกต์",
      btn_contact: "ติดต่อผม",
      btn_shuffle: "สุ่มคำคม",
      scroll: "เลื่อนลง",
      section_about: "เกี่ยวกับผม",
      about_title: "ผมเป็นใคร?",
      about_p1: "ผมเป็นนักพัฒนาที่หลงใหลในการสร้างประสบการณ์ดิจิทัลที่สวยงาม ผมชอบผสมผสานศิลปะและเทคโนโลยีเพื่อสร้างสิ่งที่เป็นเอกลักษณ์",
      about_p2: "ตั้งแต่การพัฒนาเว็บไปจนถึงการเขียนโค้ดเชิงสร้างสรรค์ ผมสำรวจจุดตัดระหว่างการออกแบบและวิศวกรรมเพื่อสร้างโปรเจกต์ที่มีปฏิสัมพันธ์",
      stat_projects: "โปรเจกต์",
      stat_tech: "เทคโนโลยี",
      stat_years: "ปีประสบการณ์",
      section_skills: "ทักษะ & เทคโนโลยี",
      section_projects: "โปรเจกต์",
      section_contact: "ติดต่อเรา",
      contact_desc: "มีคำถามหรืออยากร่วมงานกัน? ติดต่อได้เลย!",
      sidebar_library: "ห้องสมุดของผม",
      sidebar_quotes: "คำคมสร้างแรงบันดาลใจ",
      sidebar_tools: "เครื่องมือ",
      sidebar_certificates: "ใบรับรอง",
      sidebar_company: "บริษัทของผม"
    }
  };

  var currentLang = "en";

  function applyLanguage(lang) {
    currentLang = lang;
    var elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Update active state on switcher
    document.querySelectorAll(".lang-option").forEach(function (opt) {
      opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
    });
  }

  // Language Switcher
  var langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("click", function () {
      var nextLang = currentLang === "en" ? "th" : "en";
      applyLanguage(nextLang);
    });
  }

  // ===== Bangkok Time Clock =====
  function updateBangkokTime() {
    var now = new Date();

    // Time
    var timeOpts = { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
    var bangkokTime = now.toLocaleString("en-US", timeOpts);
    var timeEl = document.getElementById("bangkok-time");
    if (timeEl) timeEl.textContent = bangkokTime;

    // Date with day of week
    var dateOpts = { timeZone: "Asia/Bangkok", weekday: "long", day: "numeric", month: "long" };
    var bangkokDate = now.toLocaleString(currentLang === "th" ? "th-TH" : "en-US", dateOpts);
    var dateEl = document.getElementById("bangkok-date");
    if (dateEl) dateEl.textContent = bangkokDate;

    // Year — BE and AD
    var yearOpts = { timeZone: "Asia/Bangkok", year: "numeric" };
    var adYear = parseInt(now.toLocaleString("en-US", yearOpts));
    var beYear = adYear + 543;
    var yearEl = document.getElementById("bangkok-year");
    if (yearEl) yearEl.textContent = "BE " + beYear + " / AD " + adYear;
  }

  updateBangkokTime();
  setInterval(updateBangkokTime, 1000);

  // ===== Sidebar Functionality =====
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebar-toggle");
  var sidebarClose = document.getElementById("sidebar-close");
  var sidebarOverlay = document.getElementById("sidebar-overlay");

  function openSidebar() {
    if (sidebar) sidebar.classList.add("visible");
    if (sidebarOverlay) sidebarOverlay.classList.add("visible");
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("visible");
    if (sidebarOverlay) sidebarOverlay.classList.remove("visible");
  }

  if (sidebarToggle) sidebarToggle.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("visible")) {
      closeSidebar();
    }
  });

  // ===== Sidebar Dropdown Accordion =====
  var dropdownToggles = document.querySelectorAll(".sidebar-dropdown-toggle");
  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var targetId = toggle.getAttribute("data-target");
      var content = document.getElementById(targetId);
      var parentDropdown = toggle.closest(".sidebar-dropdown");
      if (!content || !parentDropdown) return;

      var isOpen = parentDropdown.classList.contains("open");

      // Close all other dropdowns
      document.querySelectorAll(".sidebar-dropdown.open").forEach(function (dd) {
        if (dd !== parentDropdown) {
          dd.classList.remove("open");
        }
      });

      // Toggle this one
      parentDropdown.classList.toggle("open", !isOpen);
    });
  });

  // ===== Sidebar Quote Generator =====
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

  var sidebarQuoteTextEl = document.getElementById("sidebar-quote-text");
  var sidebarQuoteAuthorEl = document.getElementById("sidebar-quote-author");
  var sidebarNewQuoteBtn = document.getElementById("sidebar-new-quote-btn");
  var currentQuoteIndex = 0;

  function shuffleSidebarQuote() {
    if (!sidebarQuoteTextEl || !sidebarQuoteAuthorEl) return;
    var nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * quotes.length);
    } while (nextIndex === currentQuoteIndex && quotes.length > 1);
    currentQuoteIndex = nextIndex;
    var q = quotes[currentQuoteIndex];

    sidebarQuoteTextEl.classList.add("quote-fade-out");
    sidebarQuoteAuthorEl.classList.add("quote-fade-out");
    setTimeout(function () {
      sidebarQuoteTextEl.textContent = q.text;
      sidebarQuoteAuthorEl.innerHTML = "&mdash; " + q.author;
      sidebarQuoteTextEl.classList.remove("quote-fade-out");
      sidebarQuoteAuthorEl.classList.remove("quote-fade-out");
    }, 300);
  }

  if (sidebarNewQuoteBtn) {
    sidebarNewQuoteBtn.addEventListener("click", function (e) {
      e.preventDefault();
      shuffleSidebarQuote();
      clearInterval(quoteCycleInterval);
      quoteCycleInterval = setInterval(shuffleSidebarQuote, 12000);
    });
  }

  var quoteCycleInterval = setInterval(shuffleSidebarQuote, 12000);

  // ===== Tool Functions (Placeholders) =====
  function showToolStatus(elementId, message, isError) {
    var statusEl = document.getElementById(elementId);
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.color = isError ? "#ff6b6b" : "#4caf50";
      setTimeout(function () { if (statusEl) statusEl.textContent = ""; }, 3000);
    }
  }

  function setupToolBtn(btnId, urlId, statusId, platform) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", function () {
      var urlInput = document.getElementById(urlId);
      var url = urlInput ? urlInput.value.trim() : "";
      if (!url) {
        showToolStatus(statusId, "Please enter a " + platform + " URL", true);
        return;
      }
      showToolStatus(statusId, "Processing... (Feature coming soon)", false);
      setTimeout(function () {
        showToolStatus(statusId, "Download would start here (placeholder)", false);
      }, 1500);
    });
  }

  setupToolBtn("youtube-download-btn", "youtube-url", "youtube-status", "YouTube");
  setupToolBtn("twitter-download-btn", "twitter-url", "twitter-status", "Twitter/X");
  setupToolBtn("instagram-download-btn", "instagram-url", "instagram-status", "Instagram");
  setupToolBtn("facebook-download-btn", "facebook-url", "facebook-status", "Facebook");

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
  var video = document.querySelector(".bg-video");
  var bgVideos = [];
  var currentVideoIndex = -1;
  var videoFadeTimer = null;

  function startVideoWithFade(idx) {
    if (!video || bgVideos.length === 0) return;
    currentVideoIndex = idx;
    video.src = bgVideos[idx].url;
    video.load();
    video.play().catch(function () { });

    // Fade in
    video.style.opacity = "1";

    // After 10s visible, fade out then swap
    clearTimeout(videoFadeTimer);
    videoFadeTimer = setTimeout(function () {
      video.style.opacity = "0";
      setTimeout(function () {
        var nextIdx = pickRandom(bgVideos, currentVideoIndex);
        startVideoWithFade(nextIdx);
      }, 4000);
    }, 15000);
  }

  // ===== Background Music System (Random Shuffle) =====
  var bgMusic = document.getElementById("bg-music");
  var volSlider = document.getElementById("vol-slider");
  var volValue = document.getElementById("vol-value");
  var musicToggle = document.getElementById("music-toggle");
  var musicIcon = document.getElementById("music-icon");
  var visualizer = document.getElementById("visualizer");
  var songNameEl = document.getElementById("song-name");
  var musicPlaying = false;
  var bgMusicList = [];
  var currentMusicIndex = -1;

  if (bgMusic && volSlider) {
    bgMusic.volume = volSlider.value / 100;
  }

  function startMusic(idx) {
    if (!bgMusic || bgMusicList.length === 0) return;
    currentMusicIndex = idx;
    bgMusic.src = bgMusicList[idx].url;
    bgMusic.load();

    // Update song name
    if (songNameEl) {
      songNameEl.textContent = bgMusicList[idx].name;
    }

    var targetVol = volSlider ? volSlider.value / 100 : 0.08;
    bgMusic.volume = 0;

    var playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        musicPlaying = true;
        updateMusicUI();
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

  // When song ends, play next random
  if (bgMusic) {
    bgMusic.addEventListener("ended", function () {
      var nextIdx = pickRandom(bgMusicList, currentMusicIndex);
      if (nextIdx >= 0) startMusic(nextIdx);
    });
  }

  // ===== Load Assets from assets.json =====
  fetch("../assets.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      bgVideos = data.videos || [];
      bgMusicList = data.music || [];

      // Start random video
      if (bgVideos.length > 0) {
        var firstVideo = pickRandom(bgVideos, -1);
        startVideoWithFade(firstVideo);
      }

      // Prepare music
      if (bgMusicList.length > 0) {
        var firstMusic = pickRandom(bgMusicList, -1);
        currentMusicIndex = firstMusic;
        if (bgMusic) bgMusic.src = bgMusicList[firstMusic].url;
        if (songNameEl) songNameEl.textContent = bgMusicList[firstMusic].name;
      }
    })
    .catch(function (err) { console.error("Failed to load assets.json", err); });

  // ===== Music UI Functions =====
  function toggleMusic() {
    if (!bgMusic) return;
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
    if (!bgMusic || !musicIcon || !visualizer) return;
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

  function tryPlayMusic() {
    if (!bgMusic || (bgMusicList.length === 0 && !bgMusic.src)) return;
    startMusic(currentMusicIndex >= 0 ? currentMusicIndex : 0);
  }

  // Start music on first user interaction
  function onFirstInteraction() {
    if (!musicPlaying) tryPlayMusic();
    document.removeEventListener("click", onFirstInteraction);
    document.removeEventListener("keydown", onFirstInteraction);
    document.removeEventListener("touchstart", onFirstInteraction);
  }
  document.addEventListener("click", onFirstInteraction);
  document.addEventListener("keydown", onFirstInteraction);
  document.addEventListener("touchstart", onFirstInteraction);

  // Volume Control
  if (volSlider) {
    volSlider.addEventListener("input", function (e) {
      e.stopPropagation();
      var val = volSlider.value;
      if (bgMusic) bgMusic.volume = val / 100;
      volSlider.style.background = "linear-gradient(to right, #6c9fff " + val + "%, rgba(255,255,255,0.12) " + val + "%)";
      if (volValue) volValue.textContent = val + "%";
      updateMusicUI();
    });

    volSlider.addEventListener("click", function (e) { e.stopPropagation(); });
    volSlider.addEventListener("mousedown", function (e) { e.stopPropagation(); });

    var initVal = volSlider.value;
    volSlider.style.background = "linear-gradient(to right, #6c9fff " + initVal + "%, rgba(255,255,255,0.12) " + initVal + "%)";
  }

  // Music Toggle Button
  if (musicToggle) {
    musicToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // ===== Hero Tagline Typing =====
  var taglines = [
    "Creative Developer & Designer",
    "Building Beautiful Experiences",
    "Code \u00B7 Design \u00B7 Create"
  ];
  var taglineEl = document.getElementById("hero-tagline");
  var tIdx = 0, cIdx = 0, deleting = false;

  function typeTagline() {
    if (!taglineEl) return;
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

  window.addEventListener("scroll", function () {
    if (!navbar) return;
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

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });

    document.querySelectorAll(".mobile-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
      });
    });
  }

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

  // Try music after 1 second
  setTimeout(tryPlayMusic, 1000);

});
