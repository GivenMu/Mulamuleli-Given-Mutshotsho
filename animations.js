/* ======================================================================
   GIVENDEV Portfolio — Animation Controller
   Pair with animations.css. Add before </body>:
   <script src="animations.js"></script>
   Works on touch and pointer devices; no dependencies.
   ====================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* 1. Hero entrance — trigger on next frame so the transition runs */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('page-loaded');
      });
    });

    /* 2. Scroll-reveal for anything with [data-animate], staggered by parent */
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-animate]'));
    var parentCounts = new Map();
    items.forEach(function (el) {
      var parent = el.parentElement;
      var idx = parentCounts.get(parent) || 0;
      el.style.transitionDelay = (Math.min(idx, 8) * 0.08) + 's';
      parentCounts.set(parent, idx + 1);
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { observer.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in-view'); });
    }

    /* 3. Scroll progress bar (auto-creates the element if it's missing) */
    var bar = document.getElementById('scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scroll-progress';
      document.body.appendChild(bar);
    }
    function updateProgressBar() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgressBar, { passive: true });
    window.addEventListener('resize', updateProgressBar);
    updateProgressBar();

    /* 4. Mobile nav toggle — class-based, animated via CSS (see animations.css) */
    var toggleBtn = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('nav.links');
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', function () {
        navLinks.classList.toggle('nav-open');
      });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.classList.remove('nav-open');
        });
      });
      document.addEventListener('click', function (e) {
        if (!navLinks.classList.contains('nav-open')) return;
        if (navLinks.contains(e.target) || toggleBtn.contains(e.target)) return;
        navLinks.classList.remove('nav-open');
      });
    }
  });
})();
