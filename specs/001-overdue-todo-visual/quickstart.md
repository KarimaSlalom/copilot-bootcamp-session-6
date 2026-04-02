# Quickstart: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-visual`  
**Phase**: 1 — Design  
**Date**: 2026-04-02

---

## What This Feature Does

Incomplete todo items whose due date has already passed now display two visual cues:

1. A **3 px solid red left border** on the todo card.
2. A small **"Overdue" text label** in red next to the due date.

Both cues use the existing Danger color token and respect the active light/dark theme automatically.
Completed todos and todos without a due date are never marked overdue.

---

## Files Changed

| File | Change |
|------|--------|
| `packages/frontend/src/utils/overdueUtils.js` | **New** — `isOverdue(dueDate, completed)` pure utility |
| `packages/frontend/src/utils/__tests__/overdueUtils.test.js` | **New** — unit tests for the utility (write first) |
| `packages/frontend/src/components/TodoCard.js` | **Modified** — import `isOverdue`, apply class + label |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | **Modified** — add overdue rendering tests (write first) |
| `packages/frontend/src/styles/theme.css` | **Modified** — add `.todo-card--overdue` and `.todo-overdue-label` rules |

---

## Implementation Steps (TDD order)

### Step 1 — Write utility tests (RED)

Create `packages/frontend/src/utils/__tests__/overdueUtils.test.js` with all cases from the
contracts/ table. Run `npm test --workspace=packages/frontend` — tests MUST fail (function doesn't
exist yet).

### Step 2 — Implement the utility (GREEN)

Create `packages/frontend/src/utils/overdueUtils.js` and implement `isOverdue`. Re-run tests —
all utility tests MUST pass.

### Step 3 — Write component tests (RED)

Add overdue rendering assertions to `TodoCard.test.js` (overdue label present/absent, CSS class
present/absent for each edge case). Run tests — new assertions MUST fail.

### Step 4 — Update theme.css

Add `.todo-card--overdue` and `.todo-overdue-label` rules using `var(--danger-color)`.

### Step 5 — Update TodoCard.js (GREEN)

Import `isOverdue`, compute it in the render path, conditionally apply the CSS class to the card
container, and render the `<span className="todo-overdue-label">Overdue</span>` adjacent to the
due date. Re-run tests — all component tests MUST now pass.

### Step 6 — Verify coverage

```bash
npm test --workspace=packages/frontend -- --coverage
```

Coverage for `overdueUtils.js` and the overdue-related paths in `TodoCard.js` MUST be 100%.
Overall package coverage MUST remain at ≥ 80%.

### Step 7 — Lint

```bash
npm run lint --workspace=packages/frontend
```

Zero errors before opening a pull request.

---

## Manual Verification

1. Start the app: `npm run start` from the repository root.
2. Create a todo with a due date in the past (e.g., `2020-01-01`). Leave it incomplete.
   → Card shows red left border + "Overdue" label.
3. Mark that todo as complete.
   → Both cues disappear immediately; strikethrough/opacity styling takes over.
4. Uncheck the todo.
   → Overdue cues return.
5. Create a todo with no due date. Create another with today's date. Create one with a future date.
   → None of these three show any overdue indicator.
6. Toggle dark mode (top-right button).
   → Red color updates to the dark-mode Danger token (`#ef5350`).

---

## Constitution Compliance (Post-Design Re-check)

| Principle | Status |
|-----------|--------|
| I. Code Quality & Consistency | ✅ New utility + class follow camelCase/PascalCase/BEM conventions |
| II. Test-First Development | ✅ Tests written before implementation; 100% utility coverage expected |
| III. Simplicity & Minimal Scope | ✅ No new deps, no backend changes, one utility + CSS rule + one component edit |
| IV. UI Design System Compliance | ✅ `--danger-color`, caption 12 px, 3 px left border, no ad-hoc hex codes |
| V. Monorepo Architecture | ✅ All changes in `packages/frontend/`; no cross-package imports |

**Post-design gate: ALL PASS.**
