// ═══════════════════════════════════════════════════
// GUUNYI HOMESTEAD — Dark Cinematic Theme JS
// ═══════════════════════════════════════════════════

(function () {
  'use strict';

  // ─── DOM Elements ───
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');
  const header = document.getElementById('siteHeader');
  const topBtn = document.getElementById('topBtn');

  // ─── MOBILE NAV ───
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'mainNav');

  function openNav() {
    nav.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.onclick = function () {
    nav.classList.contains('open') ? closeNav() : openNav();
  };

  overlay.onclick = closeNav;

  // Close nav on link click (mobile)
  Array.from(nav.getElementsByTagName('a')).forEach(function (link) {
    link.onclick = function () {
      if (window.innerWidth <= 768) closeNav();
    };
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
    }
  });

  // ─── HEADER SCROLL EFFECT ───
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header background
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 500) {
      topBtn.style.display = 'block';
    } else {
      topBtn.style.display = 'none';
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // ─── BACK TO TOP ───
  window.topFunction = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── SCROLL REVEAL ───
  var reveals = document.querySelectorAll('.reveal-on-scroll');
  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ─── TIME & WEATHER ───
  function updateTime() {
    var timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
      var now = new Date();
      timeDisplay.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  function updateDate() {
    var dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
      var now = new Date();
      var day = String(now.getDate()).padStart(2, '0');
      var month = String(now.getMonth() + 1).padStart(2, '0');
      var year = now.getFullYear();
      dateDisplay.textContent = day + '.' + month + '.' + year;
    }
  }

  function getWeatherIcon(code) {
    var map = {
      '01d': 'fa-sun', '01n': 'fa-moon',
      '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
      '03d': 'fa-cloud', '03n': 'fa-cloud',
      '04d': 'fa-clouds', '04n': 'fa-clouds',
      '09d': 'fa-cloud-rain', '09n': 'fa-cloud-rain',
      '10d': 'fa-cloud-sun-rain', '10n': 'fa-cloud-moon-rain',
      '11d': 'fa-bolt', '11n': 'fa-bolt',
      '13d': 'fa-snowflake', '13n': 'fa-snowflake',
      '50d': 'fa-smog', '50n': 'fa-smog'
    };
    return map[code] || 'fa-cloud';
  }

  async function updateWeather() {
    var weatherDisplay = document.getElementById('weatherDisplay');
    if (!weatherDisplay) return;

    try {
      var lat = -17.8;
      var lon = 31.0;
      var apiKey = 'YOUR_API_KEY';
      var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';

      var response = await fetch(url);

      if (response.ok) {
        var data = await response.json();
        var temp = Math.round(data.main.temp);
        var desc = data.weather[0].description;
        var iconClass = getWeatherIcon(data.weather[0].icon);

        weatherDisplay.innerHTML =
          '<i class="fas ' + iconClass + '"></i>' +
          '<span class="temperature">' + temp + '°C</span>' +
          '<span class="description">' + desc + '</span>';
      } else {
        showFallbackWeather(weatherDisplay);
      }
    } catch (err) {
      showFallbackWeather(weatherDisplay);
    }
  }

  function showFallbackWeather(el) {
    el.innerHTML =
      '<i class="fas fa-cloud-sun"></i>' +
      '<span class="temperature">24°C</span>' +
      '<span class="description">Partly cloudy</span>';
  }

  // ─── SMOOTH ANCHOR SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ─── INIT ───
  updateTime();
  setInterval(updateTime, 1000);
  updateDate();
  setInterval(updateDate, 60000);
  updateWeather();
  setInterval(updateWeather, 1800000);

  // Trigger initial scroll check
  onScroll();
})();