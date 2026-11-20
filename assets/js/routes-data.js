/* ==========================================================================
   Bali Bus – route & timetable data (FICTIONAL schedule for course project)
   All departures are from the Kičevo bus station.
   ========================================================================== */

var BALI_HUB = {
  id: "kicevo",
  name: { en: "Kičevo", mk: "Кичево", sq: "Kërçovë" },
  coords: [41.5147, 20.9628]
};

var BALI_ROUTES = [
  /* ---------------- North Macedonia ---------------- */
  { id: "skopje", country: "mk", name: { en: "Skopje", mk: "Скопје", sq: "Shkup" }, coords: [41.9981, 21.4254],
    km: 112, duration: "1h 45m", price: 350, currency: "MKD", days: "daily",
    via: { en: "Gostivar, Tetovo", mk: "Гостивар, Тетово", sq: "Gostivar, Tetovë" },
    departures: ["05:30", "07:00", "09:00", "11:30", "14:00", "16:30", "19:00"] },
  { id: "gostivar", country: "mk", name: { en: "Gostivar", mk: "Гостивар", sq: "Gostivar" }, coords: [41.7967, 20.9083],
    km: 38, duration: "45m", price: 150, currency: "MKD", days: "daily",
    via: { en: "Direct", mk: "Директно", sq: "Direkt" },
    departures: ["05:30", "07:00", "09:00", "11:30", "14:00", "16:30", "19:00"] },
  { id: "tetovo", country: "mk", name: { en: "Tetovo", mk: "Тетово", sq: "Tetovë" }, coords: [42.0106, 20.9714],
    km: 64, duration: "1h 10m", price: 220, currency: "MKD", days: "daily",
    via: { en: "Gostivar", mk: "Гостивар", sq: "Gostivar" },
    departures: ["05:30", "07:00", "09:00", "11:30", "14:00", "16:30", "19:00"] },
  { id: "ohrid", country: "mk", name: { en: "Ohrid", mk: "Охрид", sq: "Ohër" }, coords: [41.1171, 20.8016],
    km: 60, duration: "1h 15m", price: 250, currency: "MKD", days: "daily",
    via: { en: "Direct", mk: "Директно", sq: "Direkt" },
    departures: ["06:00", "09:30", "13:00", "17:00"] },
  { id: "struga", country: "mk", name: { en: "Struga", mk: "Струга", sq: "Strugë" }, coords: [41.1778, 20.6778],
    km: 58, duration: "1h 20m", price: 260, currency: "MKD", days: "daily",
    via: { en: "Direct", mk: "Директно", sq: "Direkt" },
    departures: ["06:00", "09:30", "13:00", "17:00"] },
  { id: "debar", country: "mk", name: { en: "Debar", mk: "Дебар", sq: "Dibër" }, coords: [41.5250, 20.5272],
    km: 46, duration: "1h 05m", price: 220, currency: "MKD", days: "daily",
    via: { en: "Direct", mk: "Директно", sq: "Direkt" },
    departures: ["07:30", "13:30", "18:00"] },
  { id: "brod", country: "mk", name: { en: "Makedonski Brod", mk: "Македонски Брод", sq: "Makedonski Brod" }, coords: [41.5136, 21.2153],
    km: 32, duration: "40m", price: 130, currency: "MKD", days: "daily",
    via: { en: "Direct", mk: "Директно", sq: "Direkt" },
    departures: ["07:00", "12:00", "16:00"] },
  { id: "bitola", country: "mk", name: { en: "Bitola", mk: "Битола", sq: "Manastir" }, coords: [41.0297, 21.3347],
    km: 105, duration: "2h 20m", price: 400, currency: "MKD", days: "daily",
    via: { en: "Demir Hisar", mk: "Демир Хисар", sq: "Demir Hisar" },
    departures: ["06:30", "12:30", "17:30"] },
  { id: "prilep", country: "mk", name: { en: "Prilep", mk: "Прилеп", sq: "Prilep" }, coords: [41.3464, 21.5542],
    km: 82, duration: "2h 00m", price: 380, currency: "MKD", days: "daily",
    via: { en: "Makedonski Brod", mk: "Македонски Брод", sq: "Makedonski Brod" },
    departures: ["08:00", "15:00"] },

  /* ---------------- Albania ---------------- */
  { id: "tirana", country: "al", name: { en: "Tirana", mk: "Тирана", sq: "Tiranë" }, coords: [41.3275, 19.8187],
    km: 180, duration: "4h 30m", price: 20, currency: "EUR", days: "daily",
    via: { en: "Struga, Qafë Thanë, Elbasan", mk: "Струга, Ќафасан, Елбасан", sq: "Strugë, Qafë Thanë, Elbasan" },
    departures: ["06:00", "14:00"] },
  { id: "elbasan", country: "al", name: { en: "Elbasan", mk: "Елбасан", sq: "Elbasan" }, coords: [41.1125, 20.0822],
    km: 130, duration: "3h 45m", price: 17, currency: "EUR", days: "daily",
    via: { en: "Struga, Qafë Thanë", mk: "Струга, Ќафасан", sq: "Strugë, Qafë Thanë" },
    departures: ["06:00", "14:00"] },
  { id: "durres", country: "al", name: { en: "Durrës", mk: "Драч", sq: "Durrës" }, coords: [41.3231, 19.4414],
    km: 215, duration: "5h 15m", price: 22, currency: "EUR", days: "daily",
    via: { en: "Struga, Elbasan, Tirana", mk: "Струга, Елбасан, Тирана", sq: "Strugë, Elbasan, Tiranë" },
    departures: ["06:00"] },
  { id: "peshkopi", country: "al", name: { en: "Peshkopi", mk: "Пешкопеја", sq: "Peshkopi" }, coords: [41.6850, 20.4289],
    km: 78, duration: "2h 30m", price: 12, currency: "EUR", days: "mwf",
    via: { en: "Debar, Bllatë", mk: "Дебар, Блато", sq: "Dibër, Bllatë" },
    departures: ["08:00"] },

  /* ---------------- Germany ---------------- */
  { id: "munich", country: "de", name: { en: "Munich", mk: "Минхен", sq: "Mynih" }, coords: [48.1351, 11.5820],
    km: 1380, duration: "22h", price: 95, currency: "EUR", days: "tfs",
    via: { en: "Skopje, Belgrade, Zagreb, Ljubljana, Salzburg", mk: "Скопје, Белград, Загреб, Љубљана, Салцбург", sq: "Shkup, Beograd, Zagreb, Lubjanë, Salzburg" },
    departures: ["16:00"] },
  { id: "stuttgart", country: "de", name: { en: "Stuttgart", mk: "Штутгарт", sq: "Shtutgart" }, coords: [48.7758, 9.1829],
    km: 1600, duration: "25h", price: 105, currency: "EUR", days: "tfs",
    via: { en: "Skopje, Belgrade, Zagreb, Munich, Ulm", mk: "Скопје, Белград, Загреб, Минхен, Улм", sq: "Shkup, Beograd, Zagreb, Mynih, Ulm" },
    departures: ["16:00"] },
  { id: "frankfurt", country: "de", name: { en: "Frankfurt", mk: "Франкфурт", sq: "Frankfurt" }, coords: [50.1109, 8.6821],
    km: 1780, duration: "27h", price: 110, currency: "EUR", days: "tf",
    via: { en: "Skopje, Belgrade, Zagreb, Munich, Nuremberg", mk: "Скопје, Белград, Загреб, Минхен, Нирнберг", sq: "Shkup, Beograd, Zagreb, Mynih, Nyrnberg" },
    departures: ["16:00"] },
  { id: "dusseldorf", country: "de", name: { en: "Düsseldorf", mk: "Дизелдорф", sq: "Dyseldorf" }, coords: [51.2277, 6.7735],
    km: 2000, duration: "29h", price: 120, currency: "EUR", days: "f",
    via: { en: "Skopje, Belgrade, Zagreb, Munich, Frankfurt, Cologne", mk: "Скопје, Белград, Загреб, Минхен, Франкфурт, Келн", sq: "Shkup, Beograd, Zagreb, Mynih, Frankfurt, Këln" },
    departures: ["14:00"] },

  /* ---------------- Switzerland ---------------- */
  { id: "zurich", country: "ch", name: { en: "Zürich", mk: "Цирих", sq: "Cyrih" }, coords: [47.3769, 8.5417],
    km: 1560, duration: "24h", price: 100, currency: "EUR", days: "ws",
    via: { en: "Skopje, Belgrade, Zagreb, Ljubljana, Innsbruck", mk: "Скопје, Белград, Загреб, Љубљана, Инсбрук", sq: "Shkup, Beograd, Zagreb, Lubjanë, Insbruk" },
    departures: ["15:00"] },
  { id: "basel", country: "ch", name: { en: "Basel", mk: "Базел", sq: "Bazel" }, coords: [47.5596, 7.5886],
    km: 1650, duration: "25h 30m", price: 105, currency: "EUR", days: "ws",
    via: { en: "Skopje, Belgrade, Zagreb, Innsbruck, Zürich", mk: "Скопје, Белград, Загреб, Инсбрук, Цирих", sq: "Shkup, Beograd, Zagreb, Insbruk, Cyrih" },
    departures: ["15:00"] },
  { id: "bern", country: "ch", name: { en: "Bern", mk: "Берн", sq: "Bernë" }, coords: [46.9480, 7.4474],
    km: 1680, duration: "26h", price: 110, currency: "EUR", days: "s",
    via: { en: "Skopje, Belgrade, Zagreb, Innsbruck, Zürich", mk: "Скопје, Белград, Загреб, Инсбрук, Цирих", sq: "Shkup, Beograd, Zagreb, Insbruk, Cyrih" },
    departures: ["15:00"] },
  { id: "geneva", country: "ch", name: { en: "Geneva", mk: "Женева", sq: "Gjenevë" }, coords: [46.2044, 6.1432],
    km: 1830, duration: "28h", price: 120, currency: "EUR", days: "s",
    via: { en: "Skopje, Belgrade, Zagreb, Zürich, Bern, Lausanne", mk: "Скопје, Белград, Загреб, Цирих, Берн, Лозана", sq: "Shkup, Beograd, Zagreb, Cyrih, Bernë, Lozanë" },
    departures: ["15:00"] }
];

var BALI_COUNTRIES = {
  mk: { flag: "🇲🇰", name: { en: "North Macedonia", mk: "Северна Македонија", sq: "Maqedonia e Veriut" } },
  al: { flag: "🇦🇱", name: { en: "Albania", mk: "Албанија", sq: "Shqipëri" } },
  de: { flag: "🇩🇪", name: { en: "Germany", mk: "Германија", sq: "Gjermani" } },
  ch: { flag: "🇨🇭", name: { en: "Switzerland", mk: "Швајцарија", sq: "Zvicër" } }
};

var BALI_DAYS = {
  daily: { en: "Daily", mk: "Секој ден", sq: "Çdo ditë" },
  mwf:   { en: "Mon, Wed, Fri", mk: "Пон, Сре, Пет", sq: "Hën, Mër, Pre" },
  tfs:   { en: "Tue, Fri, Sun", mk: "Вто, Пет, Нед", sq: "Mar, Pre, Die" },
  tf:    { en: "Tue, Fri", mk: "Вто, Пет", sq: "Mar, Pre" },
  f:     { en: "Friday", mk: "Петок", sq: "E premte" },
  ws:    { en: "Wed, Sat", mk: "Сре, Саб", sq: "Mër, Sht" },
  s:     { en: "Saturday", mk: "Сабота", sq: "E shtunë" }
};

/* Which weekday numbers (0=Sun..6=Sat) each schedule code runs on */
var BALI_DAY_CODES = {
  daily: [0, 1, 2, 3, 4, 5, 6],
  mwf: [1, 3, 5],
  tfs: [2, 5, 0],
  tf: [2, 5],
  f: [5],
  ws: [3, 6],
  s: [6]
};

function baliFormatPrice(route) {
  return route.currency === "MKD" ? route.price + " MKD" : route.price + " €";
}
