# Find That Year

A history game. Each round shows a world event; the player guesses the year, then narrows it down stage by stage. Rounds are endless ( random event each time ); a true one-per-day mode is a possible later step. Fewer mistakes is a better score. Design source: Figma file "Find That Year" ( https://www.figma.com/design/Iwo0i1dKr1cUUfW8YYite7/Find-That-Year ).

## Stack

- Vite + React 19 + TypeScript, Tailwind v4 ( tokens live in `src/index.css` under `@theme` ).
- Vitest for the game logic. No UI tests.
- No backend. Events come from a local list and the current round is saved in localStorage under one key.

## Deployment

Live at https://lotem-e.github.io/find-that-year/ via `.github/workflows/deploy.yml`: every push to `main` runs the tests, builds, and publishes `dist`. The Vite `base` is `/find-that-year/`, so in dev the app is at http://localhost:5179/find-that-year/ ( the root redirects there ). Own URLs must go through `import.meta.env.BASE_URL`.

## Commands

- `npm run dev` - dev server ( the workspace launch.json runs it on port 5179 ).
- `npm test` - unit tests for `src/game`.
- `npm run build` - type-check and production build.

## How the game works

1. `src/game/events.ts` - the event pool and `randomEvent`, which never repeats the event just played. `App.tsx` wraps the game reducer in a tiny session reducer whose only extra action is `next`.
2. `src/game/scoring.ts` - pure rules. Years are split into buckets with integer division: millennium = floor( y / 1000 ), century = floor( y / 100 ), decade = floor( y / 10 ). So "the 18th century" is 1700 - 1799, the popular convention, not 1701 - 1800.
3. `src/game/state.ts` - the reducer. Phases: `first-guess` -> `feedback` -> `narrowing` -> `done`. The first guess is classified into a tier ( bce, millennium, century, decade, year, exact ). Stages the guess already got right are skipped. Every wrong pick adds an error box in the stage's color; five boxes means the game is lost. A stage with a single option is resolved automatically.
4. `src/game/copy.ts` - every piece of UI text, including the per-tier feedback messages.
5. `src/components/` - one component per screen plus `TopBar`, `ErrorBar` and `Button`. `App.tsx` picks the screen from the phase.

## Decisions and known gaps

- All events are AD years. A BCE guess ( zero or negative ) is always the worst tier, as in the Figma flow.
- The Figma annotations say "3 steps" for both the wrong-decade and right-decade tiers; the code uses 2 and 1, assuming that was a copy-paste slip.
- Icons in `public/icons`: millennium 1 and 3 and centuries 15 - 20 were exported from Figma; millennium 2 and centuries 1 - 14 were hand-drawn SVGs in the same flat single-color style ( 64 x 64 viewBox, cut-outs use the icon slot background color ). File numbers are human ( century-18 = 18th century ), buckets are zero-based.
- The iPhone status bar and Safari chrome in the Figma frames are decoration and are not built.

## Conventions

See `../CLAUDE.md` for the workspace rules. No em-dashes anywhere; use " - ".
