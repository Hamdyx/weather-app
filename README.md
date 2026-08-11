# Weather App

A weather dashboard that shows current conditions, an hourly slider, and a daily forecast for a searched location, powered by the [OpenWeatherMap API](https://openweathermap.org/api). Built as a statically exported Next.js SPA with React 19, Chakra UI v3, and Redux Toolkit.

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

| Command            | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Dev server at http://localhost:3000                |
| `npm run build`    | Production build — static export into `./build`    |
| `npm start`        | Serves an existing `./build` locally (build first) |
| `npm run lint`     | ESLint                                             |
| `npm run lint:fix` | ESLint with autofix                                |

## Deployment

The app deploys to [Vercel](https://vercel.com). It is a pure static export (`output: 'export'`) — `npm run build` writes the site to `./build` and there is no server runtime. `npm start` is only a local preview of that folder; Vercel serves the exported build directly. Environment variables are baked in at build time, so set the `NEXT_PUBLIC_*` vars in the Vercel project settings.
