/* media.js — background video + music player, shared by the login page and the homepage.

   Usage:  var media = SFSMedia.create({ assetsUrl: "assets/media.json" });
           media.tryPlayMusic();   // start music (respects autoplay rules and user pauses)

   Expects these elements on the page: video.bg-video, #bg-music, #vol-slider, #vol-value,
   #music-toggle, #music-icon, #visualizer, #song-name. */
(function () {
  "use strict";

  var ICON_MUTED = "🔇", ICON_LOW = "🔉", ICON_HIGH = "🔊";
  var VIDEO_SHOW_MS = 15000, VIDEO_FADE_MS = 4000, VIDEO_RETRY_MS = 1500, MUSIC_RETRY_MS = 800;

  // Random index that is not the same as the last one
  function pickRandom(list, last) {
    if (list.length === 0) return -1;
    if (list.length === 1) return 0;
    var next;
    do { next = Math.floor(Math.random() * list.length); } while (next === last);
    return next;
  }

  function create(options) {
    var $ = function (id) { return document.getElementById(id); };
    var video = document.querySelector(".bg-video");
    var music = $("bg-music");
    var slider = $("vol-slider");
    var volValue = $("vol-value");
    var toggle = $("music-toggle");
    var icon = $("music-icon");
    var visualizer = $("visualizer");
    var songName = $("song-name");

    var videos = [], tracks = [];
    var videoIndex = -1, trackIndex = -1;
    var videoTimer = null, videoFailStreak = 0, videoBlocked = false;
    var fadeInterval = null, musicFailStreak = 0;
    var playing = false, requested = false, userPaused = false;

    /* ---------- Background video ---------- */
    function clearVideoTimer() { clearTimeout(videoTimer); }

    function playVideo(idx) {
      if (!video || idx < 0) return;
      clearVideoTimer();
      videoIndex = idx;
      video.src = videos[idx].url;
      video.load();
      video.play().then(function () {
        videoFailStreak = 0;
      }).catch(function (err) {
        if (!err) return;
        // AbortError: a newer load() interrupted this play() — not a failure.
        // NotAllowedError: autoplay blocked (e.g. iOS Low Power Mode) — wait for a tap.
        if (err.name === "NotAllowedError") { videoBlocked = true; clearVideoTimer(); }
        // Broken files are handled once, by the "error" listener below.
      });
      video.style.opacity = "1";

      // Show for a while, fade out, then swap to another video
      videoTimer = setTimeout(function () {
        video.style.opacity = "0";
        videoTimer = setTimeout(function () { playVideo(pickRandom(videos, videoIndex)); }, VIDEO_FADE_MS);
      }, VIDEO_SHOW_MS);
    }

    if (video) {
      // Skip broken videos after a short pause; give up once every video failed in a row.
      // (Retrying instantly used to freeze the whole page.)
      video.addEventListener("error", function () {
        if (videos.length === 0) return;
        videoFailStreak++;
        clearVideoTimer();
        video.style.opacity = "0";
        if (videoFailStreak >= videos.length) {
          console.warn("All background videos failed to load; stopping.");
          return;
        }
        videoTimer = setTimeout(function () { playVideo(pickRandom(videos, videoIndex)); }, VIDEO_RETRY_MS);
      });
    }

    /* ---------- Music ---------- */
    function updateUI() {
      var vol = music.volume;
      var on = playing && vol > 0;
      icon.textContent = !on ? ICON_MUTED : (vol < 0.4 ? ICON_LOW : ICON_HIGH);
      visualizer.classList.toggle("active", on);
    }

    function showTrackName(idx) {
      if (songName) songName.textContent = tracks[idx].name;
    }

    function loadTrack(idx) {
      trackIndex = idx;
      music.src = tracks[idx].url;
      showTrackName(idx);
    }

    function startTrack(idx) {
      if (idx < 0) return;
      clearInterval(fadeInterval);
      loadTrack(idx);
      music.load();
      var target = slider.value / 100;
      music.volume = 0;
      music.play().then(function () {
        playing = true;
        musicFailStreak = 0;
        updateUI();
        fadeInterval = setInterval(function () {   // gentle fade-in
          if (music.volume < target) music.volume = Math.min(target, music.volume + 0.005);
          else clearInterval(fadeInterval);
        }, 50);
      }).catch(function (err) {
        if (err && err.name === "AbortError") return;
        playing = false;
        music.volume = target;
        updateUI();
      });
    }

    // Never restarts a song that is playing, or one the user paused on purpose
    function tryPlayMusic() {
      if (tracks.length === 0 || playing || userPaused) return;
      requested = true;
      startTrack(trackIndex >= 0 ? trackIndex : 0);
    }

    function toggleMusic() {
      requested = true;
      if (playing) {
        userPaused = true;
        clearInterval(fadeInterval);
        music.pause();
        playing = false;
        updateUI();
        return;
      }
      userPaused = false;
      if (!music.currentSrc) { tryPlayMusic(); return; }
      music.play().then(function () {
        playing = true;
        updateUI();
      }).catch(function () { console.log("Music play failed"); });
    }

    music.addEventListener("ended", function () {
      startTrack(pickRandom(tracks, trackIndex));
    });

    // A song that fails to load (e.g. expired link) is skipped
    music.addEventListener("error", function () {
      if (tracks.length === 0) return;
      musicFailStreak++;
      playing = false;
      updateUI();
      if (musicFailStreak >= tracks.length) {
        if (songName) songName.textContent = "No audio available";
        return;
      }
      var next = pickRandom(tracks, trackIndex);
      setTimeout(function () {
        if (requested && !userPaused) startTrack(next);
        else loadTrack(next);   // not playing yet: just prepare the next song
      }, MUSIC_RETRY_MS);
    });

    /* ---------- Controls ---------- */
    function paintSlider(val) {
      slider.style.background = "linear-gradient(to right, #6c9fff " + val + "%, rgba(255,255,255,0.12) " + val + "%)";
      if (volValue) volValue.textContent = val + "%";
    }

    slider.addEventListener("input", function (e) {
      e.stopPropagation();
      clearInterval(fadeInterval);   // user's choice wins over the fade-in
      music.volume = slider.value / 100;
      paintSlider(slider.value);
      updateUI();
    });
    slider.addEventListener("click", function (e) { e.stopPropagation(); });
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMusic();
    });

    music.volume = slider.value / 100;
    paintSlider(slider.value);

    // Browsers only allow sound after the first tap/click/key.
    // Capture phase so it also runs when a button stops the click from bubbling.
    function onFirstInteraction() {
      ["click", "keydown", "touchstart"].forEach(function (type) {
        document.removeEventListener(type, onFirstInteraction, true);
      });
      tryPlayMusic();
      if (videoBlocked && videoIndex >= 0) {
        videoBlocked = false;
        playVideo(videoIndex);
      }
    }
    ["click", "keydown", "touchstart"].forEach(function (type) {
      document.addEventListener(type, onFirstInteraction, true);
    });

    /* ---------- Load the playlist ---------- */
    fetch(options.assetsUrl)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        videos = data.videos || [];
        tracks = data.music || [];
        if (videos.length) playVideo(pickRandom(videos, -1));
        if (tracks.length) loadTrack(pickRandom(tracks, -1));
      })
      .catch(function (err) {
        console.error("Failed to load " + options.assetsUrl, err);
        if (songName) songName.textContent = "No audio available";
      });

    return { tryPlayMusic: tryPlayMusic };
  }

  window.SFSMedia = { create: create };
})();
