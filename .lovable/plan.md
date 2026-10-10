# Supply Chain Intelligence — Phase One

## Goal
Build the requested working Overview dashboard and consistent application shell using illustrative local data only.

## Scope
- Replace the template home page with a responsive light-theme enterprise workspace, collapsible navigation, compact header, search, notification and profile menus.
- Add four specified KPI cards, filterable analytics charts, and a searchable/sortable/filterable priority-exceptions table with useful local prototype actions and detail drawer.
- Make other navigation destinations polished planned-module pages, retaining shared shell and clear navigation state.
- Keep mock data separate from presentation; use existing Tailwind, Lucide, Recharts, and UI primitives without adding a backend or dependencies.
- Add route-specific metadata and focused tests for the specified KPI values and local exception interactions where practical.

## Technical approach
Define semantic light-theme tokens in `src/styles.css`; create focused app-shell, mock-data, and dashboard modules; keep navigation on TanStack Router with the Overview at `/` and one planned page route for each destination. Preserve existing setup and add the structural convention to `AGENTS.md`.

## Validation
Check the preview build log, run focused tests, and inspect the Overview in the browser for visible layout, chart rendering, interactions, and narrow-screen behavior.