/* ===========================================================
   Menus by Colart — render logic
   Card grid, filter chips, search, empty state, hero ecosystem
   visual. No build step — plain DOM, reads MENUS_ITEMS.
=========================================================== */
(function () {
  "use strict";

  const grid = document.getElementById("grid");
  const chipsWrap = document.getElementById("filters");
  const searchInput = document.getElementById("searchInput");
  const countEl = document.getElementById("heroCount");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const ARABIC_RE = /[؀-ۿ]/;

  function norm(str) {
    return (str || "").toLowerCase().trim();
  }

  function arrowSvg() {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M4 12h15.5M13 5.5 19.5 12 13 18.5"/>' +
      "</svg>"
    );
  }

  function cardHtml(item) {
    const hasAr = !!item.nameAr;
    const monoSrc = "assets/img/" + item.slug + "-mono.svg";
    const logoBg = item.bg || item.accent;
    return (
      '<a class="card" href="' + item.href + '" style="--accent:' + item.accent + ';--logo-bg:' + logoBg + '" data-slug="' + item.slug + '">' +
      '<span class="card-node" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="avatar">' +
      '<span class="avatar-in has-img">' +
      '<img class="contain" src="' + item.logo + '" alt="' + item.name + ' logo" loading="lazy" ' +
      "onerror=\"this.onerror=null;this.src='" + monoSrc + "';\">" +
      "</span>" +
      "</span>" +
      '<span class="card-body">' +
      '<span class="card-name">' + item.name + "</span>" +
      (hasAr ? '<span class="card-name-ar" dir="rtl">' + item.nameAr + "</span>" : "") +
      '<span class="card-cat">' + item.category + "</span>" +
      "</span>" +
      '<span class="card-cta">' +
      '<span class="lbl">View Menu</span>' +
      '<span class="arrow-wrap">' + arrowSvg() + "</span>" +
      "</span>" +
      "</a>"
    );
  }

  function emptyHtml() {
    return (
      '<div class="empty">' +
      '<i class="fa-solid fa-magnifying-glass"></i>' +
      "<p>No menus match.</p>" +
      "<span>Try a different name or category</span>" +
      "<button type=\"button\" id=\"resetFilters\">Show all menus</button>" +
      "</div>"
    );
  }

  let activeCategory = "All";

  function matchesSearch(item, q) {
    if (!q) return true;
    return (
      norm(item.name).includes(q) ||
      norm(item.nameAr).includes(q) ||
      norm(item.category).includes(q)
    );
  }

  function render() {
    const q = norm(searchInput ? searchInput.value : "");
    const filtered = MENUS_ITEMS.filter(function (item) {
      const catOk = activeCategory === "All" || item.category === activeCategory;
      return catOk && matchesSearch(item, q);
    });

    grid.innerHTML = filtered.length
      ? filtered.map(cardHtml).join("")
      : emptyHtml();

    if (countEl) {
      countEl.innerHTML =
        "<strong>" + filtered.length + "</strong> " +
        (filtered.length === 1 ? "menu" : "menus") +
        " in the Colart ecosystem";
    }

    const resetBtn = document.getElementById("resetFilters");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        activeCategory = "All";
        if (searchInput) searchInput.value = "";
        renderChips();
        render();
      });
    }
  }

  function renderChips() {
    const categories = ["All"].concat(
      Array.from(new Set(MENUS_ITEMS.map(function (i) { return i.category; }))).sort()
    );
    chipsWrap.innerHTML = categories
      .map(function (cat) {
        const active = cat === activeCategory ? " active" : "";
        return (
          '<button type="button" class="chip' + active + '" data-cat="' + cat + '">' +
          cat +
          "</button>"
        );
      })
      .join("");

    chipsWrap.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCategory = chip.getAttribute("data-cat");
        renderChips();
        render();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", render);
  }

  // "/" focuses search, unless already typing somewhere
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/") return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    if (searchInput) searchInput.focus();
  });

  renderChips();
  render();

  /* ===== Hero ecosystem visual (desktop only, decorative) ===== */
  function buildEco() {
    const mount = document.getElementById("eco");
    if (!mount) return;

    const W = 640, H = 640;
    const markW = 300, markH = 247.4; // matches logo-mark.svg aspect ratio
    const markX = W - markW - 30;
    const markY = (H - markH) / 2;
    const anchor = { x: markX + 6, y: markY + markH * 0.56 };

    const nodeCount = Math.min(MENUS_ITEMS.length, 6);
    const items = MENUS_ITEMS.slice(0, nodeCount);
    const topPad = 50, botPad = 50;
    const step = (H - topPad - botPad) / (items.length - 1 || 1);

    let svg =
      '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">';

    svg +=
      '<image class="eco-mark" href="assets/img/menus-logo.svg" x="' +
      markX + '" y="' + markY + '" width="' + markW + '" height="' + markH +
      '" preserveAspectRatio="xMidYMid meet"></image>';

    items.forEach(function (item, i) {
      const ny = topPad + step * i;
      const nx = 70;
      const r = 28;
      const dx1 = nx + (anchor.x - nx) * 0.42;
      const dy1 = ny;
      const dx2 = nx + (anchor.x - nx) * 0.72;
      const dy2 = anchor.y;
      const d =
        "M" + (nx + r) + " " + ny +
        " C " + dx1 + " " + dy1 + ", " + dx2 + " " + dy2 + ", " + anchor.x + " " + anchor.y;
      const delay = (0.15 + i * 0.1).toFixed(2) + "s";
      const clipId = "eco-c" + i;
      const monoSrc = "assets/img/" + item.slug + "-mono.svg";

      svg +=
        '<path class="eco-path" d="' + d + '" style="--d:' + delay + '"></path>' +
        '<circle class="eco-dot" cx="' + anchor.x + '" cy="' + anchor.y + '" r="3" style="--d:' + delay + '"></circle>' +
        '<g class="eco-node" style="--d:' + delay + '">' +
        '<title>' + item.name + "</title>" +
        '<circle cx="' + nx + '" cy="' + ny + '" r="' + r + '" fill="none" stroke="' + item.accent + '" stroke-width="2"></circle>' +
        '<clipPath id="' + clipId + '"><circle cx="' + nx + '" cy="' + ny + '" r="' + (r - 3) + '"></circle></clipPath>' +
        '<image href="' + item.logo + '" clip-path="url(#' + clipId + ')" x="' + (nx - r + 3) + '" y="' + (ny - r + 3) + '" width="' + (r * 2 - 6) + '" height="' + (r * 2 - 6) + '" preserveAspectRatio="xMidYMid slice" ' +
        'onerror="this.setAttribute(\'href\',\'' + monoSrc + '\')"></image>' +
        "</g>";
    });

    svg += "</svg>";
    mount.innerHTML = svg;

    // compute real path lengths for the draw-in animation
    mount.querySelectorAll(".eco-path").forEach(function (path) {
      const len = path.getTotalLength();
      path.style.setProperty("--len", len);
    });
  }

  buildEco();
})();
