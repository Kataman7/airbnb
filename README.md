# Airbnb · Prototype Audit UX, Fidélité & IA

Prototype web interactif statique (HTML5, CSS3, Vanilla JS, sans build step) reproduisant l'identité visuelle d'Airbnb et intégrant les préconisations UX, Fidélité et IA autour d'un séjour à Annecy.

## Lancer avec Docker

```bash
docker compose up -d --build
```

Puis ouvrir **http://localhost:8080**.

## Lancer sans Docker

Ouvrir directement `index.html` dans un navigateur ou via n'importe quel serveur HTTP statique.

## Fonctionnalités clés
- **Mode Audit : OFF / ON** (bouton flottant en bas à gauche) pour visualiser chaque préconisation UX/IA/Fidélité.
- **3 vues interactives** : Recherche & Carte Leaflet, Fiche Logement complète, Parcours d'achat / Checkout.
- **Modules intégrés** : Séparation Logements / Hôtels / Services, Airbnb Pass, Airbnb Imagine (3 scénarios modulables), Calendrier harmonisé, Filtres intelligents, Airbnb Flex, Airbnb Trust, Airbnb Impact, Airbnb Local, Airbnb Together, 0 € maintenant et Airbnb Care.
