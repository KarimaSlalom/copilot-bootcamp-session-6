# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-visual` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todo-visual/spec.md`

## Summary

Users need to instantly distinguish overdue incomplete todos from on-time or completed ones.
The feature adds two simultaneous visual cues to the `TodoCard` component: a 3–4 px solid
Danger-color left border and a small "Overdue" text label next to the due date. Overdue state
is computed purely on the client side by comparing `todo.dueDate` (ISO date string) with today's
calendar date. Completed todos and todos without a due date never show the indicator. The design
uses the existing `--danger-color` CSS variable (already themed light/dark in `theme.css`), so
no backend changes are required.

## Technical Context

**Language/Version**: JavaScript (ES2020) / Node.js 16+
**Primary Dependencies**: React 18 (functional components + hooks); Jest + @testing-library/react for tests
**Storage**: N/A — feature is entirely client-side; no new persistence
**Testing**: Jest + @testing-library/react (frontend unit + integration tests)
**Target Platform**: Web browser (desktop-focused React SPA)
**Project Type**: Web application (monorepo: `packages/frontend/` + `packages/backend/`)
**Performance Goals**: Overdue calculation completes within the same synchronous render cycle; no perceptible lag for lists up to 50 items
**Constraints**: Plain CSS only; no CSS-in-JS; uses existing `--danger-color` token; no backend API changes; ESLint must pass; Jest coverage ≥ 80%
**Scale/Scope**: Single-user, single list view; up to ~50 todos typical; no pagination required for this feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Consistency | ✅ PASS | `camelCase`/`PascalCase` naming used; ESLint enforced; `TodoCard.js` filename matches export; 2-space indent maintained |
| II. Test-First Development | ✅ PASS | Unit tests for `isOverdue` logic and `TodoCard` overdue rendering MUST be written first; target ≥ 80% coverage |
| III. Simplicity & Minimal Scope | ✅ PASS | No new routes, no backend changes, no new npm packages; derived state only; indicator form resolved and bounded |
| IV. UI Design System Compliance | ✅ PASS | `--danger-color` CSS variable used for both themes; caption typography (12 px) matches design scale; 3–4 px left border is layout-neutral |
| V. Monorepo Architecture | ✅ PASS | All changes confined to `packages/frontend/`; no cross-package imports introduced |

**Pre-Phase-0 gate: ALL PASS. Proceeding to research.**

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-visual/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/           ← Phase 1 output (UI component contract)
└── tasks.md             ← Phase 2 output (via /speckit.tasks — NOT created by /speckit.plan)
```

### Source Code

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js                         ← modified: add overdue logic + styling
│   │   └── __tests__/
│   │       └── TodoCard.test.js                ← modified: add overdue test cases
│   └── styles/
│       └── theme.css                           ← modified: add .todo-card--overdue CSS rule
└── (no other files changed)
```

**Structure Decision**: Web application layout (Option 2). Changes are confined exclusively to
`packages/frontend/src/` — the `TodoCard` component and its co-located tests, plus a single CSS
rule in `theme.css`. No new files are introduced at the top level; no backend files are touched.
