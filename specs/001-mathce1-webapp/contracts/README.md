# Contracts: MathCE1

**Feature**: 001-mathce1-webapp  
**Date**: 2025-12-07

## Not Applicable

Ce projet est une application **frontend-only** sans backend API.

### Raisons

1. **Pas de données sensibles** : Progression stockée localement (localStorage)
2. **Pas de synchronisation** : Les données restent sur l'appareil
3. **Simplicité** : Pas de serveur à maintenir, pas de coûts d'hébergement backend
4. **Offline-first** : L'application doit fonctionner sans connexion
5. **RGPD** : Aucune donnée personnelle n'est transmise

### Communication

L'application utilise uniquement :

| Service | Type | Objectif |
|---------|------|----------|
| Web Speech API | API Navigateur | Reconnaissance vocale (traitement cloud par le navigateur lui-même) |
| localStorage | Stockage local | Persistence des données |
| Service Worker | Cache local | Mode hors-ligne |

### Future Extension

Si un backend devient nécessaire (synchronisation multi-appareils, statistiques agrégées), les contrats seront définis dans ce dossier selon le format REST OpenAPI ou GraphQL.

Endpoints potentiels futurs :
- `POST /api/sync` : Synchronisation progression
- `GET /api/exercises` : Mise à jour banque d'exercices
- `POST /api/analytics` : Statistiques anonymisées (opt-in)
