// Données fictives réalistes pour le prototype Airbnb · Audit UX, Fidélité & IA (Annecy)

window.AIRBNB_DATA = {
  user: {
    name: "Camille Laurent",
    initials: "CL",
    loyalty: {
      level: 2,
      name: "Airbnb Pass · Niveau 2",
      discountRate: 0.10,
      discountLabel: "-10%",
      staysCompleted: 6,
      staysToNext: 4,
      points: 1420,
      tiers: [
        {
          level: 1,
          name: "Niveau 1 · Explorateur",
          requirement: "Dès la 1re réservation",
          discount: "-5%",
          perks: [
            "5 % de remise immédiate sur les nuitées éligibles",
            "Annulation flexible étendue à 48h sur une sélection d'annonces"
          ]
        },
        {
          level: 2,
          name: "Niveau 2 · Habitué",
          requirement: "5 séjours validés (Actuel)",
          discount: "-10%",
          perks: [
            "10 % de remise immédiate sur les hébergements & hôtels partenaires",
            "Garantie Airbnb Care prioritaire en cas d'imprévu",
            "Arrivée anticipée offerte selon disponibilité"
          ]
        },
        {
          level: 3,
          name: "Niveau 3 · Ambassadeur",
          requirement: "10 séjours validés",
          discount: "-15%",
          perks: [
            "15 % de remise sur les hébergements + -10 % sur Airbnb Local",
            "Conseiller dédié 24/7 et zéro frais de modification de dates",
            "1 expérience locale offerte par an"
          ]
        }
      ]
    },
    annualRecap: {
      year: 2026,
      totalNights: 18,
      stays: 6,
      citiesVisited: ["Annecy", "Lyon", "Chamonix", "Aix-les-Bains"],
      savingsEuro: 312,
      co2SavedKg: 145,
      topStyle: "Séjours nature & gastronomie locale",
      favoriteHost: "Sophie · Canal du Thiou"
    },
    communityClubs: [
      {
        id: "club-gastro",
        name: "Club Terroir & Tables Alpines",
        hostName: "Sophie",
        hostRole: "Superhôte · Annecy",
        members: 342,
        nextEvent: "Jeu. 18 déc. · Live dégustation fromages & vins de Savoie",
        joined: true
      },
      {
        id: "club-archi",
        name: "Club Architecture & Vieilles Pierres",
        hostName: "Marc",
        hostRole: "Architecte & Hôte · Ste-Claire",
        members: 218,
        nextEvent: "Sam. 20 déc. · Balade photo & histoire des canaux",
        joined: false
      },
      {
        id: "club-lac",
        name: "Club Lac, Vélo & Mobilité Douce",
        hostName: "Lucas",
        hostRole: "Hôte · Les Marquisats",
        members: 486,
        nextEvent: "Dim. 21 déc. · Sortie voie verte & café au bord du lac",
        joined: false
      }
    ]
  },

  // Filtres intelligents (Vue 1)
  smartFilters: [
    { id: "all", label: "Tous les séjours", icon: "sparkles", reductionPct: 0, isMostRestrictive: false },
    { id: "pool", label: "Piscine", icon: "waves", reductionPct: 68, isMostRestrictive: true },
    { id: "lake_view", label: "Vue lac", icon: "mountain", reductionPct: 42, isMostRestrictive: false },
    { id: "car_free", label: "Sans voiture", icon: "train-front", reductionPct: 25, isMostRestrictive: false },
    { id: "instant", label: "Réservation instantanée", icon: "zap", reductionPct: 18, isMostRestrictive: false },
    { id: "impact", label: "Airbnb Impact", icon: "leaf", reductionPct: 30, isMostRestrictive: false },
    { id: "free_cancel", label: "Annulation gratuite", icon: "shield-check", reductionPct: 12, isMostRestrictive: false }
  ],

  // Calendrier harmonisé (Décembre 2026 - 31 jours, prix par nuit selon niveau)
  calendar: {
    monthLabel: "Décembre 2026",
    defaultCheckIn: 11,
    defaultCheckOut: 14,
    // tier: 'low' (vert), 'mid' (ambre), 'high' (corail)
    days: [
      { day: 1, price: 98, tier: "low", available: true },
      { day: 2, price: 98, tier: "low", available: true },
      { day: 3, price: 105, tier: "low", available: true },
      { day: 4, price: 132, tier: "mid", available: true },
      { day: 5, price: 148, tier: "high", available: true },
      { day: 6, price: 124, tier: "mid", available: true },
      { day: 7, price: 95, tier: "low", available: true },
      { day: 8, price: 95, tier: "low", available: true },
      { day: 9, price: 99, tier: "low", available: true },
      { day: 10, price: 104, tier: "low", available: true },
      { day: 11, price: 138, tier: "mid", available: true },
      { day: 12, price: 152, tier: "high", available: true },
      { day: 13, price: 128, tier: "mid", available: true },
      { day: 14, price: 102, tier: "low", available: true },
      { day: 15, price: 96, tier: "low", available: true },
      { day: 16, price: 96, tier: "low", available: true },
      { day: 17, price: 108, tier: "low", available: true },
      { day: 18, price: 142, tier: "mid", available: true },
      { day: 19, price: 165, tier: "high", available: true },
      { day: 20, price: 155, tier: "high", available: true },
      { day: 21, price: 135, tier: "mid", available: true },
      { day: 22, price: 140, tier: "mid", available: true },
      { day: 23, price: 158, tier: "high", available: true },
      { day: 24, price: 179, tier: "high", available: true },
      { day: 25, price: 185, tier: "high", available: true },
      { day: 26, price: 182, tier: "high", available: true },
      { day: 27, price: 168, tier: "high", available: true },
      { day: 28, price: 149, tier: "mid", available: true },
      { day: 29, price: 156, tier: "high", available: true },
      { day: 30, price: 189, tier: "high", available: true },
      { day: 31, price: 210, tier: "high", available: true }
    ]
  },

  // Logements (8 annonces réalistes à Annecy)
  listings: [
    {
      id: "annecy-canal-loft",
      category: "logements",
      title: "Appartement lumineux sur le canal du Thiou",
      shortTitle: "Loft Canal du Thiou · Vieille Ville",
      neighborhood: "Vieille Ville, Annecy",
      host: {
        name: "Sophie",
        since: "2019",
        superhost: true,
        responseRate: "99 %",
        responseTime: "en moins de 20 min",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,94",
      reviewsCount: 38,
      instantBook: true,
      payZeroNow: true,
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      nightlyBase: 118,
      cleaningFee: 35,
      serviceFee: 28,
      cityTaxPerNight: 2.5,
      lat: 45.8992,
      lng: 6.1274,
      clusterGroup: "vieille-ville",
      filters: ["lake_view", "car_free", "instant", "impact", "free_cancel"],
      badges: {
        trust: "Trust 96 %",
        impact: "Impact A+"
      },
      accessInfo: {
        stairs: "Accès : 3e étage par escalier, sans ascenseur",
        transit: "7 min à pied de la gare · 11 min du lac · Bus à 4 min",
        security: "Détecteur de fumée & CO vérifiés · Serrure connectée Nuki · Quartier piéton calme"
      },
      cancellation: {
        tier1Date: "6 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé hors frais bancaires éventuels)",
        tier2Date: "9 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 % des nuitées et 100 % des frais de ménage"
      },
      beforeBooking: {
        rules: [
          "Arrivée autonome dès 15h00 (code transmis 24h avant)",
          "Départ jusqu'à 11h00",
          "Logement non-fumeur · Fêtes et événements non autorisés",
          "Respect du calme dans la copropriété après 22h00"
        ],
        safety: [
          "Détecteur de fumée et détecteur de monoxyde de carbone testés (nov. 2026)",
          "Extincteur et trousse de premiers secours dans l'entrée",
          "3e étage sans ascenseur (48 marches larges, rampe continue)"
        ]
      },
      photos: [
        {
          label: "Salon",
          url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
        },
        {
          label: "Chambre",
          url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80"
        },
        {
          label: "Cuisine",
          url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
        },
        {
          label: "Salle de bain",
          url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80"
        },
        {
          label: "Terrasse",
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
        }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 38 avis et photos vérifiées : aucune contradiction détectée entre l'annonce, l'accès par escalier annoncé et les retours voyageurs.",
        metrics: [
          { label: "Exactitude de la description", score: 98, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 95, source: "Basé sur 38 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 97, source: "Basé sur 38 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 94, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 88, source: "Non encore confirmé (1 cas)", status: "unconfirmed" }
        ]
      },
      impactDetails: [
        { icon: "train-front", title: "Séjour sans voiture possible", detail: "Gare SNCF à 7 min à pied, pistes cyclables au pied de l'immeuble." },
        { icon: "droplets", title: "Équipements économes vérifiés", detail: "Mousseurs hydro-économes, chauffage connecté et tri sélectif complet." },
        { icon: "store", title: "Partenaires locaux engagés", detail: "Savons artisanaux de Haute-Savoie et café torréfié à Annecy." },
        { icon: "bus", title: "Transports en commun à 4 min", detail: "Lignes Sibra 1, 2 et 4 (arrêt Bonlieu à 280 m)." }
      ],
      localExperiences: [
        {
          id: "exp-fromage",
          title: "Affinage & dégustation de fromages alpins",
          organizer: "Fromagerie Laurent · Artisan affineur",
          duration: "1h30",
          price: 34,
          capacity: "8 pers. max",
          accessibility: "Accès PMR de plain-pied",
          rating: "4,96",
          availableDays: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
          slotTime: "17h00",
          hostNote: "Mon adresse fétiche pour découvrir la tomme fermière à 3 min à pied.",
          image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80"
        },
        {
          id: "exp-vin",
          title: "Balade & dégustation au domaine viticole de Savoie",
          organizer: "Domaine des Crêts · Vigneron indépendant",
          duration: "2h30",
          price: 49,
          capacity: "10 pers. max",
          accessibility: "Navette gare incluse",
          rating: "4,91",
          availableDays: [11, 12, 14, 15, 17, 18, 19, 20],
          slotTime: "14h30",
          hostNote: "Superbe vue sur les vignes, la navette vous récupère juste devant la gare.",
          image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=80"
        },
        {
          id: "exp-ceramique",
          title: "Atelier céramique face aux montagnes",
          organizer: "Atelier Terre d'Annecy · Clara M.",
          duration: "2h00",
          price: 55,
          capacity: "6 pers. max",
          accessibility: "À 6 min à pied du logement",
          rating: "4,98",
          availableDays: [12, 13, 14, 16, 18, 19, 21],
          slotTime: "10h30",
          hostNote: "Clara est passionnante, parfait pour un matin calme face aux sommets.",
          image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80"
        }
      ],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,69",
        wouldReturnPct: 95,
        summary: "Les voyageurs saluent unanimement la vue directe sur le canal du Thiou, la luminosité matinale et le calme étonnant malgré l'emplacement central. L'accueil précis de Sophie et la propreté irréprochable reviennent dans presque tous les retours.",
        highlights: ["Vue canal & lumière naturelle", "Emplacement piéton idéal", "Literie et propreté 5 étoiles"],
        watchOut: "Quelques visiteurs mentionnent le 2e étage sans ascenseur avec de grosses valises."
      }
    },
    {
      id: "annecy-vieille-ville-atelier",
      category: "logements",
      title: "Atelier d'architecte sous les toits",
      shortTitle: "Atelier sous les toits · Ste-Claire",
      neighborhood: "Rue Sainte-Claire, Annecy",
      host: {
        name: "Marc",
        since: "2021",
        superhost: true,
        responseRate: "98 %",
        responseTime: "en moins d'une heure",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,89",
      reviewsCount: 24,
      instantBook: true,
      payZeroNow: true,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      nightlyBase: 109,
      cleaningFee: 25,
      serviceFee: 24,
      cityTaxPerNight: 2.2,
      lat: 45.8986,
      lng: 6.1262,
      clusterGroup: "vieille-ville",
      filters: ["car_free", "instant", "free_cancel"],
      badges: { trust: "Trust 93 %", impact: null },
      accessInfo: {
        stairs: "Accès : 4e étage par escalier colimaçon",
        transit: "6 min à pied de la gare · 9 min du lac",
        security: "Détecteur de fumée vérifié · Interphone vidéo"
      },
      cancellation: {
        tier1Date: "6 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "9 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée autonome dès 15h00", "Départ 11h00", "Non-fumeur"],
        safety: ["Détecteur de fumée", "Escalier étroit déconseillé aux bagages lourds"]
      },
      photos: [
        { label: "Salon", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80" },
        { label: "Chambre", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 24 avis : l'escalier en colimaçon est bien confirmé comme authentique mais sportif.",
        metrics: [
          { label: "Exactitude de la description", score: 95, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 92, source: "Basé sur 24 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 94, source: "Basé sur 24 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 91, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 85, source: "Non encore confirmé", status: "unconfirmed" }
        ]
      },
      impactDetails: [
        { icon: "train-front", title: "Hyper-centre piéton", detail: "Tout se fait à pied depuis la gare SNCF (6 min)." },
        { icon: "zap", title: "Électricité 100 % renouvelable", detail: "Contrat Enercoop Alpes vérifié." }
      ],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,69",
        wouldReturnPct: 92,
        summary: "Le charme des poutres apparentes et la décoration d'architecte séduisent particulièrement les couples et les télétravailleurs. Plusieurs séjours soulignent la qualité du Wi-Fi et la proximité immédiate des boulangeries de la rue Sainte-Claire.",
        highlights: ["Cachet architectural unique", "Connexion fibre très fiable", "Vieille ville au pied de l'immeuble"],
        watchOut: "Hauteur sous plafond mansardée sur une partie de la mezzanine pour les personnes très grandes."
      }
    },
    {
      id: "annecy-palais-isle",
      category: "logements",
      title: "Suite historique vue Palais de l'Isle",
      shortTitle: "Suite Palais de l'Isle · Centre",
      neighborhood: "Quai de l'Île, Annecy",
      host: {
        name: "Hélène",
        since: "2018",
        superhost: true,
        responseRate: "100 %",
        responseTime: "en moins de 15 min",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,96",
      reviewsCount: 52,
      instantBook: true,
      payZeroNow: true,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      nightlyBase: 129,
      cleaningFee: 30,
      serviceFee: 26,
      cityTaxPerNight: 2.5,
      lat: 45.8989,
      lng: 6.1282,
      clusterGroup: "vieille-ville",
      filters: ["lake_view", "car_free", "instant", "impact"],
      badges: { trust: "Trust 98 %", impact: "Impact A" },
      accessInfo: {
        stairs: "Accès : 2e étage par escalier en pierre",
        transit: "8 min à pied de la gare · 4 min du lac",
        security: "Détecteur fumée & CO · Serrure biométrique/code"
      },
      cancellation: {
        tier1Date: "6 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "9 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée 15h00 · Départ 11h00", "Pas de fêtes"],
        safety: ["Détecteurs vérifiés", "Double vitrage acoustique"]
      },
      photos: [
        { label: "Salon", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80" },
        { label: "Chambre", url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 52 avis : double vitrage très apprécié malgré l'emplacement central.",
        metrics: [
          { label: "Exactitude de la description", score: 99, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 97, source: "Basé sur 52 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 99, source: "Basé sur 52 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 96, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 94, source: "Basé sur 4 cas", status: "reviews" }
        ]
      },
      impactDetails: [
        { icon: "train-front", title: "100 % accessible sans voiture", detail: "Gare à 8 min, vélos en libre-service à 100 m." }
      ],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,69",
        wouldReturnPct: 96,
        summary: "La vue carte postale sur le Palais de l'Isle est décrite comme le grand point fort du séjour. Les hôtes apprécient également le double vitrage efficace qui permet de profiter de l'animation du centre tout en dormant au calme.",
        highlights: ["Panorama direct sur le Palais de l'Isle", "Double vitrage très performant", "Arrivée autonome fluide"],
        watchOut: "Stationnement difficile dans l'hyper-centre : le parking Sainte-Claire est conseillé."
      }
    },
    {
      id: "annecy-albigny-villa",
      category: "logements",
      title: "Villa avec piscine chauffée proche plage d'Albigny",
      shortTitle: "Villa piscine · Albigny",
      neighborhood: "Albigny, Annecy-le-Vieux",
      host: {
        name: "Julien",
        since: "2020",
        superhost: false,
        responseRate: "94 %",
        responseTime: "en 2 heures",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,87",
      reviewsCount: 19,
      instantBook: false,
      payZeroNow: false,
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      nightlyBase: 195,
      cleaningFee: 60,
      serviceFee: 42,
      cityTaxPerNight: 3.0,
      lat: 45.9062,
      lng: 6.1535,
      clusterGroup: "albigny",
      filters: ["pool", "lake_view", "free_cancel"],
      badges: { trust: "Trust 91 %", impact: null },
      accessInfo: {
        stairs: "Accès : Plain-pied + 1 étage (15 marches)",
        transit: "18 min à pied du centre · Bus ligne 1 à 3 min",
        security: "Alarme piscine norme NF · Détecteur de fumée"
      },
      cancellation: {
        tier1Date: "5 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "8 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée 16h00 · Départ 10h00", "Piscine chauffée d'avril à oct."],
        safety: ["Barrière de sécurité piscine", "Stationnement privé 2 voitures"]
      },
      photos: [
        { label: "Salon", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" },
        { label: "Chambre", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 19 avis : piscine conforme, hôte réactif sur demande.",
        metrics: [
          { label: "Exactitude de la description", score: 93, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 91, source: "Basé sur 19 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 89, source: "Basé sur 19 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 90, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 84, source: "Non encore confirmé", status: "unconfirmed" }
        ]
      },
      impactDetails: [],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,72",
        wouldReturnPct: 94,
        summary: "Idéale pour les familles ou groupes d'amis, la villa récolte d'excellents retours sur la piscine chauffée, le jardin clos et la cuisine très bien équipée. La plage d'Albigny à deux pas à pied est un vrai plus l'été.",
        highlights: ["Piscine chauffée & terrasse spacieuse", "Plage d'Albigny à 4 min à pied", "Équipement cuisine complet"],
        watchOut: "Nécessite 15 min de marche ou de vélo pour rejoindre la vieille ville."
      }
    },
    {
      id: "annecy-imperial-duplex",
      category: "logements",
      title: "Duplex vue panoramique sur le lac & parc",
      shortTitle: "Duplex Vue Lac · Impérial",
      neighborhood: "Quartier Impérial, Annecy",
      host: {
        name: "Claire",
        since: "2017",
        superhost: true,
        responseRate: "100 %",
        responseTime: "en moins de 30 min",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,95",
      reviewsCount: 44,
      instantBook: true,
      payZeroNow: true,
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
      nightlyBase: 149,
      cleaningFee: 40,
      serviceFee: 32,
      cityTaxPerNight: 2.8,
      lat: 45.9052,
      lng: 6.1510,
      clusterGroup: "albigny",
      filters: ["lake_view", "instant", "impact", "free_cancel"],
      badges: { trust: "Trust 97 %", impact: "Impact A" },
      accessInfo: {
        stairs: "Accès : 2e étage avec ascenseur",
        transit: "2 min du lac · 14 min à pied de la gare",
        security: "Résidence sécurisée par badge · Détecteurs fumée/CO"
      },
      cancellation: {
        tier1Date: "6 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "9 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée 15h00 · Départ 11h00", "Animaux acceptés sur demande"],
        safety: ["Ascenseur aux normes", "Détecteur CO"]
      },
      photos: [
        { label: "Salon", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80" },
        { label: "Chambre", url: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 44 avis : vue lac conforme aux photos, résidence très calme.",
        metrics: [
          { label: "Exactitude de la description", score: 98, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 96, source: "Basé sur 44 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 98, source: "Basé sur 44 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 97, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 92, source: "Basé sur 3 cas", status: "reviews" }
        ]
      },
      impactDetails: [
        { icon: "droplets", title: "Pompe à chaleur & isolation BBC", detail: "Consommation énergétique certifiée classe A." }
      ],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,74",
        wouldReturnPct: 93,
        summary: "Les voyageurs mettent en avant le panorama spectaculaire sur le lac depuis le salon et le calme résidentiel du quartier Impérial. Le confort des deux salles de bain rend le séjour très agréable à quatre.",
        highlights: ["Vue lac panoramique", "Quartier chic et verdoyant", "Deux salles d'eau pratiques"],
        watchOut: "L'accès au dernier étage se fait par un escalier intérieur un peu raide."
      }
    },
    {
      id: "annecy-bonlieu-cocon",
      category: "logements",
      title: "Cocon scandinave à 3 min du lac & Bonlieu",
      shortTitle: "Cocon Scandinave · Bonlieu",
      neighborhood: "Bonlieu, Annecy",
      host: {
        name: "Antoine",
        since: "2022",
        superhost: true,
        responseRate: "97 %",
        responseTime: "en moins de 45 min",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,90",
      reviewsCount: 31,
      instantBook: true,
      payZeroNow: true,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      nightlyBase: 98,
      cleaningFee: 25,
      serviceFee: 22,
      cityTaxPerNight: 2.2,
      lat: 45.9065,
      lng: 6.1335,
      clusterGroup: null,
      filters: ["car_free", "instant", "impact", "free_cancel"],
      badges: { trust: "Trust 94 %", impact: "Impact A+" },
      accessInfo: {
        stairs: "Accès : 1er étage par escalier (16 marches)",
        transit: "4 min à pied de la gare · 3 min du Pâquier",
        security: "Détecteur fumée & CO · Boîte à clés sécurisée"
      },
      cancellation: {
        tier1Date: "6 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "9 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée 15h00 · Départ 11h00", "Non-fumeur"],
        safety: ["Détecteurs vérifiés"]
      },
      photos: [
        { label: "Salon", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80" },
        { label: "Chambre", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 31 avis : propreté et proximité immédiate du lac saluées.",
        metrics: [
          { label: "Exactitude de la description", score: 96, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 94, source: "Basé sur 31 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 95, source: "Basé sur 31 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 95, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 89, source: "Non encore confirmé", status: "unconfirmed" }
        ]
      },
      impactDetails: [
        { icon: "train-front", title: "À 4 min de la gare TGV", detail: "Idéal pour un week-end 100 % train + marche." }
      ],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,66",
        wouldReturnPct: 91,
        summary: "Très apprécié pour son ambiance scandinave chaleureuse et sa propreté exemplaire. Les voyageurs soulignent qu'on rejoint le Pâquier et le bord du lac en 3 minutes à pied tout en restant dans une rue calme.",
        highlights: ["Décoration nordique apaisante", "À 3 min du Pâquier et du lac", "Excellente isolation phonique"],
        watchOut: "Cuisine compacte, parfaite pour le petit-déjeuner mais moins adaptée aux grands repas."
      }
    },
    {
      id: "annecy-marquisats-chalet",
      category: "logements",
      title: "Maison en bois & spa privatif aux Marquisats",
      shortTitle: "Maison Bois & Spa · Marquisats",
      neighborhood: "Les Marquisats, Annecy",
      host: {
        name: "Benoît",
        since: "2019",
        superhost: true,
        responseRate: "98 %",
        responseTime: "en moins d'une heure",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,92",
      reviewsCount: 27,
      instantBook: true,
      payZeroNow: true,
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      nightlyBase: 162,
      cleaningFee: 45,
      serviceFee: 34,
      cityTaxPerNight: 2.8,
      lat: 45.8895,
      lng: 6.1355,
      clusterGroup: null,
      filters: ["pool", "lake_view", "instant", "impact", "free_cancel"],
      badges: { trust: "Trust 95 %", impact: "Impact A" },
      accessInfo: {
        stairs: "Accès : Plain-pied avec terrasse jardin",
        transit: "12 min à pied de la Vieille Ville · Piste cyclable du lac à 100 m",
        security: "Détecteur fumée & CO · Portail sécurisé"
      },
      cancellation: {
        tier1Date: "6 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "9 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée 15h00 · Départ 11h00", "Spa utilisable jusqu'à 22h00"],
        safety: ["Couverture thermique sécurisée sur le spa"]
      },
      photos: [
        { label: "Salon", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
        { label: "Chambre", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 27 avis : accès plain-pied et tranquillité confirmés.",
        metrics: [
          { label: "Exactitude de la description", score: 97, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 95, source: "Basé sur 27 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 96, source: "Basé sur 27 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 94, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 90, source: "Basé sur 2 cas", status: "reviews" }
        ]
      },
      impactDetails: [
        { icon: "leaf", title: "Ossature bois locale", detail: "Construction éco-conçue en mélèze de Savoie." }
      ],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,71",
        wouldReturnPct: 97,
        summary: "Le spa privatif sur la terrasse en bois fait l'unanimité après une journée de randonnée ou de vélo. Les avis louent également la sensation de chalet montagnard tout en restant à quelques minutes de la plage des Marquisats.",
        highlights: ["Spa privatif chauffé toute l'année", "Ambiance bois chaleureuse", "Proche voie verte du lac"],
        watchOut: "Quelques marches extérieures pour accéder à l'entrée du chalet."
      }
    },
    {
      id: "annecy-courier-design",
      category: "logements",
      title: "Appartement design & balcon proche gare",
      shortTitle: "Appart Design · Courier",
      neighborhood: "Courier, Annecy",
      host: {
        name: "Nadia",
        since: "2020",
        superhost: true,
        responseRate: "99 %",
        responseTime: "en moins de 25 min",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,88",
      reviewsCount: 41,
      instantBook: true,
      payZeroNow: true,
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      nightlyBase: 92,
      cleaningFee: 20,
      serviceFee: 21,
      cityTaxPerNight: 2.2,
      lat: 45.9042,
      lng: 6.1175,
      clusterGroup: null,
      filters: ["car_free", "instant", "free_cancel"],
      badges: { trust: "Trust 94 %", impact: null },
      accessInfo: {
        stairs: "Accès : 3e étage avec ascenseur",
        transit: "2 min à pied de la gare SNCF · 7 min de la Vieille Ville",
        security: "Digicode + détecteur de fumée vérifié"
      },
      cancellation: {
        tier1Date: "6 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "9 déc. 2026 (14h00)",
        tier2Desc: "Remboursement partiel de 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée autonome dès 15h00", "Départ 11h00"],
        safety: ["Ascenseur", "Détecteur fumée"]
      },
      photos: [
        { label: "Salon", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" },
        { label: "Chambre", url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Analyse IA sur 41 avis : idéal voyageurs en train, calme côté cour.",
        metrics: [
          { label: "Exactitude de la description", score: 95, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 93, source: "Basé sur 41 avis", status: "reviews" },
          { label: "Qualité des échanges hôte", score: 96, source: "Basé sur 41 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 95, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 87, source: "Non encore confirmé", status: "unconfirmed" }
        ]
      },
      impactDetails: [],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,62",
        wouldReturnPct: 89,
        summary: "Les voyageurs arrivant en train plébiscitent la proximité immédiate de la gare (4 min à pied) et l'équipement haut de gamme de l'appartement. Le balcon ensoleillé en fin d'après-midi est souvent cité comme un bonus appréciable.",
        highlights: ["À 4 min à pied de la gare TGV", "Équipements neufs et design", "Balcon agréable au calme côté cour"],
        watchOut: "Quartier commerçant vivant en journée, plus calme le soir."
      }
    }
  ],

  // Hôtels indépendants (onglet Hôtels)
  hotels: [
    {
      id: "hotel-alpin-boutique",
      category: "hotels",
      title: "Hôtel Le Boutik · Maison indépendante",
      shortTitle: "Hôtel Le Boutik · Vieille Ville",
      neighborhood: "Rue Filaterie, Annecy",
      host: {
        name: "Équipe Le Boutik",
        since: "2016",
        superhost: true,
        responseRate: "100 %",
        responseTime: "réception 24/7",
        avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,91",
      reviewsCount: 112,
      instantBook: true,
      payZeroNow: true,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      nightlyBase: 145,
      cleaningFee: 0,
      serviceFee: 18,
      cityTaxPerNight: 2.5,
      lat: 45.8998,
      lng: 6.1269,
      clusterGroup: null,
      filters: ["car_free", "instant", "impact", "free_cancel"],
      badges: { trust: "Hôtel Indépendant", impact: "Clef Verte" },
      accessInfo: {
        stairs: "Accès : Ascenseur tous étages · Chambres PMR disponibles",
        transit: "5 min à pied de la gare · Petit-déjeuner local inclus",
        security: "Réception 24h/24 · Bagagerie gratuite"
      },
      cancellation: {
        tier1Date: "9 déc. 2026 (18h00)",
        tier1Desc: "Annulation gratuite jusqu'à 48h avant l'arrivée",
        tier2Date: "10 déc. 2026 (18h00)",
        tier2Desc: "Remboursement à 50 % jusqu'à la veille"
      },
      beforeBooking: {
        rules: ["Check-in 14h00 · Check-out 12h00", "Petit-déjeuner fermier de 7h à 10h30"],
        safety: ["Normes hôtelières ERP · Réception continue"]
      },
      photos: [
        { label: "Chambre", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80" },
        { label: "Salon", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Hôtel indépendant certifié : 112 avis vérifiés avec mention spéciale pour la literie et le petit-déjeuner savoyard.",
        metrics: [
          { label: "Exactitude de la description", score: 97, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 96, source: "Basé sur 112 avis", status: "reviews" },
          { label: "Qualité des échanges", score: 98, source: "Réception 24/7", status: "verified" },
          { label: "Fluidité de l'arrivée", score: 99, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 96, source: "Basé sur 6 cas", status: "reviews" }
        ]
      },
      impactDetails: [
        { icon: "leaf", title: "Label Clef Verte 2026", detail: "Circuits courts pour le petit-déjeuner et zéro plastique à usage unique." }
      ],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,69",
        wouldReturnPct: 92,
        summary: "Les clients retiennent l'accueil attentionné de la réception, la qualité du petit-déjeuner composé de produits savoyards locaux et le confort des matelas. L'hôtel offre un vrai esprit maison d'hôtes en plein centre.",
        highlights: ["Petit-déjeuner local généreux", "Personnel chaleureux et réactif", "Chambres calmes et bien isolées"],
        watchOut: "Certaines chambres standards donnent sur une petite cour intérieure."
      }
    },
    {
      id: "hotel-rive-lac",
      category: "hotels",
      title: "Auberge Rive du Lac · Charme & Piscine",
      shortTitle: "Auberge Rive du Lac · Veyrier",
      neighborhood: "Rive Est, Annecy",
      host: {
        name: "Famille Delacroix",
        since: "2014",
        superhost: true,
        responseRate: "98 %",
        responseTime: "en moins de 30 min",
        avatar: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80"
      },
      rating: "4,89",
      reviewsCount: 84,
      instantBook: true,
      payZeroNow: true,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      nightlyBase: 168,
      cleaningFee: 0,
      serviceFee: 21,
      cityTaxPerNight: 2.8,
      lat: 45.8825,
      lng: 6.1610,
      clusterGroup: null,
      filters: ["pool", "lake_view", "instant", "free_cancel"],
      badges: { trust: "Hôtel Indépendant", impact: "Circuit Court" },
      accessInfo: {
        stairs: "Accès : Plain-pied & 1er étage avec ascenseur",
        transit: "Navette lacustre à 2 min · Piste cyclable directe",
        security: "Parking privé fermé · Veilleur de nuit"
      },
      cancellation: {
        tier1Date: "8 déc. 2026 (14h00)",
        tier1Desc: "Annulation gratuite (100 % remboursé)",
        tier2Date: "10 déc. 2026 (14h00)",
        tier2Desc: "Remboursement à 50 %"
      },
      beforeBooking: {
        rules: ["Arrivée 15h00 · Départ 11h30"],
        safety: ["Piscine surveillée", "Normes ERP"]
      },
      photos: [
        { label: "Chambre", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80" },
        { label: "Salon", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80" },
        { label: "Terrasse", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80" },
        { label: "Salle de bain", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80" },
        { label: "Cuisine", url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=80" }
      ],
      trustDetails: {
        aiSummary: "Hôtel familial indépendant très apprécié pour sa vue sur le lac d'Annecy.",
        metrics: [
          { label: "Exactitude de la description", score: 96, source: "Vérifié", status: "verified" },
          { label: "Conformité des équipements", score: 95, source: "Basé sur 84 avis", status: "reviews" },
          { label: "Qualité des échanges", score: 97, source: "Basé sur 84 avis", status: "reviews" },
          { label: "Fluidité de l'arrivée", score: 98, source: "Vérifié", status: "verified" },
          { label: "Gestion des imprévus", score: 93, source: "Basé sur 4 cas", status: "reviews" }
        ]
      },
      impactDetails: [],
      localExperiences: [],
      aiReviewsSummary: {
        neighborhoodAvgRating: "4,73",
        wouldReturnPct: 95,
        summary: "L'auberge séduit par son jardin arboré, sa piscine extérieure face aux montagnes et la possibilité d'emprunter des vélos sur place. Les avis soulignent la tranquillité du lieu, idéale pour se ressourcer au bord du lac.",
        highlights: ["Piscine et jardin face aux sommets", "Prêt de vélos très pratique", "Atmosphère paisible hors foule"],
        watchOut: "Pensez à réserver la table du restaurant à l'avance le week-end."
      }
    }
  ],

  // Services (onglet Services : voitures, bagagerie, expériences)
  services: [
    {
      id: "srv-voiture-elec",
      category: "services",
      serviceType: "Location de voiture",
      title: "Renault 5 E-Tech 100 % électrique · Gare d'Annecy",
      shortTitle: "Mobilité Électrique · Gare",
      neighborhood: "Parvis Gare SNCF, Annecy",
      rating: "4,93",
      reviewsCount: 47,
      priceTotal: 54,
      priceUnit: "/ jour · assurance & recharge incluses",
      lat: 45.9020,
      lng: 6.1215,
      badge: "Zéro caution bloquée",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
      description: "Récupération autonome par smartphone dès la sortie du TGV. 380 km d'autonomie pour explorer le Semnoz ou le tour du lac."
    },
    {
      id: "srv-bagagerie",
      category: "services",
      serviceType: "Bagagerie sécurisée",
      title: "Consigne connectée 24/7 · Vieille Ville & Gare",
      shortTitle: "Consigne Bagages · Centre",
      neighborhood: "Rue Sommeiller, Annecy",
      rating: "4,97",
      reviewsCount: 128,
      priceTotal: 8,
      priceUnit: "/ casier XL (2 valises) · 24h",
      lat: 45.9006,
      lng: 6.1245,
      badge: "Assurance 1 500 € incluse",
      image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=900&q=80",
      description: "Déposez vos valises avant le check-in ou après le départ. Casiers sécurisés avec prise USB-C."
    },
    {
      id: "srv-croisiere-lac",
      category: "services",
      serviceType: "Expérience locale",
      title: "Croisière apéritive en bateau solaire sur le lac",
      shortTitle: "Bateau Solaire · Pâquier",
      neighborhood: "Port des Marquisats, Annecy",
      rating: "4,96",
      reviewsCount: 63,
      priceTotal: 42,
      priceUnit: "/ pers · 1h45 · dégustation incluse",
      lat: 45.8942,
      lng: 6.1332,
      badge: "Airbnb Local · Zéro émission",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
      description: "Navigation silencieuse au coucher du soleil avec un skipper local, fromages fermiers et vins de Savoie."
    },
    {
      id: "srv-velo-lac",
      category: "services",
      serviceType: "Mobilité douce",
      title: "2 Vélos à assistance électrique · Voie verte",
      shortTitle: "Vélos Électriques · Pâquier",
      neighborhood: "Avenue d'Albigny, Annecy",
      rating: "4,91",
      reviewsCount: 39,
      priceTotal: 36,
      priceUnit: "/ jour · casques & antivols inclus",
      lat: 45.9032,
      lng: 6.1380,
      badge: "Airbnb Impact",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80",
      description: "Faites le tour complet du lac d'Annecy (42 km) sans effort sur piste cyclable sécurisée."
    }
  ],

  // Airbnb Imagine : 3 scénarios modulables
  imagineDefaultPrompt: "3 jours dans un endroit authentique, avec ma copine, budget 400€/pers, bonne cuisine et nature",
  imagineScenarios: [
    {
      id: "scen-gastro",
      title: "Escapade gastronomique",
      subtitle: "Vieille Ville d'Annecy · Saveurs alpines & marché",
      badge: "Recommandé pour votre budget",
      totalPerPerson: 378,
      confirmedTotal: 274,
      estimatedTotal: 104,
      travelTime: "3h40 en TGV depuis Paris · 0 voiture",
      items: [
        {
          type: "Hébergement",
          status: "confirmed",
          statusLabel: "Prix confirmé",
          name: "Appartement lumineux sur le canal du Thiou (3 nuits)",
          price: 215,
          listingId: "annecy-canal-loft",
          alternatives: [
            { name: "Cocon scandinave à 3 min du lac (3 nuits)", price: 185, listingId: "annecy-bonlieu-cocon" },
            { name: "Suite historique vue Palais de l'Isle (3 nuits)", price: 235, listingId: "annecy-palais-isle" }
          ]
        },
        {
          type: "Activité",
          status: "confirmed",
          statusLabel: "Prix confirmé",
          name: "Affinage & dégustation de fromages alpins (2 pers.)",
          price: 59,
          alternatives: [
            { name: "Balade & dégustation domaine viticole (2 pers.)", price: 88 },
            { name: "Croisière apéritive bateau solaire (2 pers.)", price: 76 }
          ]
        },
        {
          type: "Restauration",
          status: "estimated",
          statusLabel: "Estimation locale",
          name: "2 dîners bistronomiques + marché des producteurs",
          price: 104,
          alternatives: [
            { name: "Option table étoilée + pique-nique lac", price: 145 },
            { name: "Option brasseries savoyardes & street-food", price: 78 }
          ]
        }
      ]
    },
    {
      id: "scen-culture",
      title: "Séjour culturel & patrimoine",
      subtitle: "Palais de l'Isle, Château & artisanat local",
      badge: "100 % à pied",
      totalPerPerson: 356,
      confirmedTotal: 266,
      estimatedTotal: 90,
      travelTime: "Tout à moins de 10 min à pied de la gare",
      items: [
        {
          type: "Hébergement",
          status: "confirmed",
          statusLabel: "Prix confirmé",
          name: "Atelier d'architecte sous les toits (3 nuits)",
          price: 196,
          listingId: "annecy-vieille-ville-atelier",
          alternatives: [
            { name: "Appartement design proche gare (3 nuits)", price: 174, listingId: "annecy-courier-design" },
            { name: "Hôtel Le Boutik (3 nuits + petit-déj)", price: 230, listingId: "hotel-alpin-boutique" }
          ]
        },
        {
          type: "Activité",
          status: "confirmed",
          statusLabel: "Prix confirmé",
          name: "Atelier céramique + Pass Musées d'Annecy",
          price: 70,
          alternatives: [
            { name: "Visite guidée privée Vieille Ville", price: 54 }
          ]
        },
        {
          type: "Restauration",
          status: "estimated",
          statusLabel: "Estimation locale",
          name: "Cafés de spécialité & dîner traditionnel savoyard",
          price: 90,
          alternatives: [
            { name: "Option dîner gastronomique lac", price: 130 }
          ]
        }
      ]
    },
    {
      id: "scen-nature",
      title: "Week-end nature & lac",
      subtitle: "Marquisats, vélo sur la voie verte & sommets",
      badge: "Airbnb Impact A+",
      totalPerPerson: 392,
      confirmedTotal: 302,
      estimatedTotal: 90,
      travelTime: "Piste cyclable à 100 m · Navette Semnoz 25 min",
      items: [
        {
          type: "Hébergement",
          status: "confirmed",
          statusLabel: "Prix confirmé",
          name: "Cocon scandinave à 3 min du lac (3 nuits)",
          price: 185,
          listingId: "annecy-bonlieu-cocon",
          alternatives: [
            { name: "Maison en bois & spa aux Marquisats (3 nuits)", price: 265, listingId: "annecy-marquisats-chalet" }
          ]
        },
        {
          type: "Activité",
          status: "confirmed",
          statusLabel: "Prix confirmé",
          name: "2 Vélos électriques + croisière bateau solaire",
          price: 117,
          alternatives: [
            { name: "Rando guidée raquettes / Semnoz", price: 95 }
          ]
        },
        {
          type: "Restauration",
          status: "estimated",
          statusLabel: "Estimation locale",
          name: "Panier fermier du lac & auberge de montagne",
          price: 90,
          alternatives: [
            { name: "Pique-nique artisanal local", price: 55 }
          ]
        }
      ]
    }
  ],

  // Airbnb Together : planification de groupe
  togetherData: {
    tripTitle: "Week-end Annecy · 11–14 déc.",
    aiCompromise: "L'IA propose ce logement car il réunit l'accès gare à 7 min à pied (priorité de Camille), le charme Vieille Ville (Lucas) et reste sous le seuil de confort du groupe grâce à la remise Pass Niveau 2 (-10 %).",
    participants: [
      {
        name: "Camille (vous)",
        initials: "CL",
        color: "#FF385C",
        preference: "Proche gare, sans voiture, arrivée autonome",
        budgetMax: "145 € / pers. max",
        vote: "Pour"
      },
      {
        name: "Lucas",
        initials: "LM",
        color: "#008A05",
        preference: "Vieille Ville, bonnes adresses restos à pied",
        budgetMax: "130 € / pers. max",
        vote: "Pour"
      },
      {
        name: "Thomas",
        initials: "TR",
        color: "#222222",
        preference: "Calme la nuit, lit double séparé, wifi fibre",
        budgetMax: "120 € / pers. max",
        vote: "En attente"
      }
    ]
  },

  // Airbnb Care : scénario d'imprévu voyageur (Vue 3)
  careScenario: {
    alertTitle: "Incident détecté · Retard hôte signalé",
    alertDetail: "Sophie a signalé un retard imprévu de 1h30 pour la remise des clés. Airbnb Care a activé votre protection proactive sans attente.",
    accessReminder: [
      "Votre serrure connectée Nuki reste accessible en autonomie dès 15h00 avec le code temporaire #4829.",
      "En cas de blocage sur place, la consigne partenaire Gare (Rue Sommeiller) est réservée gratuitement pour vos bagages."
    ],
    fallbacks: [
      {
        id: "annecy-palais-isle",
        title: "Suite historique vue Palais de l'Isle",
        distance: "À 180 m (2 min à pied)",
        priceDiff: "+0 € (surclassement pris en charge par Airbnb Care)",
        instant: true,
        rating: "4,96"
      },
      {
        id: "hotel-alpin-boutique",
        title: "Hôtel Le Boutik · Chambre Supérieure",
        distance: "À 240 m (3 min à pied · Réception 24/7)",
        priceDiff: "+0 € (différence couverte par garantie Pass N2)",
        instant: true,
        rating: "4,91"
      }
    ],
    summaryForAgent: "Réservation #AB-94821 · Annecy (11–14 déc.) · Retard hôte 1h30 · Client Pass Niveau 2 · Code Nuki #4829 actif · 2 replis immédiats pré-autorisés à 0 €."
  }
};
