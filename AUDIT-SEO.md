# Rapport d'audit SEO — airbnb.fr (site non possédé)

> Méthode adaptée à un audit **externe/concurrentiel** : on analyse airbnb.fr tel que
> Google le voit, sans accès à son back-end ni à sa Search Console.
> Stack simplifiée : **CrawlSEO + OpenSEO/All-In-One + GeoScore**. OpenGSC désactivé.

---

## 1. Périmètre et remarques de méthode

- **Ce qu'on peut mesurer** : tout ce qui est public — structure, balises, statuts HTTP,
  schema, liens, mots-clés, backlinks (sources libres), présence dans les IA.
- **Ce qu'on ne peut PAS mesurer** : clics, impressions, CTR, positions réelles et index
  complet de backlinks (données privées de la Search Console d'Airbnb). À mentionner
  explicitement dans le dossier.
- **Crawl poli** : robots.txt respecté, crawl limité à 300–500 URLs, délai 1–2 s entre
  requêtes, user-agent réaliste → toléré pour un usage académique.

---

## 2. 🥇 Priorité 1 — All-In-One (audit technique)

> **Changement vs plan initial** : CrawlSEO ne peut pas crawler un site tiers (l'ajout de site exige
> une propriété Google Search Console du compte, cf. `add-site-modal.tsx` / `api/sites/route.ts`).
> **All-In-One** remplace donc CrawlSEO comme crawler technique : même type de données, sans aucun
> accès Google.

**Accès** : http://localhost:3000 (mot de passe `APP_PASSWORD` dans `all-in-one/.env`).

**Site cible** : `https://www.airbnb.fr` (client ajouté puis **Run audit**).

**Données collectées** : statuts HTTP (404/301/302), titles, metas, H1–H6, liens internes/externes,
Schema.org, canonicals, contenu dupliqué, mobile-friendliness, HTTPS/headers, **Core Web Vitals**
(LCP/CLS/INP/TTFB), score de santé 0–100, problèmes classés *critical / high / medium / low*.

**Paramètres de crawl — recette anti-airbnb** :

| Paramètre | Valeur recommandée | Motif |
|---|---|---|
| Volume | 300–500 URLs max | Airbnb a des millions de pages |
| Profondeur | 3–4 clics | Limiter l'explosion du graphe |
| Sections visées | `/`, `/help/*`, `/press/*`, `/about/*`, pages destinations | Pages statiques et stables |
| Sections à écarter | `/rooms/`, `/s/`, `/book/`, `/payments/`, `/search*` | Pages dynamiques infinies, souvent bloquées par robots.txt |
| User-agent / délais | Polis (défauts de l'outil) | Anti-bot Airbnb ; respecter robots.txt |

**Livrables** : score + CSV des pages/erreurs → tableaux pour les annexes.

---

## 3. 🥈 Priorité 2 — OpenSEO + All-In-One (mots-clés & backlinks)

### OpenSEO (nécessite une clé DataForSEO)
**Accès** : http://localhost:3001 — compte local automatique `admin@localhost`.

- **Mots-clés d'Airbnb** : volumes, difficulté, CPC.
- **Backlinks** : qui pointe vers airbnb.fr, profil des domaines référents.
- **Concurrents** : compare avec **booking.com** et **expedia.fr**.
- **Aperçus de domaines** : traffic estimé, pages portées, mots-clés par position band.

⚠️ Sans clé DataForSEO, cet outil ne collecte **rien**. Clé à renseigner dans
`open-seo/.env` (`DATAFORSEO_API_KEY`) puis `docker compose up -d open-seo`.

### All-In-One (gratuit, complémentaire)
**Accès** : http://localhost:3000 (mot de passe `APP_PASSWORD` dans `all-in-one/.env`).

- **Mots-clés sans API payante** : Google **autocomplete**, **People Also Ask**,
  **recherches liées**, YouTube, Wikipedia, Reddit.
- **Clustering par IA** (avec clé gratuite Gemini/Groq) : regrouper les requêtes par
  thème + intention.
- **Briefs de contenu** et **content score**.
- **Backlinks** : profil via sources libres (GSC backlinks n'est pas disponible pour
  un site tiers) + alerte de liens nouveaux/perdus.
- **Visibilité IA** : suivi des mentions **ChatGPT/Perplexity/Claude/Gemini/AI Overviews**.

### Alternatives gratuites externes (si pas de clé payante)
Google Trends · Google Autocomplete · AnswerThePublic (limité) · Ubersuggest (3/jour) ·
SimilarWeb (gratuit) · Ahrefs Webmaster Tools (réservé aux propriétaires).

---

## 4. 🥉 Priorité 3 — GeoScore (potentiel GEO / visibilité IA)

**Accès** : http://localhost:8787 (UI embarquée en local, zéro connexion).

- Entre `https://www.airbnb.fr` ou une **sous-page clé** (accueil, une page de
  destination, une page du centre d'aide).
- Note le **score global** et les modules :
  - technique & on-page (title, metas, H1, schema, canonical, hreflang, sitemap, robots)
  - contenu (lisibilité Flesch, densité, FAQ)
  - sécurité & autorité (SSL, headers, âge de domaine, présence Wikipédia)
  - **GEO** : prédiction de citation par ChatGPT/Claude/Perplexity, opportunités de
    mots-clés, recommandations.
- Compare 3–5 pages clés entre elles → identifie les pages les plus « citables ».
- Export en CSV.

---

## 5. Ce qu'on retire de l'audit (à décider dans le dossier)

| Sujet | Question à laquelle répond l'audit |
|---|---|
| Technique | Airbnb a-t-il des pages cassées, des canonicals fautifs, du contenu dupliqué ? |
| On-page | Les balises title/meta/H1 sont-elles optimisées sur les pages de destination ? |
| Schema | Le schema (LodgingBusiness, FAQ, Product) est-il exploité sur les fiches ? |
| Contenu | Quelles requêtes longues traîne (« location vacances », « studio proche [ville] ») ? |
| Backlinks | Qui parle d'Airbnb, avec quelle ancre, vs Booking/Expedia ? |
| IA/GEO | Airbnb est-il « citable » par les IA génératives — faut-il le conseiller ? |

## 6. Good practice d'export
- Impact : le constat n'est exploitable que s'il est chiffré. Chaque constat →
  `outil + page + valeur + référence (screenshot/CSV)`.
- Export systématique en CSV depuis CrawlSEO (pages/erreurs), OpenSEO (mots-clés,
  backlinks), GeoScore (scores par page).

---

## 7. Ce qui reste hors de portée (à désactiver / ne pas utiliser)

| Outil | Raison |
|---|---|
| **OpenGSC** | Nécessite la Search Console d'un site **possédé** — conteneur désactivé dans le compose. |
| **CrawlSEO** | L'ajout de site impose une propriété GSC → inutilisable sur un site tiers. Réservé à tes propres domaines. |
| **crawlseo-db** | Simple base PostgreSQL de CrawlSEO — aucune interaction directe. |
| **GSC / GA4 / Ahrefs WT** | Accès propriétaire uniquement. |

## 8. Checklist de livraison

- [ ] Crawl airbnb.fr : 300–500 URLs, profondeur 3–4, exclusions `/rooms/ /s/ /book/ /payments/`
- [ ] CSV des pages crawlees + erreurs (statuts, titles, metas, H1, schema)
- [ ] Mots-clés extraits des title/meta des pages crawlees
- [ ] Comparaison backlinks Airbnb vs Booking vs Expedia (DataForSEO ou sources externes)
- [ ] GeoScore sur 20 pages clés + export CSV
- [ ] Synthèse : forces / faiblesses / recommandations GEO 2026