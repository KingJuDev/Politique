# 📚 Guide de Développement - Politique

## Vue d'ensemble de l'architecture

### Services

#### DataService
Fournit tous les données statiques: candidats, thèmes, questions.

```typescript
// Accédez aux candidats
const candidates = this.dataService.getCandidates();
const candidate = this.dataService.getCandidate('candidate_id');

// Accédez aux questions
const questions = this.dataService.getQuestions();
const themeQuestions = this.dataService.getQuestionsByTheme('theme_id');
```

#### UserStateService
Gère l'état utilisateur et les réponses du quiz.

```typescript
// Sélectionner des thèmes
this.userStateService.selectTheme('theme_id');
this.userStateService.deselectTheme('theme_id');

// Enregistrer une réponse
this.userStateService.addAnswer({
  questionId: 'q1',
  optionId: 'q1_o1',
  themeId: 'theme_1'
});

// Récupérer l'état
const state = this.userStateService.getCurrentState();
const answers = this.userStateService.getAnswers();
```

#### ScoreService
Calcule les scores de compatibilité.

```typescript
// Calculer les scores
const results = this.scoreService.calculateScores(answers);
```

## Ajouter de nouveaux candidats

### 1. Modifier `data.service.ts`

```typescript
private candidates: Candidate[] = [
  {
    id: 'candidate_5',
    name: 'Nouveau Candidat',
    party: 'Nouveau Parti',
    color: '#hexcolor',
    description: 'Description du candidat',
    policies: {}
  },
  // ...
];
```

### 2. Ajouter des positions dans les questions

Pour chaque option de question, ajouter une position du candidat:

```typescript
options: [
  {
    id: 'q1_o1',
    text: 'Option 1',
    value: 0,
    positions: {
      candidate_1: 3,
      candidate_2: 0,
      candidate_3: -5,
      candidate_4: -2,
      candidate_5: 1  // Nouvelle position
    }
  }
]
```

## Ajouter de nouveaux thèmes

### 1. Ajouter le thème dans `data.service.ts`

```typescript
private themes: Theme[] = [
  {
    id: 'theme_6',
    name: 'Nouveau Thème',
    icon: '🎯',
    description: 'Description du thème',
    estimatedTime: 60
  },
  // ...
];
```

### 2. Ajouter des questions

```typescript
private questions: Question[] = [
  {
    id: 'q16',
    themeId: 'theme_6',
    text: 'Question du nouveau thème?',
    options: [
      {
        id: 'q16_o1',
        text: 'Réponse 1',
        value: 2,
        positions: {
          candidate_1: 3,
          candidate_2: 0,
          candidate_3: -2,
          candidate_4: 1
        }
      },
      // ...
    ]
  },
  // ...
];
```

## Comprendre le système de scoring

### Valeurs des réponses (0-10)
- 0-2: Position très à gauche
- 3-4: Position à gauche
- 5: Position neutre/modérée
- 6-7: Position à droite
- 8-10: Position très à droite

### Positions des candidats (-5 à 5)
- -5: Fortement opposé
- 0: Neutre
- +5: Fortement en accord

### Calcul du score
1. Pour chaque réponse de l'utilisateur:
   - Récupérer la position du candidat: `score = 5 + position`
   - Normaliser entre 0 et 10

2. Moyenne de tous les scores = Score de compatibilité

## Personnaliser les couleurs

### Gradient principal
Modifiez dans chaque `.component.scss`:

```scss
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Couleurs des candidats
Chaque candidat a sa couleur définie dans l'interface `Candidate`:

```typescript
color: '#hexcolor'  // Utilisée pour les barres de score
```

## Tests

### Exécuter les tests
```bash
npm test
```

### Structure des tests

```typescript
describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all candidates', () => {
    const candidates = service.getCandidates();
    expect(candidates.length).toBe(4);
  });
});
```

## Déploiement

### Build optimisé
```bash
ng build --configuration production
```

### Déploiement sur Firebase Hosting
```bash
# Installation
npm install -g firebase-tools

# Login
firebase login

# Initialisation
firebase init hosting

# Déploiement
firebase deploy
```

## Performance

### Lazy Loading
Les modules sont chargés dynamiquement via le routeur:

```typescript
{
  path: 'questions',
  loadChildren: () => import('./components/questions/questions.module')
    .then(m => m.QuestionsModule)
}
```

### Bundle Analysis
```bash
npm run build -- --stats-json
npm install webpack-bundle-analyzer --save-dev
npx webpack-bundle-analyzer dist/politique/stats.json
```

## Accessibilité

### Guide de l'A11y
- Toutes les images ont des alternatives texte
- Navigation au clavier complète
- Contraste suffisant (AA minimum)
- Labels associés aux formulaires

### Test d'accessibilité
```bash
npm install -D @angular/cdk
npm install -D axe-core
```

## Debugging

### Chrome DevTools
1. Ouvrir les DevTools (F12)
2. Onglet "Sources" pour les breakpoints
3. Onglet "Console" pour vérifier les erreurs

### Angular DevTools
Extension Chrome pour déboguer Angular.

## Ressources

- [Documentation Angular](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Support

Pour toute question ou problème, veuillez:
1. Consulter la documentation
2. Vérifier les issues existantes
3. Créer une nouvelle issue si nécessaire
