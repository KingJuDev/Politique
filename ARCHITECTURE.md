# 🏗️ Architecture de l'application Politique

## Vue d'ensemble

L'application "Politique" est une application Angular single-page (SPA) moderne qui permet aux utilisateurs de répondre à un quiz politique et de découvrir leurs affinités avec différents candidats.

## Diagramme de flux

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Politique                     │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
            ┌───────▼─────────┐  ┌──▼──────────┐
            │  Services       │  │  Components │
            │                 │  │             │
            ├─────────────────┤  ├─────────────┤
            │ DataService     │  │ Home        │
            │ UserState Srv   │  │ Themes      │
            │ ScoreService    │  │ Questions   │
            │                 │  │ Results     │
            └─────────────────┘  └─────────────┘
                    │                    │
                    └────────┬───────────┘
                             │
                    ┌────────▼───────────┐
                    │   RxJS Observable  │
                    │   (State Mgmt)     │
                    └────────────────────┘
```

## Architecture en couches

### 1. Couche de présentation (Components)

**Responsabilités:**
- Afficher l'interface utilisateur
- Gérer les interactions utilisateur
- Afficher les données

**Composants:**
- `HomeComponent`: Page d'accueil
- `ThemesComponent`: Sélection des thèmes
- `QuestionsComponent`: Affichage des questions
- `ResultsComponent`: Affichage des résultats

**Organisation:**
```
src/app/components/
├── home/
│   ├── home.component.ts
│   ├── home.component.html
│   ├── home.component.scss
│   └── home.module.ts
├── themes/
│   ├── themes.component.ts
│   ├── themes.component.html
│   ├── themes.component.scss
│   └── themes.module.ts
├── questions/
│   └── ...
└── results/
    └── ...
```

### 2. Couche métier (Services)

**Responsabilités:**
- Logique applicative
- Gestion de l'état
- Calculs

**Services:**

#### DataService
- **Rôle:** Fournir les données statiques
- **Données:** Candidats, thèmes, questions
- **Méthodes principales:**
  - `getCandidates()`: Récupère tous les candidats
  - `getThemes()`: Récupère tous les thèmes
  - `getQuestionsByTheme(themeId)`: Récupère les questions d'un thème

#### UserStateService
- **Rôle:** Gérer l'état utilisateur
- **État:** Thèmes sélectionnés, réponses, temps écoulé
- **Méthodes principales:**
  - `selectTheme(themeId)`: Sélectionne un thème
  - `addAnswer(answer)`: Enregistre une réponse
  - `getAnswers()`: Récupère toutes les réponses
  - Observable `userState$` pour les abonnements réactifs

#### ScoreService
- **Rôle:** Calculer les scores de compatibilité
- **Calcul:** Position du candidat × Réponse de l'utilisateur
- **Méthodes principales:**
  - `calculateScores(answers)`: Calcule les scores pour tous les candidats

### 3. Couche de données (Models)

**Interfaces TypeScript:**

```typescript
interface Candidate {
  id: string;
  name: string;
  party: string;
  color: string;
  description: string;
  policies: Record<string, number[]>;
}

interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  estimatedTime: number;
}

interface Question {
  id: string;
  themeId: string;
  text: string;
  options: QuestionOption[];
}

interface QuestionOption {
  id: string;
  text: string;
  value: number;
  positions: Record<string, number>;
}

interface UserAnswer {
  questionId: string;
  optionId: string;
  themeId: string;
}

interface ScoreResult {
  candidateId: string;
  candidateName: string;
  party: string;
  color: string;
  score: number;
  percentage: number;
}

interface UserState {
  selectedThemes: string[];
  answers: UserAnswer[];
  startTime: number;
  completed: boolean;
}
```

## Flux de données (Data Flow)

### Étape 1: Sélection des thèmes
```
ThemesComponent
    │
    ├─ Affiche les thèmes de DataService
    │
    └─ onToggle()
       │
       └─ UserStateService.selectTheme()
          │
          └─ BehaviorSubject.next() → mise à jour
```

### Étape 2: Répondre aux questions
```
QuestionsComponent
    │
    ├─ Charger les questions de DataService
    │
    └─ onSelectAnswer()
       │
       └─ UserStateService.addAnswer()
          │
          └─ BehaviorSubject.next() → mise à jour
```

### Étape 3: Calculer les résultats
```
ResultsComponent
    │
    ├─ Récupérer les réponses de UserStateService
    │
    └─ ScoreService.calculateScores()
       │
       ├─ Pour chaque réponse:
       │   ├─ Récupérer position du candidat
       │   └─ Calculer score = 5 + position
       │
       └─ Moyenne des scores → Score final
```

## Gestion de l'état

### Problème
Les données doivent être partagées entre plusieurs composants.

### Solution
BehaviorSubject avec RxJS Observables

```typescript
// UserStateService
private userStateSubject = new BehaviorSubject<UserState>(this.userState);
public userState$: Observable<UserState> = this.userStateSubject.asObservable();

// Dans les composants
ngOnInit() {
  this.userStateService.userState$.subscribe(state => {
    this.selectedThemes = state.selectedThemes;
  });
}
```

### Avantages
- ✅ Données réactives et centralisées
- ✅ Pas de props drilling
- ✅ Facile à tester
- ✅ Performance optimisée

## Routing

### Configuration des routes

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'themes', loadChildren: () => import('./components/themes/themes.module').then(m => m.ThemesModule) },
  // ...
];
```

### Lazy Loading
Chaque module est chargé seulement quand nécessaire:
- Réduit la taille initiale du bundle
- Améliore la performance au démarrage

## Scoring Algorithm

### Exemple de calcul

```
Question: "Réduire les impôts des entreprises?"
Réponse utilisateur: "Réduire modérément" (position: 3)

Candidat 1: position = 4 → score = 5 + 4 = 9/10
Candidat 2: position = 1 → score = 5 + 1 = 6/10
Candidat 3: position = -2 → score = 5 - 2 = 3/10

Score final = Moyenne de toutes les questions
```

### Normalization
Les positions varient de -5 à +5, on les normalise à 0-10 en ajoutant 5.

## Styling Architecture

### Structure SCSS
```
styles.scss (Global)
    ├── Resets
    ├── Variables
    ├── Typographie
    └── Animations

Components
    ├── .component.scss (Scoped)
    └── Utilise les variables globales
```

### Breakpoints pour Responsive
```scss
// Mobile first
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

## Performance

### Optimizations
1. **Lazy Loading** des modules
2. **OnPush Change Detection** (peut être ajouté)
3. **Pipe Async** pour les observables (où applicable)
4. **Code Splitting** automatique par route
5. **Tree Shaking** en production

### Bundle Size
```
Initial bundle: ~150KB (gzipped)
avec lazy loading: ~50KB initial + ~20-30KB par route
```

## Sécurité

### Considérations
1. ✅ Aucune donnée sensible stockée localement
2. ✅ Quiz est purement client-side
3. ✅ Pas de requête API exposée
4. ✅ TypeScript en mode strict

### Recommandations futures
- Utiliser HTTPS en production
- Ajouter une validation côté serveur si API ajoutée
- Implémenter CORS si backend distant

## Testing

### Structure des tests

```typescript
// app.component.spec.ts
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Types de tests
- **Unit tests**: Services et logique
- **Component tests**: Interaction UI
- **Integration tests**: Flux complet
- **E2E tests**: Avec Cypress/Playwright

## Diagramme des états

```
START
  ↓
HOME
  ↓
THEMES (select min 2)
  ↓
QUESTIONS (answer all)
  ↓
RESULTS
  ↓
RESTART? → Yes → HOME
         → No → Exit
```

## Améliorations futures

### Court terme
- [ ] Ajouter plus de candidats
- [ ] Ajouter plus de thèmes
- [ ] Animations de transition
- [ ] Dark mode

### Moyen terme
- [ ] Backend API
- [ ] Persistance en base de données
- [ ] Partage des résultats
- [ ] Analytics

### Long terme
- [ ] Multi-langue
- [ ] Progressive Web App (PWA)
- [ ] Mobile app native
- [ ] Intégration réseau social

## Ressources

- [Angular Architecture](https://angular.io/guide/architecture)
- [RxJS Best Practices](https://rxjs.dev/guide/operators)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
