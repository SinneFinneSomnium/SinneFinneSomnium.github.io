/* home.js — Home/Homepage.html: language switch, clock, sidebar, quotes, typing tagline,
   navbar, counters. Background video + music: media.js. Scroll reveal: reveal.js. */
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
      about_p1: 'Hi! Hello there i\'m SinneFinneSomnium, im Thais and a first years student that are studying in BBA but got so many interests in technology, Ai, Science, Space, Physics, Arts, Poetry, History, Philosophy, Programming , Military equipment like Tanks and Aircraft, weird right?, yeahhh im kinda "Jack of all trade" guy but you know what?, "jack of all trades, master of none, most of time better than master of one" eh? haha.',
      about_p2: "Soooo That's it, i think, thanks for reading till this Have a good day!",
      stat_projects: "Projects",
      stat_tech: "Technologies",
      stat_years: "Years Experience",
      section_skills: "Skills & Technologies",
      section_projects: "Projects",
      section_contact: "Get In Touch",
      contact_desc: "Have a question or want to work together? Feel free to reach out!",
      sidebar_projects: "My Projects",
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
      hero_greeting: "สวัสดีค้าบบบบ ผมคือ",
      clock_label: "เวลากรุงเทพฯ(GMT+7)",
      btn_projects: "ดูโปรเจกต์",
      btn_contact: "ติดต่อเรา",
      btn_shuffle: "สุ่มคำคม",
      scroll: "เลื่อนลง",
      section_about: "เกี่ยวกับเรา",
      about_title: "ผมเป็นใคร?(ไครอะ?)",
      about_p1: 'สวัสดีคมับบ เรียกเราว่า SinneFinneSomnium ก็ได้ เราเป็นคนไทยและเป็นนักศึกษาปี 1 ที่กำลังศึกษาในสาขาบริหารธุรกิจ แต่มีความสนใจมากมายในด้านเทคโนโลยี, AI, วิทยาศาสตร์, อวกาศ, ฟิสิกส์, ศิลปะ, บทกวี, ประวัติศาสตร์, ปรัชญา, การเขียนโปรแกรม, รวมถึงยุทโธปกรณ์ทางทหาร เช่น รถถังและเครื่องบิน แปลกป้ะ?(War thunder 4000ชม. พาไป) ใช่แล้ว เราเป็นคนประเภท "Jack Of all trade?" แต่ก็ "jack of all trades, master of none, most of time better than master of one" จริงป้ะ? 5555555',
      about_p2: "ก็...    จบแค่นี้แหละมั้ง ขอบคุณที่อ่านมาจนถึงตรงนี้นะ ขอให้โชคดีมีชัยนะค้าบบบบ!",
      stat_projects: "โปรเจกต์",
      stat_tech: "เทคโนโลยี",
      stat_years: "ปีประสบการณ์",
      section_skills: "ทักษะ & เทคโนโลยี",
      section_projects: "โปรเจกต์",
      section_contact: "ติดต่อมาเยยยย",
      contact_desc: "มีคำถามหรืออยากร่วมงานกัน? ติดต่อได้เลย!",
      sidebar_projects: "โปรเจกต์ของผม",
      sidebar_library: "ห้องสมุดรวมหยังจื๋อ",
      sidebar_quotes: "คำคมสร้างแรงบันดาลใจ",
      sidebar_tools: "เครื่องมือ",
      sidebar_certificates: "ใบรับรอง(ผลงานนั่นแหละ)",
      sidebar_company: "บริษัทของผม(กำลังทำอยู่)"
    }
  };

  var currentLang = "en";

  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem("sfs-lang", lang); } catch (e) { }
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

  // Restore the language chosen on a previous visit
  try {
    var savedLang = localStorage.getItem("sfs-lang");
    if (savedLang === "th" || savedLang === "en") applyLanguage(savedLang);
  } catch (e) { }

  // ===== Bangkok Time Clock =====
  function updateBangkokTime() {
    var now = new Date();

    // Time
    var timeOpts = { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
    var bangkokTime = now.toLocaleString("en-US", timeOpts);
    var timeEl = document.getElementById("bangkok-time");
    if (timeEl) timeEl.textContent = bangkokTime ;

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
  // ==========================================
  // 1. ปรัชญาสายลึก (Nietzsche, Camus, Dostoevsky) - 8 Quotes
  // แนวเผชิญหน้ากับความว่างเปล่า การสร้างความหมาย และความจริงของชีวิต
  // ==========================================
  { text: "And if you gaze long into an abyss, the abyss also gazes into you.", author: "Friedrich Nietzsche" },
  { text: "He who has a why to live for can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.", author: "Fyodor Dostoevsky" },
  { text: "Man is a fickle and disreputable creature and, perhaps, like a chess player, loves the process of the game, not the end of it.", author: "Fyodor Dostoevsky" },
  { text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", author: "Albert Camus" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
  { text: "Should I kill myself, or have a cup of coffee?", author: "Albert Camus" },
  { text: "Man is the only creature who refuses to be what he is.", author: "Albert Camus" },

  // ==========================================
  // 2. ปรัชญาการเมืองและการควบคุมตนเอง (Machiavelli & Stoic) - 8 Quotes
  // แนวสัจนิยม อำนาจ และความสงบทางจิตใจในการควบคุมสิ่งรอบตัว
  // ==========================================
  { text: "Everyone sees what you appear to be, few experience what you really are.", author: "Niccolò Machiavelli" },
  { text: "If an injury has to be done to a man it should be so severe that his vengeance need not be feared.", author: "Niccolò Machiavelli" },
  { text: "It is not titles that honor men, but men that honor titles.", author: "Niccolò Machiavelli" },
  { text: "It is much safer to be feared than loved, when one of the two must be lacking.", author: "Niccolò Machiavelli" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius" },
  { text: "He who fears death will never do anything worth of a man who is alive.", author: "Seneca" },

  // ==========================================
  // 3. บุคคลในประวัติศาสตร์ (Historical Figures) - 8 Quotes
  // ผู้นำ นักคิด และผู้เปลี่ยนโลกผ่านกลยุทธ์และความทะเยอทะยาน
  // ==========================================
  { text: "I came, I saw, I conquered.", author: "Julius Caesar" },
  { text: "There is nothing impossible to him who will try.", author: "Alexander the Great" },
  { text: "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.", author: "Alexander the Great" },
  { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu" },
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
  { text: "History is a set of lies agreed upon.", author: "Napoleon Bonaparte" },
  { text: "An iron curtain has descended across the Continent.", author: "Winston Churchill" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },

  // ==========================================
  // 4. วาทะจากภาพยนตร์ระดับตำนาน (Cinema Wisdom) - 8 Quotes
  // เน้นสปีชเปลี่ยนโลกของ Charlie Chaplin และประโยคทรงพลังจากหนังชั้นยอด
  // ==========================================
  { text: "We think too much and feel too little. More than machinery we need humanity.", author: "Charlie Chaplin (The Great Dictator)" },
  { text: "Don't give yourselves to these unnatural men - machine men with machine minds and machine hearts!", author: "Charlie Chaplin (The Great Dictator)" },
  { text: "You, the people, have the power to make this life free and beautiful, to make this life a wonderful adventure.", author: "Charlie Chaplin (The Great Dictator)" },
  { text: "Why do we fall, sir? So that we can learn to pick ourselves up.", author: "Alfred Pennyworth (The Dark Knight Trilogy)" },
  { text: "Great men are not born great, they grow great.", author: "Vito Corleone (The Godfather)" },
  { text: "Do, or do not. There is no try.", author: "Yoda (Star Wars)" },
  { text: "The things you own end up owning you.", author: "Tyler Durden (Fight Club)" },
  { text: "It is not our abilities that show what we truly are… it is our choices.", author: "Albus Dumbledore (Harry Potter)" },

  // ==========================================
  // 5. นักคิดและนักจิตวิทยาร่วมสมัย (Peterson & Greene) - 8 Quotes
  // แนวการพัฒนาตนเอง จิตวิทยาเชิงลึก และสัจนิยมในสังคมมนุษย์
  // ==========================================
  { text: "Set your house in perfect order before you criticize the world.", author: "Jordan Peterson" },
  { text: "Compare yourself to who you were yesterday, not to who someone else is today.", author: "Jordan Peterson" },
  { text: "If you don't say what you think then you kill your unborn self.", author: "Jordan Peterson" },
  { text: "In order to be able to think, you have to risk being offensive.", author: "Jordan Peterson" },
  { text: "When you show yourself to the world and display your talents, you naturally stir up all kinds of resentment, envy, and other manifestations of insecurity.", author: "Robert Greene (The 48 Laws of Power)" },
  { text: "Never outshine the master.", author: "Robert Greene (The 48 Laws of Power)" },
  { text: "The future belongs to those who learn more skills and combine them in creative ways.", author: "Robert Greene (Mastery)" },
  { text: "Boldness makes even the smallest animal dangerous in its environment.", author: "Robert Greene (The 50th Law)" }
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

  // ===== Background video + music (shared, see media.js) =====
  var media = SFSMedia.create({ assetsUrl: "../assets/media.json" });
  setTimeout(media.tryPlayMusic, 1000);

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

  // ===== Navbar Scroll Effect (at most once per frame) =====
  var navbar = document.getElementById("navbar");
  var navSections = Array.prototype.slice.call(document.querySelectorAll(".section"));
  var navLinks = document.querySelectorAll(".nav-link");
  var scrollQueued = false;

  function onScroll() {
    scrollQueued = false;
    var y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 60);
    navSections.forEach(function (sec) {
      var top = sec.offsetTop - 120;
      if (y >= top && y < top + sec.offsetHeight) {
        var href = "#" + sec.id;
        navLinks.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === href); });
      }
    });
  }
  window.addEventListener("scroll", function () {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

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

});
