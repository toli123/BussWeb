/* ==========================================================================
   Bali Bus – main site script
   - language switcher (MK / SQ / EN)
   - mobile navigation
   - cookie consent banner (consent stored in a real cookie)
   - dynamic route cards + timetable
   - form validation (contact, trip planner, newsletter)
   ========================================================================== */
(function () {
  "use strict";

  var LANGS = ["mk", "sq", "en"];
  var STORAGE_LANG = "balibus_lang";
  var STORAGE_COOKIES = "balibus_cookie_consent";   // fallback when cookies are unavailable (file://)
  var CONSENT_COOKIE = "balibus_consent";            // "all" | "necessary"
  var CONSENT_MAX_AGE = 180 * 24 * 60 * 60;          // 180 days

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function safeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }
  function safeRemove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var ICONS = {
    timer: '<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
  };
  function icon(name) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + '</svg>'; }
  function countryBadge(code) { return '<span class="cc">' + code.toUpperCase() + '</span>'; }
  window.baliIcon = icon;
  window.baliCountryBadge = countryBadge;

  /* ---------- cookie consent ---------- */
  function readConsent() {
    var m = document.cookie.match(/(?:^|;\s*)balibus_consent=([^;]*)/);
    var v = m ? decodeURIComponent(m[1]) : safeGet(STORAGE_COOKIES);
    if (v === "accepted") v = "all";          // values written by older versions
    if (v === "declined") v = "necessary";
    return v === "all" || v === "necessary" ? v : null;
  }
  function writeConsent(v) {
    document.cookie = CONSENT_COOKIE + "=" + v + "; max-age=" + CONSENT_MAX_AGE + "; path=/; SameSite=Lax";
    safeSet(STORAGE_COOKIES, v);
  }
  function prefsAllowed() { return readConsent() === "all"; }

  /* ---------- language ---------- */
  function urlLang() {
    var p = new URLSearchParams(location.search).get("lang");
    return p && LANGS.indexOf(p) !== -1 ? p : null;
  }

  function detectLang() {
    var fromUrl = urlLang();
    if (fromUrl) return fromUrl;
    var saved = prefsAllowed() ? safeGet(STORAGE_LANG) : null;
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("mk") === 0) return "mk";
    if (nav.indexOf("sq") === 0) return "sq";
    return "en";
  }

  var currentLang = detectLang();

  function t(key) {
    var dict = window.BALI_I18N || {};
    var d = dict[currentLang] || {};
    if (d[key] !== undefined) return d[key];
    if (dict.en && dict.en[key] !== undefined) return dict.en[key];
    return key;
  }
  window.baliT = t;
  window.baliLang = function () { return currentLang; };

  // Adds ?lang=xx to an internal page link ("timetable.html?to=ohrid#x"), so the
  // chosen language survives navigation even when preference storage is declined.
  function withLang(href) {
    var hash = "", i = href.indexOf("#");
    if (i !== -1) { hash = href.slice(i); href = href.slice(0, i); }
    var q = href.indexOf("?");
    var path = q === -1 ? href : href.slice(0, q);
    var params = new URLSearchParams(q === -1 ? "" : href.slice(q + 1));
    params.set("lang", currentLang);
    return path + "?" + params.toString() + hash;
  }
  window.baliUrl = withLang;

  function localizeLinks() {
    $$("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (/^[\w-]+\.html(?:[?#]|$)/.test(href)) a.setAttribute("href", withLang(href));
    });
    if (history.replaceState) {
      var params = new URLSearchParams(location.search);
      params.set("lang", currentLang);
      try { history.replaceState(null, "", location.pathname + "?" + params.toString() + location.hash); } catch (e) { /* file:// in some browsers */ }
    }
  }

  function storeLang() {
    if (prefsAllowed()) safeSet(STORAGE_LANG, currentLang);
    else safeRemove(STORAGE_LANG);
  }

  function applyLang(lang) {
    currentLang = lang;
    storeLang();
    document.documentElement.setAttribute("lang", lang);

    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (val !== key) el.textContent = val;
    });
    $$("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    $$("[data-i18n-title]").forEach(function (el) {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
    $$("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    $$(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });

    renderRouteCards();
    renderTimetable();
    fillDestinationSelects();
    localizeLinks();
    document.dispatchEvent(new CustomEvent("balilangchange", { detail: { lang: lang } }));
  }

  /* ---------- navigation ---------- */
  function initNav() {
    var toggle = $(".nav-toggle");
    var links = $(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav-links a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
    });
    $$(".lang-switch button").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
    });
  }

  /* ---------- cookie banner ---------- */
  function initCookies() {
    var banner = $("#cookie-banner");
    if (!banner) return;
    var prefs = $("#cookie-prefs");
    var prefsBox = $("#cookie-opt-prefs");
    var customize = $("#cookie-customize");
    var save = $("#cookie-save");

    function showSettings(open) {
      if (prefs) prefs.hidden = !open;
      if (save) save.hidden = !open;
      if (customize) customize.hidden = open;
    }
    function openBanner(withSettings) {
      if (prefsBox) prefsBox.checked = prefsAllowed();
      showSettings(!!withSettings);
      banner.classList.add("show");
    }
    function choose(v) {
      writeConsent(v);
      storeLang();
      banner.classList.remove("show");
    }

    if (!readConsent()) openBanner(false);
    var accept = $("#cookie-accept");
    var decline = $("#cookie-decline");
    if (accept) accept.addEventListener("click", function () { choose("all"); });
    if (decline) decline.addEventListener("click", function () { choose("necessary"); });
    if (customize) customize.addEventListener("click", function () { showSettings(true); });
    if (save) save.addEventListener("click", function () { choose(prefsBox && prefsBox.checked ? "all" : "necessary"); });
    var reset = $("#cookie-reset");
    if (reset) reset.addEventListener("click", function (e) {
      e.preventDefault();
      openBanner(true);
    });
  }

  /* ---------- route cards ---------- */
  function routeCardHTML(r) {
    var c = BALI_COUNTRIES[r.country];
    var intl = r.country !== "mk";
    return '<article class="card route-card' + (intl ? ' intl' : '') + '" data-route="' + r.id + '">' +
      '<div class="route-top"><h3>' + esc(BALI_HUB.name[currentLang]) + ' → ' + esc(r.name[currentLang]) + '</h3><span title="' + esc(c.name[currentLang]) + '">' + countryBadge(r.country) + '</span></div>' +
      '<div class="meta"><span>' + icon("timer") + esc(r.duration) + '</span><span>' + icon("pin") + r.km + ' km</span><span>' + icon("calendar") + esc(BALI_DAYS[r.days][currentLang]) + '</span></div>' +
      '<div class="meta"><span>' + esc(t("route.via")) + ': ' + esc(r.via[currentLang]) + '</span></div>' +
      '<div class="times">' + r.departures.map(function (d) { return '<span class="pill' + (intl ? ' intl' : '') + '">' + d + '</span>'; }).join("") + '</div>' +
      '<div class="route-top"><span class="price">' + esc(baliFormatPrice(r)) + '</span>' +
      '<a class="btn btn-outline btn-sm" href="' + withLang("timetable.html?to=" + r.id) + '">' + esc(t("route.details")) + '</a></div>' +
      '</article>';
  }

  function renderRouteCards() {
    $$("[data-route-cards]").forEach(function (box) {
      var spec = box.getAttribute("data-route-cards"); // "popular" | "mk" | "al" | "de" | "ch" | "all"
      var list = BALI_ROUTES.slice();
      if (spec === "popular") {
        var ids = ["skopje", "ohrid", "tirana", "munich", "zurich", "tetovo"];
        list = ids.map(function (id) { return BALI_ROUTES.filter(function (r) { return r.id === id; })[0]; });
      } else if (spec !== "all") {
        list = list.filter(function (r) { return r.country === spec; });
      }
      box.innerHTML = list.map(routeCardHTML).join("");
    });
  }

  /* ---------- destination selects ---------- */
  function fillDestinationSelects() {
    var from = $("#planner-from");
    if (from) from.value = BALI_HUB.name[currentLang];
    $$("select[data-destinations]").forEach(function (sel) {
      var prev = sel.value;
      var html = '<option value="">' + esc(t("planner.choose")) + '</option>';
      Object.keys(BALI_COUNTRIES).forEach(function (code) {
        html += '<optgroup label="' + esc(BALI_COUNTRIES[code].name[currentLang]) + '">';
        BALI_ROUTES.filter(function (r) { return r.country === code; }).forEach(function (r) {
          html += '<option value="' + r.id + '">' + esc(r.name[currentLang]) + '</option>';
        });
        html += '</optgroup>';
      });
      sel.innerHTML = html;
      if (prev) sel.value = prev;
    });
    $$("select[data-countries]").forEach(function (sel) {
      var prev = sel.value;
      var html = '<option value="">' + esc(t("tt.allCountries")) + '</option>';
      Object.keys(BALI_COUNTRIES).forEach(function (code) {
        html += '<option value="' + code + '">' + esc(BALI_COUNTRIES[code].name[currentLang]) + '</option>';
      });
      sel.innerHTML = html;
      if (prev) sel.value = prev;
    });
  }

  /* ---------- timetable ---------- */
  function renderTimetable() {
    var tbody = $("#timetable-body");
    if (!tbody) return;
    var q = ($("#tt-search") ? $("#tt-search").value : "").trim().toLowerCase();
    var country = $("#tt-country") ? $("#tt-country").value : "";
    var day = $("#tt-day") ? $("#tt-day").value : "";
    var html = "";
    var count = 0;

    Object.keys(BALI_COUNTRIES).forEach(function (code) {
      if (country && country !== code) return;
      var rows = BALI_ROUTES.filter(function (r) {
        if (r.country !== code) return false;
        if (day !== "" && BALI_DAY_CODES[r.days].indexOf(parseInt(day, 10)) === -1) return false;
        if (q) {
          var hay = [r.name.en, r.name.mk, r.name.sq, r.via.en, r.via.mk, r.via.sq].join(" ").toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
      if (!rows.length) return;
      html += '<tr class="country-head"><td colspan="7">' + countryBadge(code) + ' ' + esc(BALI_COUNTRIES[code].name[currentLang]) + '</td></tr>';
      rows.forEach(function (r) {
        count++;
        html += '<tr id="row-' + r.id + '">' +
          '<td><strong>' + esc(r.name[currentLang]) + '</strong></td>' +
          '<td>' + esc(r.via[currentLang]) + '</td>' +
          '<td><div class="times">' + r.departures.map(function (d) { return '<span>' + d + '</span>'; }).join("") + '</div></td>' +
          '<td>' + esc(BALI_DAYS[r.days][currentLang]) + '</td>' +
          '<td>' + esc(r.duration) + '</td>' +
          '<td>' + r.km + ' km</td>' +
          '<td><strong>' + esc(baliFormatPrice(r)) + '</strong></td>' +
          '</tr>';
      });
    });
    if (!count) html = '<tr><td colspan="7" class="center muted">' + esc(t("tt.noResults")) + '</td></tr>';
    tbody.innerHTML = html;
    var counter = $("#tt-count");
    if (counter) counter.textContent = count;
  }

  function initTimetable() {
    if (!$("#timetable-body")) return;
    ["#tt-search", "#tt-country", "#tt-day"].forEach(function (s) {
      var el = $(s);
      if (el) el.addEventListener("input", renderTimetable);
      if (el) el.addEventListener("change", renderTimetable);
    });
    // highlight / pre-fill from ?to=  &date=
    var params = new URLSearchParams(location.search);
    var to = params.get("to");
    var date = params.get("date");
    if (date && $("#tt-day")) {
      var d = new Date(date);
      if (!isNaN(d.getTime())) $("#tt-day").value = String(d.getDay());
    }
    if (to) {
      var r = BALI_ROUTES.filter(function (x) { return x.id === to; })[0];
      if (r && $("#tt-search")) $("#tt-search").value = r.name.en;
    }
    renderTimetable();
    if (to) {
      setTimeout(function () {
        var row = $("#row-" + to);
        if (row) { row.scrollIntoView({ behavior: "smooth", block: "center" }); row.classList.add("highlight"); }
      }, 200);
    }
  }

  /* ---------- trip planner ---------- */
  function initPlanner() {
    var form = $("#planner-form");
    if (!form) return;
    var dateInput = $("#planner-date");
    if (dateInput) {
      var today = new Date();
      dateInput.value = today.toISOString().slice(0, 10);
      dateInput.min = dateInput.value;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = $("#planner-to").value;
      if (!to) { $("#planner-to").focus(); return; }
      var date = dateInput ? dateInput.value : "";
      location.href = withLang("timetable.html?to=" + encodeURIComponent(to) + "&date=" + encodeURIComponent(date));
    });
  }

  /* ---------- forms ---------- */
  function validateField(field) {
    var input = field.querySelector("input, textarea, select");
    if (!input) return true;
    var ok = true;
    var v = input.value.trim();
    if (input.required && (input.type === "checkbox" ? !input.checked : !v)) ok = false;
    if (ok && input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ok = false;
    if (ok && input.type === "tel" && v && !/^[+\d][\d\s\-()]{5,}$/.test(v)) ok = false;
    if (ok && input.minLength > 0 && v.length < input.minLength) ok = false;
    field.classList.toggle("invalid", !ok);
    return ok;
  }

  function initForms() {
    $$("form[data-validate]").forEach(function (form) {
      form.setAttribute("novalidate", "novalidate");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fields = $$(".field", form);
        var allOk = fields.map(validateField).every(Boolean);
        var msg = $(".form-msg", form);
        if (!allOk) {
          if (msg) { msg.classList.remove("success"); msg.classList.add("error"); msg.textContent = t("form.error"); }
          var first = $(".field.invalid input, .field.invalid textarea, .field.invalid select", form);
          if (first) first.focus();
          return;
        }
        // No backend on the static host: simulate a successful send.
        var btn = $("button[type=submit]", form);
        if (btn) { btn.disabled = true; }
        setTimeout(function () {
          if (msg) { msg.classList.remove("error"); msg.classList.add("success"); msg.textContent = t(form.getAttribute("data-success") || "form.success"); }
          form.reset();
          if (btn) btn.disabled = false;
        }, 500);
      });
      $$(".field input, .field textarea, .field select", form).forEach(function (input) {
        input.addEventListener("blur", function () { validateField(input.closest(".field")); });
      });
    });
  }

  /* ---------- misc ---------- */
  function initMisc() {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    var top = $(".back-top");
    if (top) {
      window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 500); });
      top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    }
    // image fallback for hot-linked photos
    $$("img[data-fallback]").forEach(function (img) {
      img.addEventListener("error", function () {
        if (img.src.indexOf(img.getAttribute("data-fallback")) === -1) img.src = img.getAttribute("data-fallback");
      });
    });
    // open a collapsed section when the URL points at it (routes.html#germany)
    var target = location.hash && document.getElementById(location.hash.slice(1));
    if (target && target.tagName === "DETAILS") target.open = true;
    // route cards -> timetable link
    document.addEventListener("click", function (e) {
      var card = e.target.closest && e.target.closest(".route-card");
      if (card && !e.target.closest("a")) location.href = withLang("timetable.html?to=" + card.getAttribute("data-route"));
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initCookies();
    initForms();
    initPlanner();
    fillDestinationSelects();
    initTimetable();
    initMisc();
    applyLang(currentLang);
  });
})();
