# CLAUDE.md

Guidance for AI agents (and humans) working in this repository.

## Commands

- `npm run dev` — start the Next.js dev server (http://localhost:3000)
- `npm run build` — production build; static export lands in `./build` (not `out/`)
- `npm run lint` / `npm run lint:fix` — ESLint (flat config)
- `npm start` — serves an **existing** `./build` via `npx serve`; it does not build. Run `npm run build` first.

- `npm run type-check` — type-check with `tsc --noEmit`
- `npm test` / `npm run test:watch` — Vitest
- `npm run format` / `npm run format:check` — Prettier

## Static-export constraint

`next.config.mjs` sets `output: 'export'` with `distDir: './build'` — this app is a static SPA with **no server runtime**:

- No API routes, no server actions, no middleware, no ISR/SSR.
- `NEXT_PUBLIC_*` env vars are baked into the bundle at build time. Changing them requires a rebuild; never put secrets you can't ship to the client in them.
- Production deploy is Vercel.

## Environment variables

Copy `.env.example` to `.env`. The code reads exactly three variables (see `src/features/weather/weatherSlice.ts`):

- `NEXT_PUBLIC_WEATHER_API_URL` — OpenWeatherMap `/data/2.5/weather` endpoint
- `NEXT_PUBLIC_FORECAST_API_URL` — OpenWeatherMap `/data/2.5/forecast` endpoint
- `NEXT_PUBLIC_API_KEY` — OpenWeatherMap API key

## Conventions (enforced by `eslint.config.mjs`)

- **TypeScript only** for source files — `.js`/`.jsx` sources are an ESLint error.
- **Import ordering** (blank line between groups, alphabetized): type imports first (`import type { X }`, top-level style), then builtin/external packages, then `@/*` internal imports, then local relative imports.
- **Path alias**: `@/*` → `src/*` (see `tsconfig.json`). No file extensions in imports.
- **`'use client'`**: add the directive explicitly to every component that uses hooks (`useState`, `useEffect`, `useSelector`, etc.), rather than relying on it being inherited transitively from a parent that happens to already have it.

## Architecture

- `src/app/` — App Router routes, providers (`providers.tsx`), layout, global CSS
  - `src/app/locations/` — **intentional scaffolding** for a future multi-location feature. Do not delete as "dead code".
- `src/store.ts` — Redux store
- `src/features/weather/` — weather feature: `weatherSlice.ts` (Redux Toolkit slice + async thunks), `weatherApi.ts` (fetch layer), `types.ts`, `components/` (WeatherMain, WeatherHeader, WeatherSub, DailyForecast, HourlySlider, DayItem, HourlyItem, DataStack, WeatherDrawerContent)
- `src/components/` — shared chrome (Navbar, Layout) and `ui/` Chakra UI primitives
- `src/util/` — utilities
- `src/theme.ts` — Chakra theme

`@vercel/analytics` is intentionally kept — the app deploys to Vercel.

## Git workflow

- Branch per task from `main`, named `<type>/WA-<n>-<slug>` (e.g. `docs/WA-2-agent-foundations`).
- Conventional commits with scope, optional gitmoji (e.g. `docs(general): ✏️ update readme`). Configured scopes: `config`, `general`, `layout`, `locations` (see `.vscode/settings.json`).
- PRs target `main`.

## Planning

Implementation plans generated in this repo must follow [.claude/rules/plan-format.md](.claude/rules/plan-format.md).

## Verification bar

Any change must pass all of:

```sh
npm run lint
npm run type-check
npm test
npm run format:check
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
