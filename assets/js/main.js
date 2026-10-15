/* Radhika Vyas · site scripts */
(function () {
  'use strict';

  /* ---------- Home: evolve / devolve ---------- */
  var evoBtn = document.getElementById('evolve-btn');
  if (evoBtn) {
    var portrait = document.getElementById('portrait');
    var now = document.getElementById('portrait-now');
    var kid = document.getElementById('portrait-kid');
    var label = document.getElementById('spec-label');
    var text = document.getElementById('spec-text');
    var young = false;

    evoBtn.addEventListener('click', function () {
      young = !young;
      now.hidden = young;
      kid.hidden = !young;
      now.style.display = young ? 'none' : 'block';
      kid.style.display = young ? 'block' : 'none';
      label.textContent = young
        ? 'Field guide · Specimen I · juvenile form'
        : 'Field guide · Specimen II · fully evolved';
      text.innerHTML = young
        ? '<i>Ursus radhika</i>, juvenile. Already practicing the growl.'
        : '<i>Ursus radhika</i>, adult form. Habitat: the lab by day, the decks by night.';
      evoBtn.textContent = young ? 'Evolve!' : 'Devolve';
      portrait.classList.remove('flash');
      void portrait.offsetWidth;
      portrait.classList.add('flash');
    });
  }

  /* ---------- Words & Pictures: filter + lightbox ---------- */
  var gallery = document.getElementById('gallery');
  if (gallery) {
    var photos = Array.prototype.slice.call(gallery.querySelectorAll('.photo'));
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var lbCount = document.getElementById('lb-count');
    var lbClose = document.getElementById('lb-close');
    var visible = photos.slice();
    var openIndex = -1;
    var lastFocus = null;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var kind = tab.getAttribute('data-filter');
        tabs.forEach(function (t) { t.setAttribute('aria-pressed', t === tab ? 'true' : 'false'); });
        photos.forEach(function (p) {
          p.hidden = !(kind === 'all' || p.getAttribute('data-kind') === kind);
        });
        visible = photos.filter(function (p) { return !p.hidden; });
      });
    });

    function show(i) {
      var n = visible.length;
      openIndex = (i + n) % n;
      var img = visible[openIndex].querySelector('img');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt');
      lbCap.textContent = visible[openIndex].querySelector('.cap').textContent;
      lbCount.textContent = (openIndex + 1) + ' of ' + n;
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }
    function close() {
      lb.hidden = true;
      openIndex = -1;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    photos.forEach(function (p) {
      p.querySelector('.frame').addEventListener('click', function () {
        open(visible.indexOf(p));
      });
    });
    document.getElementById('lb-prev').addEventListener('click', function () { show(openIndex - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { show(openIndex + 1); });
    lbClose.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(openIndex - 1);
      else if (e.key === 'ArrowRight') show(openIndex + 1);
      else if (e.key === 'Tab') {
        var f = Array.prototype.slice.call(lb.querySelectorAll('button'));
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- The Crates: records + Spotify ---------- */
  var crate = document.getElementById('crate');
  if (crate) {
    var sleeves = Array.prototype.slice.call(crate.querySelectorAll('.sleeve-btn'));
    var record = document.getElementById('record');
    var discLabel = document.getElementById('disc-label');
    var arm = document.getElementById('arm');
    var nowLabel = document.getElementById('now-label');
    var deckTitle = document.getElementById('deck-title');
    var deckSub = document.getElementById('deck-sub');
    var vibes = document.getElementById('vibes');
    var playBtn = document.getElementById('play-btn');
    var openLink = document.getElementById('open-spotify');
    var embedBox = document.getElementById('spotify-embed');
    var controller = null;
    var fallbackFrame = null;
    var playing = false;
    var current = 0;

    function embedUrl(id) {
      return 'https://open.spotify.com/embed/playlist/' + id + '?utm_source=generator&theme=0';
    }
    function setSpin(on) {
      playing = on;
      record.classList.toggle('spin', on);
      arm.classList.toggle('on', on);
      nowLabel.textContent = (on ? 'Now spinning' : 'On deck') + ' · Vol. ' + sleeves[current].getAttribute('data-vol');
      playBtn.textContent = on ? 'Lift the needle' : 'Drop the needle';
    }
    function select(i, autoplay) {
      current = i;
      var s = sleeves[i];
      var id = s.getAttribute('data-id');
      sleeves.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      deckTitle.textContent = s.getAttribute('data-title');
      deckSub.textContent = s.getAttribute('data-sub') || '';
      discLabel.className = 'disc-label ' + s.getAttribute('data-art');
      vibes.innerHTML = '';
      s.getAttribute('data-tags').split('|').forEach(function (t) {
        var li = document.createElement('li');
        li.textContent = t;
        vibes.appendChild(li);
      });
      openLink.href = 'https://open.spotify.com/playlist/' + id;
      if (controller) {
        controller.loadUri('spotify:playlist:' + id);
        if (autoplay) setTimeout(function () { controller.play(); }, 350);
      } else if (fallbackFrame) {
        fallbackFrame.src = embedUrl(id);
      }
      setSpin(!!autoplay);
    }

    sleeves.forEach(function (s, i) {
      s.addEventListener('click', function () { select(i, true); });
    });
    playBtn.addEventListener('click', function () {
      if (controller) controller.togglePlay();
      setSpin(!playing);
    });

    /* Spotify player: use the official iFrame API so the turntable follows playback.
       If it can't load, fall back to a plain embedded player. */
    function useFallback() {
      if (controller || fallbackFrame) return;
      embedBox.innerHTML = '';
      fallbackFrame = document.createElement('iframe');
      fallbackFrame.title = 'Spotify player';
      fallbackFrame.loading = 'lazy';
      fallbackFrame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      fallbackFrame.src = embedUrl(sleeves[current].getAttribute('data-id'));
      embedBox.appendChild(fallbackFrame);
    }
    window.onSpotifyIframeApiReady = function (IFrameAPI) {
      if (fallbackFrame) return;
      var target = document.createElement('div');
      embedBox.innerHTML = '';
      embedBox.appendChild(target);
      IFrameAPI.createController(target, {
        uri: 'spotify:playlist:' + sleeves[current].getAttribute('data-id'),
        width: '100%',
        height: 352
      }, function (c) {
        if (fallbackFrame) return;
        controller = c;
        c.addListener('playback_update', function (e) {
          if (e && e.data) setSpin(!e.data.isPaused);
        });
      });
    };
    var api = document.createElement('script');
    api.src = 'https://open.spotify.com/embed/iframe-api/v1';
    api.async = true;
    api.onerror = useFallback;
    document.body.appendChild(api);
    setTimeout(function () { if (!controller) useFallback(); }, 7000);

    select(0, false);
  }
})();
