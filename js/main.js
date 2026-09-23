(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var onScroll = function () { root.classList.toggle('header-solid', window.scrollY > 80); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById('nav-toggle');
  var overlay = document.getElementById('nav-overlay');
  var lastFocus = null;
  var setMenu = function (open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    toggle.classList.toggle('is-active', open);
    overlay.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) {
      lastFocus = (document.activeElement && document.activeElement !== document.body) ? document.activeElement : toggle;
      var first = overlay.querySelector('a');
      if (first) first.focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }
  };
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  overlay.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var links = overlay.querySelectorAll('a');
    if (!links.length) return;
    var first = links[0];
    var last = links[links.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var reveals = document.querySelectorAll('.reveal');
  var addVisible = function () { reveals.forEach(function (el) { el.classList.add('is-visible'); }); };
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) {
      var kids = el.parentElement.children;
      var idx = 0;
      for (var i = 0; i < kids.length; i += 1) {
        if (kids[i] === el) break;
        if (kids[i].classList.contains('reveal')) idx += 1;
      }
      el.style.setProperty('--rd', Math.min(idx * 110, 450) + 'ms');
      io.observe(el);
    });
  } else {
    addVisible();
  }

  var hero = document.getElementById('inicio');
  var heroNum = document.querySelector('.hero-num');
  var heroCircle = document.querySelector('.hero-circle');
  var heroPhoto = document.querySelector('.hero-photo');
  var lg = window.matchMedia('(min-width: 1024px)');
  var ticking = false;
  var drift = function () {
    ticking = false;
    if (!reduce && lg.matches && hero && heroNum) {
      var p = Math.min(window.scrollY / (hero.offsetHeight || 1), 1);
      heroNum.style.setProperty('--dy', Math.round(p * 28) + 'px');
      if (heroCircle) heroCircle.style.setProperty('--dy', Math.round(p * -18) + 'px');
      if (heroPhoto) heroPhoto.style.setProperty('--dy', Math.round(p * 8) + 'px');
    }
  };
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(drift); }
  }, { passive: true });
  drift();
})();