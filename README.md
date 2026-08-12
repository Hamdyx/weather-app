# Weather App

A weather dashboard that shows current conditions, an hourly slider, and a daily forecast for a configured location (Cairo by default), powered by the [OpenWeatherMap API](https://openweathermap.org/api). Built as a statically exported Next.js SPA with React 19, Chakra UI v3, and Redux Toolkit. Location search is planned but not yet implemented — see [Known limitations / roadmap](#known-limitations--roadmap).

## Prerequisites

- Node.js ≥ 20.9
- An OpenWeatherMap API key — sign up at [openweathermap.org](https://home.openweathermap.org/api_keys) (the free tier is enough)

## Setup

```sh
npm install
cp .env.example .env
# then put your OpenWeatherMap API key in .env as NEXT_PUBLIC_API_KEY
```

## Commands

| Command                | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Dev server at http://localhost:3000                |
| `npm run build`        | Production build — static export into `./build`    |
| `npm start`            | Serves an existing `./build` locally (build first) |
| `npm run lint`         | ESLint                                             |
| `npm run lint:fix`     | ESLint with autofix                                |
| `npm run type-check`   | Type-check with `tsc --noEmit`                     |
| `npm test`             | Run the Vitest suite                               |
| `npm run test:watch`   | Vitest in watch mode                               |
| `npm run coverage`     | Vitest with coverage report                        |
| `npm run format`       | Format the codebase with Prettier                  |
| `npm run format:check` | Check formatting without writing changes           |

## Known limitations / roadmap

- Units are hardcoded to metric — a units toggle is future work.
- There's no location search UI or persistence yet, though the state layer already supports changing the active location.
- Forecast data comes from OpenWeatherMap's free 5-day/3-hour endpoint.

## Deployment

The app deploys to [Vercel](https://vercel.com). It is a pure static export (`output: 'export'`) — `npm run build` writes the site to `./build` and there is no server runtime. `npm start` is only a local preview of that folder; Vercel serves the exported build directly. Environment variables are baked in at build time, so set the `NEXT_PUBLIC_*` vars in the Vercel project settings.
