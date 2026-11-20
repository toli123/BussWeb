/* ==========================================================================
   Bali Bus – Leaflet route map (routes.html) and station map (contact.html)
   ========================================================================== */
(function () {
  "use strict";
  if (typeof L === "undefined") return;

  var TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  var ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function lang() { return window.baliLang ? window.baliLang() : "en"; }
  function t(k) { return window.baliT ? window.baliT(k) : k; }
  function url(h) { return window.baliUrl ? window.baliUrl(h) : h; }
  function icon(n) { return window.baliIcon ? window.baliIcon(n) : ""; }
  function cssVar(name, fallback) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback; }
  var BRAND = cssVar("--brand", "#1d3c6e");
  var INTL = cssVar("--intl", "#0f7f7a");
  function badge(c) { return window.baliCountryBadge ? window.baliCountryBadge(c) : c.toUpperCase(); }

  /* ------------------------------------------------------------------ */
  /* Route map                                                           */
  /* ------------------------------------------------------------------ */
  var mapEl = document.getElementById("map");
  if (mapEl) {
    var map = L.map("map", { scrollWheelZoom: false }).setView([44.5, 15], 5);
    L.tileLayer(TILES, { attribution: ATTR, maxZoom: 18 }).addTo(map);

    var layers = {};      // country code -> layerGroup
    var markers = {};     // route id -> marker
    var activeFilter = "all";

    var hubIcon = L.divIcon({
      className: "",
      html: '<div style="width:18px;height:18px;border-radius:50%;background:#e2000f;border:3px solid #fff;box-shadow:0 0 0 3px rgba(226,0,15,.3)"></div>',
      iconSize: [18, 18], iconAnchor: [9, 9]
    });
    var hub = L.marker(BALI_HUB.coords, { icon: hubIcon, zIndexOffset: 1000 }).addTo(map);

    function popupHTML(r) {
      return '<h4>' + badge(r.country) + ' ' + BALI_HUB.name[lang()] + ' → ' + r.name[lang()] + '</h4>' +
        '<div>' + t("route.via") + ': ' + r.via[lang()] + '</div>' +
        '<div>' + icon("timer") + ' ' + r.duration + ' · ' + r.km + ' km · ' + baliFormatPrice(r) + '</div>' +
        '<div>' + icon("calendar") + ' ' + BALI_DAYS[r.days][lang()] + '</div>' +
        '<div class="times">' + r.departures.map(function (d) { return '<span class="pill">' + d + '</span>'; }).join("") + '</div>' +
        '<div style="margin-top:8px"><a href="' + url("timetable.html?to=" + r.id) + '">' + t("route.details") + ' →</a></div>';
    }

    function curve(a, b) {
      // simple quadratic-ish arc so overlapping lines are distinguishable
      var pts = [];
      var mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      var dx = b[1] - a[1], dy = b[0] - a[0];
      var dist = Math.sqrt(dx * dx + dy * dy);
      var off = dist * 0.12;
      var ctrl = [mid[0] - (dx / dist) * off, mid[1] + (dy / dist) * off];
      for (var i = 0; i <= 24; i++) {
        var s = i / 24;
        var lat = (1 - s) * (1 - s) * a[0] + 2 * (1 - s) * s * ctrl[0] + s * s * b[0];
        var lng = (1 - s) * (1 - s) * a[1] + 2 * (1 - s) * s * ctrl[1] + s * s * b[1];
        pts.push([lat, lng]);
      }
      return pts;
    }

    BALI_ROUTES.forEach(function (r) {
      if (!layers[r.country]) layers[r.country] = L.layerGroup().addTo(map);
      var intl = r.country !== "mk";
      var line = L.polyline(curve(BALI_HUB.coords, r.coords), {
        color: intl ? INTL : BRAND, weight: intl ? 3 : 4, opacity: .85, dashArray: intl ? "8 6" : null
      });
      var marker = L.circleMarker(r.coords, { radius: 7, color: "#fff", weight: 2, fillColor: intl ? INTL : BRAND, fillOpacity: 1 });
      marker.bindPopup(popupHTML(r));
      marker.bindTooltip(r.name[lang()], { direction: "top", offset: [0, -8] });
      line.bindPopup(popupHTML(r));
      layers[r.country].addLayer(line);
      layers[r.country].addLayer(marker);
      markers[r.id] = marker;
      marker.on("click", function () { highlightList(r.id); });
    });

    function setHubPopup() {
      hub.bindPopup('<h4>' + BALI_HUB.name[lang()] + '</h4><div>' + t("map.hubPopup") + '</div>');
      hub.bindTooltip(BALI_HUB.name[lang()], { permanent: true, direction: "right", offset: [12, 0], className: "hub-label" });
    }
    setHubPopup();

    function fitTo(code) {
      var pts = [BALI_HUB.coords];
      BALI_ROUTES.forEach(function (r) { if (code === "all" || r.country === code) pts.push(r.coords); });
      map.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
    }

    function applyFilter(code) {
      activeFilter = code;
      Object.keys(layers).forEach(function (c) {
        if (code === "all" || c === code) { if (!map.hasLayer(layers[c])) map.addLayer(layers[c]); }
        else map.removeLayer(layers[c]);
      });
      document.querySelectorAll(".filters button").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-filter") === code); });
      renderList();
      fitTo(code);
    }

    document.querySelectorAll(".filters button").forEach(function (b) {
      b.addEventListener("click", function () { applyFilter(b.getAttribute("data-filter")); });
    });

    function renderList() {
      var box = document.getElementById("route-list");
      if (!box) return;
      var html = "";
      Object.keys(BALI_COUNTRIES).forEach(function (code) {
        if (activeFilter !== "all" && activeFilter !== code) return;
        html += '<h4>' + badge(code) + ' ' + BALI_COUNTRIES[code].name[lang()] + '</h4>';
        BALI_ROUTES.filter(function (r) { return r.country === code; }).forEach(function (r) {
          html += '<button type="button" data-id="' + r.id + '"><span>' + r.name[lang()] + '</span><span class="rl-meta">' + r.duration + ' · ' + baliFormatPrice(r) + '</span></button>';
        });
      });
      box.innerHTML = html;
      box.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-id");
          var r = BALI_ROUTES.filter(function (x) { return x.id === id; })[0];
          highlightList(id);
          map.flyToBounds(L.latLngBounds([BALI_HUB.coords, r.coords]), { padding: [60, 60], duration: .8 });
          setTimeout(function () { markers[id].openPopup(); }, 900);
        });
      });
    }

    function highlightList(id) {
      document.querySelectorAll("#route-list button").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-id") === id); });
    }

    document.addEventListener("balilangchange", function () {
      BALI_ROUTES.forEach(function (r) {
        markers[r.id].setPopupContent(popupHTML(r));
        markers[r.id].unbindTooltip().bindTooltip(r.name[lang()], { direction: "top", offset: [0, -8] });
      });
      hub.unbindTooltip();
      setHubPopup();
      renderList();
    });

    renderList();
    fitTo("all");
  }

  /* ------------------------------------------------------------------ */
  /* Station map on the contact page                                     */
  /* ------------------------------------------------------------------ */
  var cEl = document.getElementById("contact-map");
  if (cEl) {
    var station = [41.5135, 20.9600];
    var cmap = L.map("contact-map", { scrollWheelZoom: false }).setView(station, 15);
    L.tileLayer(TILES, { attribution: ATTR, maxZoom: 19 }).addTo(cmap);
    L.marker(station).addTo(cmap).bindPopup("<strong>Bali Bus</strong><br>" + t("contact.stationPopup")).openPopup();
  }
})();
