// ==========================================================================
// Airbnb Prototype · Logique Interactive (Vanilla JS, sans build step)
// ==========================================================================

(function () {
  const DATA = window.AIRBNB_DATA;

  const state = {
    view: "search", // 'search' | 'detail' | 'checkout'
    activeTab: "logements", // 'logements' | 'hotels' | 'services'
    activeFilter: "all",
    auditMode: false,
    checkIn: DATA.calendar.defaultCheckIn,
    checkOut: DATA.calendar.defaultCheckOut,
    flexApplied: false,
    selectedListingId: DATA.listings[0].id,
    paymentOption: "zero_now", // 'zero_now' | 'full_now'
    showBudgetsInTogether: false,
    togetherVotes: { "Thomas": "En attente" },
    imagineOpen: false,
    imagineSelections: {}, // scenarioId -> { itemIdx: altIdx }
    calPickStart: null
  };

  let map = null;
  let markersLayer = null;
  const markerRefs = {}; // id -> marker

  // ------------------------------------------------------------------------
  // Utilitaires
  // ------------------------------------------------------------------------
  function getNights() {
    return Math.max(1, state.checkOut - state.checkIn);
  }

  function formatDatesLabel() {
    const nights = getNights();
    return `${state.checkIn}–${state.checkOut} déc. · ${nights} nuit${nights > 1 ? "s" : ""}`;
  }

  function computePricing(item) {
    const nights = getNights();
    const flexDiscount = state.flexApplied ? 48 : 0;
    const nightsSubtotal = item.nightlyBase * nights;
    const loyaltyDiscount = Math.round(nightsSubtotal * DATA.user.loyalty.discountRate);
    const cleaningFee = item.cleaningFee || 0;
    const serviceFee = item.serviceFee || 0;
    const cityTax = Math.round((item.cityTaxPerNight || 2.5) * nights * 100) / 100;
    const totalTTC = Math.max(40, Math.round(nightsSubtotal - loyaltyDiscount - flexDiscount + cleaningFee + serviceFee + cityTax));
    return {
      nights,
      nightsSubtotal,
      loyaltyDiscount,
      flexDiscount,
      cleaningFee,
      serviceFee,
      cityTax,
      totalTTC
    };
  }

  function findItemById(id) {
    return (
      DATA.listings.find((l) => l.id === id) ||
      DATA.hotels.find((h) => h.id === id) ||
      DATA.listings[0]
    );
  }

  function getFilteredItems() {
    if (state.activeTab === "services") {
      return DATA.services;
    }
    const base = state.activeTab === "hotels" ? DATA.hotels : DATA.listings;
    if (state.activeFilter === "all") return base;
    return base.filter((item) => item.filters && item.filters.includes(state.activeFilter));
  }

  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    const bg = type === "success" ? "bg-[#008A05]" : "bg-[#222222]";
    toast.className = `${bg} text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 pointer-events-auto transition-all`;
    toast.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 shrink-0"></i><span>${message}</span>`;
    container.appendChild(toast);
    lucide.createIcons({ nodes: [toast] });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(6px)";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // ------------------------------------------------------------------------
  // Navigation entre les 3 vues
  // ------------------------------------------------------------------------
  function navigateTo(view, listingId = null) {
    if (listingId) {
      state.selectedListingId = listingId;
    }
    state.view = view;

    document.getElementById("view-search").classList.toggle("hidden", view !== "search");
    document.getElementById("view-detail").classList.toggle("hidden", view !== "detail");
    document.getElementById("view-checkout").classList.toggle("hidden", view !== "checkout");

    const searchRow = document.getElementById("header-search-row");
    if (searchRow) {
      searchRow.classList.toggle("hidden", view === "checkout");
    }

    if (view === "search") {
      renderSearchView();
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 120);
    } else if (view === "detail") {
      renderDetailView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (view === "checkout") {
      renderCheckoutView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ------------------------------------------------------------------------
  // VUE 1 : Recherche & Carte
  // ------------------------------------------------------------------------
  function renderSmartFilters() {
    const bar = document.getElementById("smart-filters-bar");

    if (state.activeTab === "services") {
      bar.innerHTML = `<span class="text-xs font-semibold text-[#717171] px-2">Services vérifiés à Annecy : mobilité électrique, bagagerie 24/7 &amp; expériences locales</span>`;
      return;
    }

    const buttons = DATA.smartFilters
      .map((f) => {
        const active = state.activeFilter === f.id;
        const baseCls = active
          ? "bg-[#222222] text-white border-[#222222]"
          : "bg-white text-[#222222] border-[#DDDDDD] hover:border-[#222222]";
        const restrictBadge = f.isMostRestrictive
          ? `<span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF385C]/15 text-[#FF385C]">-${f.reductionPct}% d'annonces</span>`
          : f.reductionPct > 0 && active
          ? `<span class="ml-1 text-[10px] opacity-80">(-${f.reductionPct}%)</span>`
          : "";

        return `
          <button data-filter="${f.id}" class="filter-chip shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition ${baseCls}">
            <i data-lucide="${f.icon}" class="w-3.5 h-3.5"></i>
            <span>${f.label}</span>
            ${restrictBadge}
          </button>`;
      })
      .join("");

    bar.innerHTML = buttons;
    lucide.createIcons({ nodes: [bar] });

    bar.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeFilter = btn.dataset.filter;
        renderSearchView();
      });
    });
  }

  function renderListingsGrid() {
    const grid = document.getElementById("listings-grid");
    const items = getFilteredItems();
    const countTitle = document.getElementById("results-count-title");
    const flexBanner = document.getElementById("airbnb-flex-banner");

    document.getElementById("header-dates-label").textContent = formatDatesLabel();

    if (state.activeTab === "services") {
      flexBanner.classList.add("hidden");
      countTitle.textContent = `${items.length} services disponibles à Annecy · ${formatDatesLabel()}`;
      grid.innerHTML = items
        .map(
          (srv) => `
        <article class="listing-card group cursor-pointer" data-id="${srv.id}">
          <div class="listing-thumb-wrap mb-2.5">
            <img src="${srv.image}" alt="${srv.title}" loading="lazy" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#222222] text-[11px] font-bold shadow-sm">
              ${srv.serviceType}
            </span>
          </div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-[#222222] leading-snug line-clamp-1">${srv.title}</h3>
            <span class="text-xs font-semibold text-[#222222] shrink-0 flex items-center gap-1">★ ${srv.rating}</span>
          </div>
          <p class="text-xs text-[#717171] mt-0.5">${srv.neighborhood}</p>
          <p class="text-xs text-[#717171] mt-1 line-clamp-2">${srv.description}</p>
          <div class="mt-2 flex items-center justify-between">
            <div class="text-sm font-bold text-[#222222]">${srv.priceTotal} € <span class="font-normal text-xs text-[#717171]">${srv.priceUnit}</span></div>
            <span class="text-[11px] font-semibold text-[#008A05] bg-[#EDF7ED] px-2 py-0.5 rounded-full">${srv.badge}</span>
          </div>
        </article>`
        )
        .join("");
      return;
    }

    flexBanner.classList.remove("hidden");
    const labelType = state.activeTab === "hotels" ? "hôtels indépendants" : "logements";
    countTitle.textContent = `${items.length} ${labelType} à Annecy · ${formatDatesLabel()}`;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center border border-dashed border-[#DDDDDD] rounded-2xl">
          <p class="text-sm font-semibold text-[#222222]">Aucun résultat avec cette combinaison de filtres.</p>
          <button id="reset-filters-inline" class="mt-3 px-4 py-2 rounded-full bg-[#222222] text-white text-xs font-semibold">Réinitialiser les filtres</button>
        </div>`;
      document.getElementById("reset-filters-inline").addEventListener("click", () => {
        state.activeFilter = "all";
        renderSearchView();
      });
      return;
    }

    grid.innerHTML = items
      .map((item) => {
        const p = computePricing(item);
        const trustBadge = item.badges?.trust
          ? `<span class="px-2 py-0.5 rounded-full bg-[#F7F7F7] border border-[#EBEBEB] text-[10.5px] font-semibold text-[#222222]">${item.badges.trust}</span>`
          : "";
        const impactBadge = item.badges?.impact
          ? `<span class="px-2 py-0.5 rounded-full bg-[#EDF7ED] text-[10.5px] font-semibold text-[#14532D]">${item.badges.impact}</span>`
          : "";

        return `
        <article class="listing-card group cursor-pointer" data-id="${item.id}" data-cluster="${item.clusterGroup || ""}">
          <div class="listing-thumb-wrap mb-2.5">
            <img src="${item.photos[0].url}" alt="${item.title}" loading="lazy" />
            <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
              ${
                item.instantBook
                  ? `<span class="px-2.5 py-1 rounded-full bg-white/95 text-[#222222] text-[10.5px] font-bold shadow-sm flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3 text-[#FF385C]"></i> Instantané</span>`
                  : `<span class="px-2.5 py-1 rounded-full bg-white/95 text-[#717171] text-[10.5px] font-semibold shadow-sm">Sur demande</span>`
              }
            </div>
            <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
              ${trustBadge}
              ${impactBadge}
            </div>
          </div>

          <div class="flex items-start justify-between gap-2">
            <h3 class="text-[14.5px] font-semibold text-[#222222] leading-snug line-clamp-1">${item.shortTitle}</h3>
            <span class="text-[13px] font-semibold text-[#222222] shrink-0">★ ${item.rating}</span>
          </div>
          <p class="text-xs text-[#717171] mt-0.5">${item.neighborhood} · ${item.guests} voyageurs</p>
          <p class="text-xs text-[#717171] mt-0.5 truncate">${item.accessInfo.transit}</p>

          <div class="mt-2 pt-2 border-t border-[#EBEBEB] flex items-baseline justify-between gap-2">
            <div>
              <span class="text-[15px] font-bold text-[#222222] underline decoration-[#DDDDDD] underline-offset-2">${p.totalTTC} €</span>
              <span class="text-xs text-[#717171]"> total TTC</span>
            </div>
            <span class="text-[11px] font-semibold text-[#FF385C]">-${DATA.user.loyalty.discountLabel.replace("-", "")} Pass N2 inclus</span>
          </div>
        </article>`;
      })
      .join("");

    lucide.createIcons({ nodes: [grid] });

    // Interactions cartes -> ouverture Vue 2 + survol -> surbrillance carte
    grid.querySelectorAll(".listing-card").forEach((card) => {
      const id = card.dataset.id;
      const cluster = card.dataset.cluster;
      card.addEventListener("click", () => {
        navigateTo("detail", id);
      });
      card.addEventListener("mouseenter", () => highlightMapMarker(id, cluster, true));
      card.addEventListener("mouseleave", () => highlightMapMarker(id, cluster, false));
    });
  }

  function highlightMapMarker(id, cluster, active) {
    const target = markerRefs[id] || (cluster ? markerRefs[`cluster-${cluster}`] : null);
    if (!target) return;
    const el = target.getElement();
    if (!el) return;
    const pill = el.querySelector(".price-pill");
    if (pill) {
      pill.classList.toggle("is-hovered", active);
    }
  }

  function initOrUpdateMap() {
    const mapEl = document.getElementById("leaflet-map");
    if (!mapEl) return;

    if (!map) {
      map = L.map("leaflet-map", {
        center: [45.8985, 6.1355],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap France',
        maxZoom: 19
      }).addTo(map);

      markersLayer = L.layerGroup().addTo(map);
      map.on("zoomend", renderMapMarkers);
    }

    renderMapMarkers();
  }

  function renderMapMarkers() {
    if (!map || !markersLayer) return;
    markersLayer.clearLayers();
    Object.keys(markerRefs).forEach((k) => delete markerRefs[k]);

    const items = getFilteredItems();
    const zoom = map.getZoom();

    if (state.activeTab === "services") {
      items.forEach((srv) => {
        const icon = L.divIcon({
          className: "price-marker-wrapper",
          html: `<div class="price-pill">${srv.priceTotal} €</div>`,
          iconSize: [70, 30],
          iconAnchor: [35, 15]
        });
        const m = L.marker([srv.lat, srv.lng], { icon }).addTo(markersLayer);
        m.bindPopup(`
          <div class="p-3">
            <div class="text-[11px] font-bold text-[#FF385C] uppercase">${srv.serviceType}</div>
            <div class="text-xs font-bold text-[#222222] mt-0.5">${srv.title}</div>
            <div class="text-xs text-[#717171] mt-1">${srv.priceTotal} € ${srv.priceUnit}</div>
          </div>
        `);
        markerRefs[srv.id] = m;
      });
      return;
    }

    // Clustering visuel en dessous du zoom 15 pour éviter le chevauchement en centre-ville
    const shouldCluster = zoom < 15;
    const clusters = {};
    const singles = [];

    items.forEach((item) => {
      if (shouldCluster && item.clusterGroup) {
        if (!clusters[item.clusterGroup]) clusters[item.clusterGroup] = [];
        clusters[item.clusterGroup].push(item);
      } else {
        singles.push(item);
      }
    });

    Object.entries(clusters).forEach(([groupKey, groupItems]) => {
      if (groupItems.length <= 1) {
        singles.push(...groupItems);
        return;
      }
      const avgLat = groupItems.reduce((s, i) => s + i.lat, 0) / groupItems.length;
      const avgLng = groupItems.reduce((s, i) => s + i.lng, 0) / groupItems.length;
      const minTotal = Math.min(...groupItems.map((i) => computePricing(i).totalTTC));

      const icon = L.divIcon({
        className: "price-marker-wrapper",
        html: `<div class="price-pill is-cluster">${groupItems.length} logements · dès ${minTotal} €</div>`,
        iconSize: [165, 32],
        iconAnchor: [82, 16]
      });

      const m = L.marker([avgLat, avgLng], { icon }).addTo(markersLayer);
      m.on("click", () => {
        map.setView([avgLat, avgLng], 16, { animate: true });
      });
      markerRefs[`cluster-${groupKey}`] = m;
    });

    singles.forEach((item) => {
      const p = computePricing(item);
      const icon = L.divIcon({
        className: "price-marker-wrapper",
        html: `<div class="price-pill">${p.totalTTC} €</div>`,
        iconSize: [74, 30],
        iconAnchor: [37, 15]
      });
      const m = L.marker([item.lat, item.lng], { icon }).addTo(markersLayer);
      m.bindPopup(`
        <div class="cursor-pointer" onclick="window.__openListingFromMap('${item.id}')">
          <img src="${item.photos[0].url}" class="w-full h-28 object-cover" />
          <div class="p-2.5">
            <div class="flex items-center justify-between text-xs font-bold text-[#222222]">
              <span class="truncate pr-2">${item.shortTitle}</span>
              <span>★ ${item.rating}</span>
            </div>
            <div class="text-[11px] text-[#717171] mt-0.5">${item.neighborhood}</div>
            <div class="text-xs font-bold text-[#222222] mt-1.5">${p.totalTTC} € TTC <span class="font-normal text-[#717171]">· Voir la fiche →</span></div>
          </div>
        </div>
      `);
      markerRefs[item.id] = m;
    });
  }

  window.__openListingFromMap = function (id) {
    navigateTo("detail", id);
  };

  function renderSearchView() {
    renderSmartFilters();
    renderListingsGrid();
    initOrUpdateMap();
  }

  // ------------------------------------------------------------------------
  // VUE 2 : Fiche Logement
  // ------------------------------------------------------------------------
  function renderDetailView() {
    const item = findItemById(state.selectedListingId);
    const p = computePricing(item);
    const container = document.getElementById("detail-content");

    const statusBadge = item.instantBook
      ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF7ED] text-[#14532D] text-xs font-bold"><i data-lucide="zap" class="w-3.5 h-3.5"></i> Réservation instantanée</span>`
      : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF7E0] text-[#78350F] text-xs font-bold"><i data-lucide="clock" class="w-3.5 h-3.5"></i> Sur demande (réponse sous 2h)</span>`;

    const mosaicHtml = item.photos
      .slice(0, 5)
      .map(
        (ph, idx) => `
      <div class="relative overflow-hidden bg-[#F7F7F7] ${idx === 0 ? "mosaic-main" : ""}">
        <img src="${ph.url}" alt="${ph.label}" class="w-full h-full object-cover hover:scale-105 transition duration-300" />
        <span class="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold">
          ${ph.label}
        </span>
      </div>`
      )
      .join("");

    const trustMetricsHtml = item.trustDetails.metrics
      .map((m) => {
        const badgeCls =
          m.status === "verified"
            ? "bg-[#EDF7ED] text-[#14532D]"
            : m.status === "reviews"
            ? "bg-[#F7F7F7] text-[#222222]"
            : "bg-[#FEF7E0] text-[#78350F]";
        return `
        <div class="space-y-1.5">
          <div class="flex items-center justify-between gap-2 text-xs">
            <span class="font-semibold text-[#222222]">${m.label}</span>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${badgeCls}">${m.source}</span>
              <span class="font-bold text-[#222222] w-8 text-right">${m.score}%</span>
            </div>
          </div>
          <div class="w-full h-2 rounded-full bg-[#EBEBEB] overflow-hidden">
            <div class="h-full rounded-full bg-[#222222]" style="width: ${m.score}%"></div>
          </div>
        </div>`;
      })
      .join("");

    const impactHtml =
      item.impactDetails && item.impactDetails.length > 0
        ? item.impactDetails
            .map(
              (imp) => `
          <div class="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F7F7] border border-[#EBEBEB]">
            <div class="w-8 h-8 rounded-lg bg-[#EDF7ED] text-[#14532D] flex items-center justify-center shrink-0">
              <i data-lucide="${imp.icon}" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-[#222222]">${imp.title}</div>
              <div class="text-xs text-[#717171] mt-0.5">${imp.detail}</div>
            </div>
          </div>`
            )
            .join("")
        : `<p class="text-xs text-[#717171]">Critères environnementaux en cours de vérification pour cet établissement.</p>`;

    const localExps =
      item.localExperiences && item.localExperiences.length > 0
        ? item.localExperiences
        : DATA.listings[0].localExperiences;

    const localHtml = localExps
      .map(
        (exp) => `
      <div class="rounded-xl border border-[#EBEBEB] overflow-hidden bg-white flex flex-col">
        <div class="h-32 overflow-hidden relative">
          <img src="${exp.image}" alt="${exp.title}" class="w-full h-full object-cover" />
          <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/95 text-[11px] font-bold text-[#222222]">★ ${exp.rating}</span>
        </div>
        <div class="p-3 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] font-semibold text-[#FF385C]">${exp.organizer}</div>
            <h4 class="text-xs font-bold text-[#222222] mt-0.5 leading-snug">${exp.title}</h4>
            <div class="text-[11px] text-[#717171] mt-1.5 space-y-0.5">
              <div>Durée : ${exp.duration} · ${exp.capacity}</div>
              <div class="text-[#14532D] font-medium">${exp.accessibility}</div>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-[#EBEBEB] flex items-center justify-between">
            <span class="text-xs font-bold text-[#222222]">${exp.price} € <span class="font-normal text-[#717171]">/ pers.</span></span>
            <button class="text-[11px] font-bold underline text-[#222222]" onclick="window.__toast('Expérience « ${exp.title.replace(/'/g, "\\'")} » ajoutée à vos favoris')">Découvrir</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    container.innerHTML = `
      <!-- Bouton retour -->
      <button id="back-to-search-btn" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#222222] hover:underline mb-4">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>
        <span>Retour aux résultats à Annecy</span>
      </button>

      <!-- Titre & Statut immédiat -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
            ${statusBadge}
            <span class="text-xs font-semibold text-[#717171]">${item.neighborhood}</span>
          </div>
          <h1 class="text-2xl sm:text-[26px] font-bold text-[#222222] tracking-tight">${item.title}</h1>
        </div>
        <div class="flex items-center gap-3 text-sm font-semibold shrink-0">
          <span>★ ${item.rating}</span>
          <span class="text-[#717171] underline">${item.reviewsCount} avis vérifiés</span>
        </div>
      </div>

      <!-- Mosaïque 5 photos par pièce -->
      <div class="relative mb-5" data-audit="Photos par pièce">
        <span class="audit-tag">Mosaïque 5 pièces labellisées</span>
        <div class="mosaic-grid">
          ${mosaicHtml}
        </div>
      </div>

      <!-- En-tête Above-the-fold : Localisation, Escalier & Sécurité -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 p-4 rounded-2xl bg-[#F7F7F7] border border-[#DDDDDD]" data-audit="Transparence Accès & Sécurité">
        <span class="audit-tag">Localisation, escalier &amp; sécurité dès le 1er écran</span>
        <div class="flex items-start gap-2.5">
          <i data-lucide="map-pin" class="w-4 h-4 text-[#FF385C] mt-0.5 shrink-0"></i>
          <div>
            <div class="text-xs font-bold text-[#222222]">Temps de trajet réels</div>
            <div class="text-xs text-[#717171] mt-0.5">${item.accessInfo.transit}</div>
          </div>
        </div>
        <div class="flex items-start gap-2.5">
          <i data-lucide="footprints" class="w-4 h-4 text-[#222222] mt-0.5 shrink-0"></i>
          <div>
            <div class="text-xs font-bold text-[#222222]">Accessibilité &amp; escaliers</div>
            <div class="text-xs font-semibold text-[#222222] mt-0.5">${item.accessInfo.stairs}</div>
          </div>
        </div>
        <div class="flex items-start gap-2.5">
          <i data-lucide="shield-check" class="w-4 h-4 text-[#008A05] mt-0.5 shrink-0"></i>
          <div>
            <div class="text-xs font-bold text-[#222222]">Sécurité vérifiée</div>
            <div class="text-xs text-[#717171] mt-0.5">${item.accessInfo.security}</div>
          </div>
        </div>
      </div>

      <!-- Grille 2 colonnes : Contenu gauche + Carte réservation sticky droite -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Colonne gauche -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Hôte -->
          <div class="flex items-center justify-between pb-6 border-b border-[#EBEBEB]">
            <div>
              <h2 class="text-lg font-bold text-[#222222]">Logement proposé par ${item.host.name}</h2>
              <p class="text-xs text-[#717171] mt-0.5">
                ${item.guests} voyageurs · ${item.bedrooms} chambre${item.bedrooms > 1 ? "s" : ""} · ${item.beds} lit${item.beds > 1 ? "s" : ""} · ${item.bathrooms} salle de bain · Répond ${item.host.responseTime}
              </p>
            </div>
            <img src="${item.host.avatar}" alt="${item.host.name}" class="w-12 h-12 rounded-full object-cover border border-[#DDDDDD]" />
          </div>

          <!-- Module Airbnb Trust -->
          <section class="p-5 rounded-2xl border border-[#DDDDDD] bg-white space-y-4" data-audit="Airbnb Trust">
            <span class="audit-tag">Airbnb Trust · Fiabilité détaillée</span>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="badge-check" class="w-5 h-5 text-[#FF385C]"></i>
                <h3 class="text-base font-bold text-[#222222]">Bilan de fiabilité Airbnb Trust</h3>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#222222] text-white">${item.badges?.trust || "Trust 95 %"}</span>
            </div>
            <p class="text-xs text-[#222222] bg-[#F7F7F7] p-3 rounded-xl border border-[#EBEBEB] leading-relaxed">
              <strong class="text-[#FF385C]">Vérification IA :</strong> ${item.trustDetails.aiSummary}
            </p>
            <div class="space-y-3 pt-1">
              ${trustMetricsHtml}
            </div>
          </section>

          <!-- Module Airbnb Impact -->
          <section class="space-y-3" data-audit="Airbnb Impact">
            <span class="audit-tag">Airbnb Impact · Critères sourcés</span>
            <div class="flex items-center gap-2">
              <i data-lucide="leaf" class="w-5 h-5 text-[#14532D]"></i>
              <h3 class="text-base font-bold text-[#222222]">Airbnb Impact · Empreinte &amp; mobilité</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${impactHtml}
            </div>
          </section>

          <!-- Module Airbnb Local -->
          <section class="space-y-3 pt-4 border-t border-[#EBEBEB]" data-audit="Airbnb Local">
            <span class="audit-tag">Airbnb Local · Expériences à proximité</span>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-[#222222]">Airbnb Local · Autour du logement</h3>
              <span class="text-xs text-[#717171]">Artisans &amp; producteurs vérifiés</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              ${localHtml}
            </div>
          </section>

          <!-- Bloc unique Avant de réserver -->
          <section id="before-booking-section" class="p-5 rounded-2xl bg-[#F7F7F7] border border-[#DDDDDD] space-y-4" data-audit="Avant de réserver">
            <span class="audit-tag">Bloc unique · Avant de réserver</span>
            <h3 class="text-base font-bold text-[#222222]">Avant de réserver · Règles, sécurité &amp; annulation</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <div class="font-bold text-[#222222] mb-1.5">Règles du séjour</div>
                <ul class="space-y-1 text-[#717171] list-disc pl-4">
                  ${item.beforeBooking.rules.map((r) => `<li>${r}</li>`).join("")}
                </ul>
              </div>
              <div>
                <div class="font-bold text-[#222222] mb-1.5">Sécurité &amp; accès</div>
                <ul class="space-y-1 text-[#717171] list-disc pl-4">
                  ${item.beforeBooking.safety.map((s) => `<li>${s}</li>`).join("")}
                </ul>
              </div>
            </div>
            <div class="pt-3 border-t border-[#DDDDDD] text-xs text-[#222222] space-y-1">
              <div><strong>Palier 1 :</strong> ${item.cancellation.tier1Desc} jusqu'au <strong>${item.cancellation.tier1Date}</strong>.</div>
              <div><strong>Palier 2 :</strong> ${item.cancellation.tier2Desc} jusqu'au <strong>${item.cancellation.tier2Date}</strong>.</div>
            </div>
          </section>
        </div>

        <!-- Colonne droite : Carte de réservation sticky -->
        <div class="lg:col-span-5">
          <div class="booking-sticky-card p-6 lg:sticky lg:top-[104px] space-y-4" data-audit="Transparence Prix">
            <span class="audit-tag">Transparence totale du prix &amp; Paliers</span>
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-2xl font-bold text-[#222222]">${p.totalTTC} €</span>
                <span class="text-xs text-[#717171]"> Total TTC (${p.nights} nuits)</span>
              </div>
              <span class="text-xs font-semibold text-[#FF385C] bg-[#FF385C]/10 px-2.5 py-1 rounded-full">
                Pass Niveau 2 (-10 %)
              </span>
            </div>

            <!-- Dates & Voyageurs -->
            <div class="grid grid-cols-2 border border-[#DDDDDD] rounded-xl overflow-hidden text-xs">
              <div class="p-3 border-r border-[#DDDDDD]">
                <div class="text-[10px] font-bold uppercase text-[#717171]">Arrivée → Départ</div>
                <div class="font-semibold text-[#222222] mt-0.5">${state.checkIn}–${state.checkOut} déc. 2026</div>
              </div>
              <div class="p-3">
                <div class="text-[10px] font-bold uppercase text-[#717171]">Voyageurs</div>
                <div class="font-semibold text-[#222222] mt-0.5">2 voyageurs</div>
              </div>
            </div>

            <!-- Détail ligne par ligne -->
            <div class="space-y-2 text-xs pt-1">
              <div class="flex justify-between text-[#222222]">
                <span>${item.nightlyBase} € × ${p.nights} nuits</span>
                <span>${p.nightsSubtotal} €</span>
              </div>
              <div class="flex justify-between text-[#222222]">
                <span>Frais de ménage</span>
                <span>${p.cleaningFee} €</span>
              </div>
              <div class="flex justify-between text-[#222222]">
                <span>Frais de service Airbnb</span>
                <span>${p.serviceFee} €</span>
              </div>
              <div class="flex justify-between text-[#222222]">
                <span>Taxes de séjour</span>
                <span>${p.cityTax.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div class="flex justify-between text-[#008A05] font-semibold">
                <span>Remise Fidélité Pass Niveau 2 (-10 %)</span>
                <span>-${p.loyaltyDiscount} €</span>
              </div>
              ${
                p.flexDiscount > 0
                  ? `<div class="flex justify-between text-[#008A05] font-semibold"><span>Avantage Airbnb Flex</span><span>-${p.flexDiscount} €</span></div>`
                  : ""
              }
              <div class="pt-3 border-t border-[#EBEBEB] flex justify-between text-sm font-bold text-[#222222]">
                <span>Total TTC</span>
                <span>${p.totalTTC} €</span>
              </div>
            </div>

            <!-- Résumé des 2 paliers d'annulation juste au-dessus de Réserver -->
            <div class="p-3 rounded-xl bg-[#F7F7F7] border border-[#EBEBEB] text-[11.5px] space-y-1.5">
              <div class="font-bold text-[#222222] flex items-center gap-1.5">
                <i data-lucide="calendar-check" class="w-3.5 h-3.5 text-[#008A05]"></i>
                <span>Conditions d'annulation en 2 paliers</span>
              </div>
              <div class="text-[#222222]">1. <strong>Annulation gratuite (100 %)</strong> jusqu'au ${item.cancellation.tier1Date}</div>
              <div class="text-[#717171]">2. <strong>Remboursement partiel (50 %)</strong> jusqu'au ${item.cancellation.tier2Date}</div>
            </div>

            <!-- Bouton principal Réserver -->
            <button id="go-to-checkout-btn" class="btn-airbnb w-full py-3.5 rounded-xl font-bold text-sm shadow-sm">
              Réserver · ${item.payZeroNow ? "0 € maintenant" : p.totalTTC + " €"}
            </button>

            <!-- Bouton secondaire Airbnb Together -->
            <button id="open-together-btn" class="w-full py-2.5 rounded-xl border border-[#222222] bg-white hover:bg-[#F7F7F7] text-[#222222] text-xs font-bold transition flex items-center justify-center gap-2">
              <i data-lucide="users" class="w-4 h-4"></i>
              <span>Planifier en groupe (Airbnb Together)</span>
            </button>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons({ nodes: [container] });

    document.getElementById("back-to-search-btn").addEventListener("click", () => navigateTo("search"));
    document.getElementById("go-to-checkout-btn").addEventListener("click", () => navigateTo("checkout"));
    document.getElementById("open-together-btn").addEventListener("click", openTogetherModal);
  }

  // ------------------------------------------------------------------------
  // VUE 3 : Parcours d'achat / Checkout
  // ------------------------------------------------------------------------
  function renderCheckoutView() {
    const item = findItemById(state.selectedListingId);
    const p = computePricing(item);
    const container = document.getElementById("checkout-content");
    const statusText = item.instantBook ? "Réservation instantanée" : "Demande de réservation";
    const dueNow = state.paymentOption === "zero_now" ? 0 : p.totalTTC;

    container.innerHTML = `
      <button id="back-to-detail-btn" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#222222] hover:underline mb-4">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>
        <span>Retour à la fiche logement</span>
      </button>

      <h1 class="text-2xl sm:text-[28px] font-bold text-[#222222] tracking-tight mb-8">
        Confirmer et payer · <span class="text-[#FF385C]">${statusText}</span>
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Colonne gauche : Paiement -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Option 0 € maintenant présélectionnée -->
          <section class="space-y-3" data-audit="0 € maintenant">
            <span class="audit-tag">Option 0 € maintenant présélectionnée</span>
            <h2 class="text-base font-bold text-[#222222]">Choisissez quand payer</h2>

            <label class="flex items-start justify-between gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
              state.paymentOption === "zero_now" ? "border-[#222222] bg-[#F7F7F7]" : "border-[#DDDDDD] bg-white"
            }">
              <div class="flex items-start gap-3">
                <input type="radio" name="pay-opt" value="zero_now" ${state.paymentOption === "zero_now" ? "checked" : ""} class="mt-1 accent-[#222222]" />
                <div>
                  <div class="text-sm font-bold text-[#222222]">Payer 0 € maintenant</div>
                  <div class="text-xs text-[#717171] mt-0.5">
                    Le montant total de ${p.totalTTC} € sera débité automatiquement le ${item.cancellation.tier1Date}. Annulation gratuite jusque-là.
                  </div>
                </div>
              </div>
              <span class="text-sm font-bold text-[#008A05] shrink-0">0 €</span>
            </label>

            <label class="flex items-start justify-between gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
              state.paymentOption === "full_now" ? "border-[#222222] bg-[#F7F7F7]" : "border-[#DDDDDD] bg-white"
            }">
              <div class="flex items-start gap-3">
                <input type="radio" name="pay-opt" value="full_now" ${state.paymentOption === "full_now" ? "checked" : ""} class="mt-1 accent-[#222222]" />
                <div>
                  <div class="text-sm font-bold text-[#222222]">Payer la totalité maintenant</div>
                  <div class="text-xs text-[#717171] mt-0.5">Réglez ${p.totalTTC} € TTC immédiatement par carte bancaire.</div>
                </div>
              </div>
              <span class="text-sm font-bold text-[#222222] shrink-0">${p.totalTTC} €</span>
            </label>
          </section>

          <!-- Formulaire CB ultra-compact sur 2 lignes maximum -->
          <section class="space-y-3 pt-4 border-t border-[#EBEBEB]" data-audit="Checkout Express">
            <span class="audit-tag">Formulaire CB raccourci (2 lignes max)</span>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-[#222222]">Payer par carte bancaire</h2>
              <div class="flex items-center gap-1.5 text-[11px] font-semibold text-[#717171]">
                <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                <span>Paiement chiffré SSL</span>
              </div>
            </div>

            <div class="rounded-xl border border-[#DDDDDD] overflow-hidden bg-white">
              <!-- Ligne 1 : Numéro de carte -->
              <div class="px-3.5 py-2.5 border-b border-[#DDDDDD] flex items-center justify-between gap-2">
                <input type="text" value="4970 •••• •••• 3842" aria-label="Numéro de carte" class="w-full text-sm font-medium text-[#222222] focus:outline-none" />
                <span class="text-[11px] font-bold text-[#717171] shrink-0">VISA</span>
              </div>
              <!-- Ligne 2 : Expiration + CVV + Code postal -->
              <div class="grid grid-cols-3 divide-x divide-[#DDDDDD]">
                <input type="text" value="08/29" aria-label="Expiration" class="px-3.5 py-2.5 text-sm text-[#222222] focus:outline-none" />
                <input type="text" value="842" aria-label="CVV" class="px-3.5 py-2.5 text-sm text-[#222222] focus:outline-none" />
                <input type="text" value="74000" aria-label="Code postal" class="px-3.5 py-2.5 text-sm text-[#222222] focus:outline-none" />
              </div>
            </div>
          </section>

          <button id="confirm-booking-btn" class="btn-airbnb w-full py-4 rounded-xl font-bold text-sm shadow-md">
            Confirmer et réserver (${dueNow} € débités aujourd'hui)
          </button>

          <!-- Bouton discret Démo Airbnb Care -->
          <div class="pt-6 border-t border-[#EBEBEB] flex items-center justify-between">
            <span class="text-xs text-[#717171]">Besoin de tester la gestion d'incident pour la soutenance ?</span>
            <button id="open-care-demo-btn" class="px-3.5 py-2 rounded-full border border-[#DDDDDD] hover:border-[#FF385C] text-xs font-semibold text-[#222222] hover:text-[#FF385C] transition flex items-center gap-1.5">
              <i data-lucide="life-buoy" class="w-3.5 h-3.5"></i>
              <span>Simuler un imprévu voyageur · Démo Airbnb Care</span>
            </button>
          </div>
        </div>

        <!-- Colonne droite : Récapitulatif -->
        <div class="lg:col-span-5">
          <div class="booking-sticky-card p-6 space-y-4">
            <div class="flex items-center gap-3.5 pb-4 border-b border-[#EBEBEB]">
              <img src="${item.photos[0].url}" alt="${item.title}" class="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div>
                <div class="text-[11px] font-semibold text-[#717171]">${item.neighborhood}</div>
                <div class="text-sm font-bold text-[#222222] leading-snug mt-0.5">${item.title}</div>
                <div class="text-xs font-semibold text-[#222222] mt-1">★ ${item.rating} (${item.reviewsCount} avis)</div>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between"><span>${item.nightlyBase} € × ${p.nights} nuits</span><span>${p.nightsSubtotal} €</span></div>
              <div class="flex justify-between"><span>Frais de ménage</span><span>${p.cleaningFee} €</span></div>
              <div class="flex justify-between"><span>Frais de service</span><span>${p.serviceFee} €</span></div>
              <div class="flex justify-between"><span>Taxes de séjour</span><span>${p.cityTax.toFixed(2).replace(".", ",")} €</span></div>
              <div class="flex justify-between text-[#008A05] font-semibold"><span>Remise Pass Niveau 2 (-10 %)</span><span>-${p.loyaltyDiscount} €</span></div>
              <div class="pt-3 border-t border-[#EBEBEB] flex justify-between text-sm font-bold text-[#222222]">
                <span>Total TTC</span>
                <span>${p.totalTTC} €</span>
              </div>
              <div class="flex justify-between text-xs font-bold text-[#FF385C] pt-1">
                <span>À payer aujourd'hui</span>
                <span>${dueNow} €</span>
              </div>
            </div>

            <div class="pt-3 border-t border-[#EBEBEB]">
              <button id="open-before-booking-modal-btn" class="text-xs font-bold underline text-[#222222] hover:text-[#FF385C] flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                <span>Consulter le bloc « Avant de réserver » (annulation &amp; sécurité)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons({ nodes: [container] });

    document.getElementById("back-to-detail-btn").addEventListener("click", () => navigateTo("detail"));
    container.querySelectorAll('input[name="pay-opt"]').forEach((r) => {
      r.addEventListener("change", (e) => {
        state.paymentOption = e.target.value;
        renderCheckoutView();
      });
    });
    document.getElementById("confirm-booking-btn").addEventListener("click", () => {
      showToast(`Réservation confirmée (${dueNow} € débités aujourd'hui) · Code d'accès envoyé !`, "success");
    });
    document.getElementById("open-care-demo-btn").addEventListener("click", openCareDrawer);
    document.getElementById("open-before-booking-modal-btn").addEventListener("click", () => openBeforeBookingModal(item));
  }

  // ------------------------------------------------------------------------
  // AIRBNB IMAGINE (3 scénarios modulables)
  // ------------------------------------------------------------------------
  function renderImagineScenarios() {
    const grid = document.getElementById("imagine-scenarios-grid");
    const promptEcho = document.getElementById("imagine-prompt-echo");
    const inputVal = document.getElementById("imagine-input").value.trim() || DATA.imagineDefaultPrompt;
    promptEcho.textContent = `Basé sur votre envie : « ${inputVal} »`;

    grid.innerHTML = DATA.imagineScenarios
      .map((scen) => {
        const sel = state.imagineSelections[scen.id] || {};
        let computedTotal = 0;

        const itemsHtml = scen.items
          .map((it, idx) => {
            const altIdx = sel[idx];
            const current = altIdx !== undefined && altIdx >= 0 ? it.alternatives[altIdx] : it;
            computedTotal += current.price;
            const statusCls =
              it.status === "confirmed"
                ? "bg-[#EDF7ED] text-[#14532D]"
                : "bg-[#FEF7E0] text-[#78350F]";

            return `
            <div class="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#EBEBEB] space-y-1">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10.5px] font-bold uppercase text-[#717171]">${it.type}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCls}">${it.statusLabel}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-semibold text-[#222222]">${current.name}</span>
                <span class="text-xs font-bold text-[#222222] shrink-0">${current.price} €</span>
              </div>
              ${
                it.alternatives && it.alternatives.length > 0
                  ? `<button class="imagine-swap-btn text-[11px] font-bold text-[#FF385C] hover:underline" data-scen="${scen.id}" data-item="${idx}">
                      ↻ Changer cet élément sans tout recommencer
                    </button>`
                  : ""
              }
            </div>`;
          })
          .join("");

        const mainListingId =
          (sel[0] !== undefined && sel[0] >= 0 && scen.items[0].alternatives[sel[0]].listingId) ||
          scen.items[0].listingId;

        return `
        <div class="bg-white rounded-2xl border border-[#DDDDDD] p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-[#222222] text-white text-[10.5px] font-bold">${scen.badge}</span>
              <span class="text-xs font-bold text-[#FF385C]">${computedTotal} € / pers.</span>
            </div>
            <h3 class="text-base font-bold text-[#222222] mt-1">${scen.title}</h3>
            <p class="text-xs text-[#717171]">${scen.subtitle}</p>
            <div class="mt-2 mb-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#222222]">
              <i data-lucide="train-front" class="w-3.5 h-3.5 text-[#717171]"></i>
              <span>${scen.travelTime}</span>
            </div>
            <div class="space-y-2.5">${itemsHtml}</div>
          </div>

          <button class="imagine-open-btn mt-4 w-full py-2.5 rounded-xl bg-[#222222] hover:bg-black text-white text-xs font-bold transition" data-listing="${mainListingId}">
            Choisir ce scénario &amp; voir l'hébergement
          </button>
        </div>`;
      })
      .join("");

    lucide.createIcons({ nodes: [grid] });

    grid.querySelectorAll(".imagine-swap-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sId = btn.dataset.scen;
        const iIdx = Number(btn.dataset.item);
        const scen = DATA.imagineScenarios.find((s) => s.id === sId);
        const alts = scen.items[iIdx].alternatives;
        if (!state.imagineSelections[sId]) state.imagineSelections[sId] = {};
        const cur = state.imagineSelections[sId][iIdx];
        const next = cur === undefined ? 0 : cur + 1 >= alts.length ? -1 : cur + 1;
        state.imagineSelections[sId][iIdx] = next;
        renderImagineScenarios();
        showToast("Élément remplacé ! Le budget a été recalculé.");
      });
    });

    grid.querySelectorAll(".imagine-open-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("imagine-panel").classList.add("hidden");
        navigateTo("detail", btn.dataset.listing);
      });
    });
  }

  // ------------------------------------------------------------------------
  // MODALES : Calendrier, Fidélité, Together, Care, Avant de réserver
  // ------------------------------------------------------------------------
  function renderCalendarDays() {
    const grid = document.getElementById("calendar-days-grid");
    const summary = document.getElementById("cal-selection-summary");
    summary.textContent = `Sélection : ${formatDatesLabel()}`;

    // Décembre 2026 commence un Mardi (1 blanc pour Lundi)
    const leadingBlanks = `<div></div>`;
    const daysHtml = DATA.calendar.days
      .map((d) => {
        const isEdge = d.day === state.checkIn || d.day === state.checkOut;
        const isSelected = d.day >= state.checkIn && d.day <= state.checkOut;
        return `
        <button data-day="${d.day}" class="cal-day tier-${d.tier} ${isSelected ? "is-selected" : ""} ${
          isEdge ? "is-edge" : ""
        } py-1.5 px-1 flex flex-col items-center justify-center cursor-pointer">
          <span class="text-xs font-semibold">${d.day}</span>
          <span class="text-[10px] opacity-85">${d.price}€</span>
        </button>`;
      })
      .join("");

    grid.innerHTML = leadingBlanks + daysHtml;

    grid.querySelectorAll(".cal-day").forEach((btn) => {
      btn.addEventListener("click", () => {
        const day = Number(btn.dataset.day);
        if (state.calPickStart === null) {
          state.calPickStart = day;
          state.checkIn = day;
          state.checkOut = Math.min(31, day + 1);
        } else {
          if (day <= state.calPickStart) {
            state.checkIn = day;
            state.checkOut = Math.min(31, state.calPickStart + 1);
          } else {
            state.checkIn = state.calPickStart;
            state.checkOut = day;
          }
          state.calPickStart = null;
        }
        renderCalendarDays();
      });
    });
  }

  function openLoyaltyModal() {
    const list = document.getElementById("loyalty-tiers-list");
    list.innerHTML = DATA.user.loyalty.tiers
      .map((t) => {
        const isCurrent = t.level === DATA.user.loyalty.level;
        return `
        <div class="p-4 rounded-xl border ${isCurrent ? "border-[#FF385C] bg-[#FFF0F2]/40" : "border-[#EBEBEB] bg-white"}">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-sm font-bold text-[#222222]">${t.name}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isCurrent ? "bg-[#FF385C] text-white" : "bg-[#F7F7F7] text-[#222222]"
            }">${t.discount}</span>
          </div>
          <div class="text-xs text-[#717171] mb-2">${t.requirement}</div>
          <ul class="text-xs text-[#222222] space-y-1 list-disc pl-4">
            ${t.perks.map((pk) => `<li>${pk}</li>`).join("")}
          </ul>
        </div>`;
      })
      .join("");
    document.getElementById("loyalty-modal").classList.remove("hidden");
  }

  function openTogetherModal() {
    const body = document.getElementById("together-modal-body");
    const t = DATA.togetherData;
    const item = findItemById(state.selectedListingId);

    const participantsHtml = t.participants
      .map((part) => {
        const vote = state.togetherVotes[part.name] || part.vote;
        const budgetText = state.showBudgetsInTogether ? part.budgetMax : "Budget masqué (confidentialité)";
        return `
        <div class="p-3.5 rounded-xl border border-[#EBEBEB] bg-[#F7F7F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style="background:${part.color}">
              ${part.initials}
            </div>
            <div>
              <div class="text-xs font-bold text-[#222222]">${part.name}</div>
              <div class="text-xs text-[#717171]">${part.preference}</div>
              <div class="text-[11px] font-semibold text-[#222222] mt-1">${budgetText}</div>
            </div>
          </div>
          <span class="self-start sm:self-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
            vote === "Pour" ? "bg-[#EDF7ED] text-[#14532D]" : "bg-[#FEF7E0] text-[#78350F]"
          }">${vote}</span>
        </div>`;
      })
      .join("");

    body.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] border border-[#EBEBEB]">
          <div>
            <div class="text-xs font-bold text-[#222222]">${item.shortTitle} · ${t.tripTitle}</div>
            <div class="text-[11px] text-[#717171]">Confidentialité activée par défaut</div>
          </div>
          <button id="toggle-budget-privacy" class="px-3 py-1.5 rounded-full border border-[#DDDDDD] bg-white text-xs font-semibold hover:border-[#222222]">
            ${state.showBudgetsInTogether ? "Masquer les budgets" : "Afficher mon budget"}
          </button>
        </div>

        <div class="p-3.5 rounded-xl bg-[#FF385C]/5 border border-[#FF385C]/30 text-xs text-[#222222]">
          <strong class="text-[#FF385C]">Compromis expliqué par l'IA :</strong> ${t.aiCompromise}
        </div>

        <div class="space-y-2.5">${participantsHtml}</div>

        <div class="pt-3 border-t border-[#EBEBEB] flex items-center justify-between gap-3">
          <span class="text-xs text-[#717171]">Votre vote pour ce logement :</span>
          <div class="flex items-center gap-2">
            <button id="vote-yes-btn" class="px-4 py-2 rounded-lg bg-[#008A05] text-white text-xs font-bold">Voter Pour</button>
            <button id="vote-alt-btn" class="px-4 py-2 rounded-lg border border-[#DDDDDD] text-xs font-bold hover:border-[#222222]">Proposer une alternative</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("together-modal").classList.remove("hidden");
    document.getElementById("toggle-budget-privacy").addEventListener("click", () => {
      state.showBudgetsInTogether = !state.showBudgetsInTogether;
      openTogetherModal();
    });
    document.getElementById("vote-yes-btn").addEventListener("click", () => {
      state.togetherVotes["Thomas"] = "Pour";
      openTogetherModal();
      showToast("Vote enregistré ! Le groupe est unanime.", "success");
    });
    document.getElementById("vote-alt-btn").addEventListener("click", () => {
      showToast("Lien de vote partagé avec Lucas et Thomas.");
    });
  }

  function openCareDrawer() {
    const body = document.getElementById("care-drawer-body");
    const care = DATA.careScenario;

    body.innerHTML = `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-[#FF385C] font-bold text-sm">
            <i data-lucide="life-buoy" class="w-5 h-5"></i>
            <span>Airbnb Care · Assistance proactive</span>
          </div>
          <button id="close-care-btn" class="p-1.5 rounded-full hover:bg-[#F7F7F7]">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="p-4 rounded-xl bg-[#FFF0F2] border border-[#FF385C]/30 space-y-1.5">
          <div class="text-xs font-bold text-[#9F1239]">${care.alertTitle}</div>
          <p class="text-xs text-[#222222] leading-relaxed">${care.alertDetail}</p>
        </div>

        <div class="space-y-2">
          <div class="text-xs font-bold text-[#222222]">1. Rappel automatique des consignes d'accès</div>
          <ul class="space-y-1.5 text-xs text-[#717171] bg-[#F7F7F7] p-3.5 rounded-xl border border-[#EBEBEB]">
            ${care.accessReminder.map((r) => `<li>• ${r}</li>`).join("")}
          </ul>
        </div>

        <div class="space-y-2.5">
          <div class="text-xs font-bold text-[#222222]">2. 2 logements de repli pré-réservables à 0 € de surcoût</div>
          ${care.fallbacks
            .map(
              (fb) => `
            <div class="p-3.5 rounded-xl border border-[#DDDDDD] bg-white space-y-1.5">
              <div class="flex items-center justify-between text-xs font-bold text-[#222222]">
                <span>${fb.title}</span>
                <span>★ ${fb.rating}</span>
              </div>
              <div class="text-[11px] text-[#717171]">${fb.distance}</div>
              <div class="text-[11px] font-bold text-[#008A05]">${fb.priceDiff}</div>
              <button class="care-fallback-btn mt-1 w-full py-2 rounded-lg bg-[#222222] text-white text-xs font-bold" data-id="${fb.id}">
                Basculer vers ce logement
              </button>
            </div>`
            )
            .join("")}
        </div>

        <div class="pt-3 border-t border-[#EBEBEB] space-y-2">
          <div class="text-[11px] text-[#717171] bg-[#F7F7F7] p-2.5 rounded-lg">
            <strong>Historique résumé pour le conseiller :</strong> ${care.summaryForAgent}
          </div>
          <button id="care-human-btn" class="w-full py-3 rounded-xl border-2 border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white text-xs font-bold transition">
            Transférer à un conseiller humain (historique déjà résumé)
          </button>
        </div>
      </div>
    `;

    const drawer = document.getElementById("care-drawer");
    drawer.classList.remove("hidden");
    lucide.createIcons({ nodes: [body] });

    document.getElementById("close-care-btn").addEventListener("click", () => drawer.classList.add("hidden"));
    body.querySelectorAll(".care-fallback-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        drawer.classList.add("hidden");
        navigateTo("detail", btn.dataset.id);
        showToast("Logement de repli sélectionné sans frais supplémentaires !", "success");
      });
    });
    document.getElementById("care-human-btn").addEventListener("click", () => {
      showToast("Conseiller Airbnb Care connecté avec votre résumé d'incident.", "success");
    });
  }

  function openBeforeBookingModal(item) {
    const body = document.getElementById("before-booking-modal-body");
    body.innerHTML = `
      <div>
        <div class="font-bold text-[#222222] mb-1">Règles du séjour</div>
        <ul class="list-disc pl-4 text-xs text-[#717171] space-y-1">${item.beforeBooking.rules.map((r) => `<li>${r}</li>`).join("")}</ul>
      </div>
      <div>
        <div class="font-bold text-[#222222] mb-1">Sécurité &amp; accès</div>
        <ul class="list-disc pl-4 text-xs text-[#717171] space-y-1">${item.beforeBooking.safety.map((s) => `<li>${s}</li>`).join("")}</ul>
      </div>
      <div class="p-3 rounded-xl bg-[#F7F7F7] text-xs space-y-1">
        <div><strong>Palier 1 :</strong> ${item.cancellation.tier1Desc} jusqu'au ${item.cancellation.tier1Date}</div>
        <div><strong>Palier 2 :</strong> ${item.cancellation.tier2Desc} jusqu'au ${item.cancellation.tier2Date}</div>
      </div>
    `;
    document.getElementById("before-booking-modal").classList.remove("hidden");
  }

  // ------------------------------------------------------------------------
  // Initialisation des événements globaux
  // ------------------------------------------------------------------------
  function bindGlobalEvents() {
    // Logo -> retour accueil
    document.getElementById("logo-home-btn").addEventListener("click", () => navigateTo("search"));

    // Onglets Logements / Hôtels / Services
    document.querySelectorAll(".offer-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.activeTab = tab.dataset.tab;
        state.activeFilter = "all";
        document.querySelectorAll(".offer-tab").forEach((t) => {
          const isAct = t.dataset.tab === state.activeTab;
          t.className = `offer-tab px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
            isAct ? "bg-white text-[#222222] shadow-sm" : "text-[#717171] hover:text-[#222222]"
          }`;
        });
        if (state.view !== "search") navigateTo("search");
        else renderSearchView();
      });
    });

    // Toggle Airbnb Imagine vs Recherche Classique
    const classicBtn = document.getElementById("mode-classic-btn");
    const imagineBtn = document.getElementById("mode-imagine-btn");
    const classicBar = document.getElementById("classic-search-bar");
    const imagineBar = document.getElementById("imagine-search-bar");
    const imaginePanel = document.getElementById("imagine-panel");

    classicBtn.addEventListener("click", () => {
      classicBtn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#222222] shadow-sm transition";
      imagineBtn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#717171] hover:text-[#222222] transition flex items-center gap-1.5";
      classicBar.classList.remove("hidden");
      imagineBar.classList.add("hidden");
      imaginePanel.classList.add("hidden");
    });

    imagineBtn.addEventListener("click", () => {
      imagineBtn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#222222] shadow-sm transition flex items-center gap-1.5";
      classicBtn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#717171] hover:text-[#222222] transition";
      imagineBar.classList.remove("hidden");
      classicBar.classList.add("hidden");
      renderImagineScenarios();
      imaginePanel.classList.remove("hidden");
    });

    document.getElementById("imagine-submit-btn").addEventListener("click", () => {
      renderImagineScenarios();
      imaginePanel.classList.remove("hidden");
    });
    document.getElementById("close-imagine-btn").addEventListener("click", () => {
      imaginePanel.classList.add("hidden");
    });

    // Airbnb Flex
    document.getElementById("apply-flex-btn").addEventListener("click", () => {
      state.flexApplied = !state.flexApplied;
      if (state.flexApplied) {
        state.checkIn = 10;
        state.checkOut = 13;
        document.getElementById("apply-flex-btn").textContent = "Annuler Flex";
        showToast("Dates décalées (10–13 déc.) : -48 € appliqués sans fausse urgence !", "success");
      } else {
        state.checkIn = DATA.calendar.defaultCheckIn;
        state.checkOut = DATA.calendar.defaultCheckOut;
        document.getElementById("apply-flex-btn").textContent = "Appliquer (-48 €)";
      }
      renderSearchView();
    });

    // Calendrier harmonisé
    const calModal = document.getElementById("calendar-modal");
    document.getElementById("open-calendar-btn").addEventListener("click", () => {
      renderCalendarDays();
      calModal.classList.remove("hidden");
    });
    document.getElementById("close-calendar-btn").addEventListener("click", () => calModal.classList.add("hidden"));
    document.getElementById("confirm-calendar-btn").addEventListener("click", () => {
      calModal.classList.add("hidden");
      renderSearchView();
      showToast(`Dates mises à jour : ${formatDatesLabel()}`);
    });

    // Modale Fidélité
    document.getElementById("loyalty-btn").addEventListener("click", openLoyaltyModal);
    document.getElementById("close-loyalty-btn").addEventListener("click", () => {
      document.getElementById("loyalty-modal").classList.add("hidden");
    });

    // Modale Together
    document.getElementById("close-together-btn").addEventListener("click", () => {
      document.getElementById("together-modal").classList.add("hidden");
    });

    // Modale Avant de réserver
    document.getElementById("close-before-booking-btn").addEventListener("click", () => {
      document.getElementById("before-booking-modal").classList.add("hidden");
    });

    // Toggle carte mobile
    const mapCol = document.getElementById("map-column");
    document.getElementById("mobile-map-toggle").addEventListener("click", () => {
      const hidden = mapCol.classList.contains("hidden");
      mapCol.classList.toggle("hidden", !hidden);
      if (hidden && map) {
        setTimeout(() => map.invalidateSize(), 120);
      }
    });

    // Bouton Mode Audit : OFF / ON
    const auditBtn = document.getElementById("audit-toggle-btn");
    auditBtn.addEventListener("click", () => {
      state.auditMode = !state.auditMode;
      document.body.classList.toggle("audit-mode", state.auditMode);
      document.getElementById("audit-state-label").textContent = state.auditMode ? "ON" : "OFF";
      document.getElementById("audit-dot").className = `w-2.5 h-2.5 rounded-full ${
        state.auditMode ? "bg-[#FF385C]" : "bg-[#717171]"
      }`;
      auditBtn.classList.toggle("ring-2", state.auditMode);
      auditBtn.classList.toggle("ring-[#FF385C]", state.auditMode);
    });

    window.__toast = showToast;
  }

  // ------------------------------------------------------------------------
  // Démarrage
  // ------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    bindGlobalEvents();
    renderSearchView();
  });
})();
