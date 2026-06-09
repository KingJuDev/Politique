# ⚡ Guide de mise en place rapide

## Prérequis

✅ Vérifiez que vous avez:
- Node.js 18+ ([télécharger](https://nodejs.org/))
- npm 9+ (inclus avec Node.js)

```bash
# Vérifier les versions
node --version  # doit être v18 ou supérieur
npm --version   # doit être 9 ou supérieur
```

## Installation en 3 étapes

### Étape 1: Naviguer dans le projet

```bash
cd /Users/floriojulien/Code/Angular/Politique
```

### Étape 2: Installer les dépendances

```bash
npm install
```

> ⏱️ Cela peut prendre 2-5 minutes selon votre connexion internet

### Étape 3: Lancer l'application

```bash
npm start
```

L'application s'ouvrira automatiquement sur http://localhost:4200/

## 🎮 Utilisation

### Page d'accueil
1. Cliquez sur "Commencer le quiz"

### Sélection des thèmes
2. Choisissez au moins 2 thèmes parmi:
   - 💼 Économie & Emploi
   - 🌍 Écologie & Environnement
   - ⚕️ Santé & Social
   - 🛡️ Sécurité & Immigration
   - 🎓 Éducation

3. Cliquez sur "Continuer"

### Quiz
4. Répondez aux questions qui s'affichent
5. Les réponses sont enregistrées automatiquement
6. La progression s'affiche en haut

### Résultats
7. Consultez votre score de compatibilité avec chaque candidat
8. Comparez les résultats

## 🛠️ Commandes utiles

```bash
# Lancer le serveur de développement
npm start

# Builder pour la production
npm run build

# Exécuter les tests
npm test

# Builder en mode watch
npm run watch
```

## ⚠️ Problèmes courants

### Port 4200 déjà utilisé?
```bash
# Lancer sur un port différent
ng serve --port 4300
```

### Modules non trouvés?
```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreurs TypeScript?
```bash
# Compilez TypeScript
npx tsc --noEmit

# Ou redémarrez le serveur
npm start
```

## 📁 Fichiers importants

- `src/app/app.module.ts` - Module principal
- `src/app/app-routing.module.ts` - Routes
- `src/app/services/data.service.ts` - Données des candidats/thèmes/questions
- `src/app/services/user-state.service.ts` - Gestion des réponses
- `src/app/services/score.service.ts` - Calcul des scores

## 🚀 Prêt à développer?

Consultez [DEVELOPMENT.md](./DEVELOPMENT.md) pour:
- Ajouter de nouveaux candidats
- Ajouter de nouveaux thèmes
- Comprendre l'architecture
- Personnaliser les styles

## 📞 Support

Si vous rencontrez des problèmes:

1. **Vérifiez les versions**
   ```bash
   node --version && npm --version
   ```

2. **Consultez les logs**
   - Les erreurs s'affichent dans le terminal
   - Ouvrez les DevTools du navigateur (F12)

3. **Recherchez en ligne**
   - Erreur TypeScript? Consultez la [documentation TypeScript](https://www.typescriptlang.org/)
   - Erreur Angular? Consultez la [documentation Angular](https://angular.io/)

## ✨ Prochaines étapes

- Modifiez les candidats dans `data.service.ts`
- Ajoutez de nouveaux thèmes et questions
- Personnalisez les couleurs et styles
- Déployez sur GitHub Pages ou Firebase Hosting

Bon développement! 🚀
