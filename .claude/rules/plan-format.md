# Plan format

Spec for how implementation plans must be generated in this repository. Any plan — modernization phases, features, refactors — must split work into **phases**, and every phase must specify all of the following.

## 1. Self-contained prompt

A fully self-contained, ready-to-paste prompt that assumes a **fresh session with zero memory** of prior phases or conversations. It must state:

- the branch name and base branch (`main`)
- the exact list of files to create/modify
- scope boundaries — what must **not** be touched
- acceptance criteria
- the verification commands to run

If an executor would need to ask a question or open another document to start, the prompt is not self-contained.

## 2. Agent tier and reasoning effort

A recommended agent tier and reasoning effort, chosen honestly per difficulty — not defaulting everything to the top tier. Examples:

- "Sonnet-tier, medium effort" — mechanical work: renames, config churn, boilerplate docs
- "Opus/Fable-tier, high effort" — architectural work: API redesign, state-management changes, tricky migrations

## 3. Own branch

Each phase gets its own branch from `main`, named `<type>/WA-<n>-<slug>` (e.g. `refactor/WA-3-fetch-migration`).

## 4. Conventional commits

Commits follow Conventional Commits with a scope (see `.vscode/settings.json` for configured scopes), e.g. `docs(general): add agent docs`. Gitmoji optional.

## 5. Size limit

~500 changed lines maximum per phase. If a phase can't fit, split it into more phases.

## 6. Verification section

An explicit verification section listing what must pass before the phase is done:

- `npm run lint`
- `npx tsc --noEmit`
- tests (when a test runner exists)
- `npm run build`
- a manual smoke test for UI changes (what to open, what to look for)
