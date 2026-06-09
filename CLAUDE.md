# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at http://localhost:4200
npm run build    # Production build → dist/politique/
npm test         # Karma/Jasmine unit tests (Chrome headless)
npm run watch    # Build in watch mode
```

Run a single spec file by passing `--include` to the test runner via `ng test --include='**/score.service.spec.ts'`.

## Architecture

Angular 18 SPA — a political quiz that matches users to candidates based on their answers.

### User flow
`/home` → `/themes` (select ≥2) → `/questions` → `/results`

Each route is a **lazy-loaded feature module** (`home.module`, `themes.module`, `questions.module`, `results.module`). All four share three root-provided services.

### Services (`src/app/services/`)

| Service | Role |
|---|---|
| `DataService` | Static source of truth: candidates, themes, questions |
| `UserStateService` | Holds quiz session state (selected themes, answers) via `BehaviorSubject<UserState>` / `userState$` observable |
| `ScoreService` | Computes compatibility scores; each answer maps to a candidate position (−5 to +5), normalized to 0–10, averaged across all answers |

### Data model (`src/app/models/models.ts`)

`QuestionOption.positions` is a `Record<candidateId, number>` (−5 to +5) — the core of the scoring algorithm. `ScoreService.calculateScores()` does `score = Math.max(0, Math.min(10, 5 + position))` per answer, then averages to a percentage.

### State management

`UserStateService` uses a single `BehaviorSubject`; components subscribe to `userState$` via `ngOnInit`. No NgRx or external state library.

## Code style

- 2-space indentation, single quotes, semicolons (ESLint enforced)
- Prettier for formatting (`.prettierrc.json`)
- SCSS: mobile-first with breakpoints at 768 px and 480 px; global variables in `src/styles.scss`
