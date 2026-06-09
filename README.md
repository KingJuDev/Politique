# 🗳️ Politique - Quiz de Préférence Électorale

Une application Angular interactive permettant aux utilisateurs de découvrir quel candidat à l'élection présidentielle 2027 correspond le mieux à leurs valeurs politiques.

## ✨ Caractéristiques

- **Quiz rapide** (~5 minutes)
- **15 questions** sur 5 thèmes majeurs
- **Résultats personnalisés** avec score de compatibilité
- **Interface moderne** et responsive
- **Quatre candidats** à comparer

## 📋 Thèmes couverts

1. **💼 Économie & Emploi** - Politiques de création d'emploi
2. **🌍 Écologie & Environnement** - Enjeux climatiques
3. **⚕️ Santé & Social** - Système de santé et protection sociale
4. **🛡️ Sécurité & Immigration** - Politique de sécurité
5. **🎓 Éducation** - Politique éducative

## 🎯 Flux utilisateur

1. **Page d'accueil** - Présentation du concept
2. **Sélection des thèmes** - Choix des sujets d'intérêt (min. 2)
3. **Questions** - Répondez aux questions sur chaque thème
4. **Résultats** - Découvrez votre compatibilité avec chaque candidat

## 📋 Prérequis

- Node.js 18+
- npm 9+
- Angular CLI 18

## 🚀 Installation

```bash
# 1. Naviguer dans le répertoire du projet
cd /Users/floriojulien/Code/Angular/Politique

# 2. Installer les dépendances
npm install
```

## 🔧 Développement

```bash
# Lancer le serveur de développement
npm start

# Accéder à l'application
# http://localhost:4200/
```

Le serveur se relancera automatiquement lors de modifications des fichiers.

## 🏗️ Build production

```bash
npm run build
```

Les fichiers optimisés se trouveront dans `dist/politique/`.

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/           # Composants Angular
│   │   ├── home/            # Page d'accueil
│   │   ├── themes/          # Sélection des thèmes
│   │   ├── questions/       # Questions du quiz
│   │   └── results/         # Affichage des résultats
│   ├── models/              # Interfaces TypeScript
│   │   └── models.ts        # Modèles de données
│   ├── services/            # Services Angular
│   │   ├── data.service.ts        # Gestion des données
│   │   ├── user-state.service.ts  # État utilisateur
│   │   └── score.service.ts       # Calcul des scores
│   ├── app-routing.module.ts      # Configuration des routes
│   ├── app.module.ts              # Module principal
│   ├── app.component.ts           # Composant racine
│   └── styles.scss                # Styles globaux
├── assets/                  # Images et ressources
├── environments/            # Configuration par environnement
├── index.html              # Fichier HTML principal
├── main.ts                 # Point d'entrée
└── styles.scss             # Styles globaux
```

## 🎨 Design

- **Couleurs primaires**: Gradient bleu-violet (#667eea → #764ba2)
- **Typographie**: Système de police système (SF Pro, Segoe UI)
- **Responsive**: Mobile-first design
- **Accessibilité**: Focus states, ARIA labels

## 🔐 Sécurité des données

- Les réponses sont stockées localement dans le service d'état
- Aucune donnée n'est envoyée à un serveur
- Les résultats sont calculés côté client

## ⚠️ Avertissement

Ce quiz est à titre informatif. Les résultats représentent une simplification des positions politiques. Consultez les programmes complets des candidats pour une information politique complète.

## 📚 Modèles de données principaux

### Candidate
- `id`, `name`, `party`, `color`, `description`
- `policies`: Positions par thème

### Theme
- `id`, `name`, `icon`, `description`
- `estimatedTime`: Temps estimé en secondes

### Question
- `id`, `themeId`, `text`
- `options`: Tableau des réponses possibles

### ScoreResult
- `candidateId`, `candidateName`, `party`
- `percentage`: Score de compatibilité (0-100)

## 🛠️ Commandes disponibles

```bash
npm start       # Lancer le serveur de développement
npm run build   # Builder pour la production
npm test        # Lancer les tests
npm run watch   # Builder en mode watch
```

## 📖 Architecture

L'application suit l'architecture recommandée par Angular:

- **Lazy Loading**: Chaque route charge son module indépendamment
- **Services**: État et logique métier centralisés
- **RxJS**: Programmation réactive pour l'état
- **Routing**: Navigation déclarative entre les vues

## 🤝 Contribution

Les contributions sont bienvenues. Veuillez créer une branche pour vos modifications.

## 📄 Licence

MIT

## 📧 Contact

Pour toute question ou suggestion, veuillez ouvrir une issue.
