# Research: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-visual`  
**Phase**: 0 — Outline & Research  
**Date**: 2026-04-02

---

## 1. How to compute "overdue" status reliably in JavaScript

**Decision**: Compare the todo's `dueDate` ISO date string against today's calendar date using
local midnight boundaries — `new Date(dueDate) < new Date(todayDateString)`.

**Rationale**:
- Comparing UTC timestamps would produce wrong results when the user's local timezone is behind
  UTC (a todo due "today" in UTC would appear overdue before midnight local time).
- Using `new Date().setHours(0, 0, 0, 0)` or `toISOString().slice(0, 10)` to derive today's
  local date, then building `new Date(todayString)` normalizes both sides to midnight UTC for the
  same day, eliminating timezone drift.
- The spec specifies day-precision only (no time component), so this approach is correct and
  minimal.

**Alternatives considered**:
- UTC-only comparison (rejected: timezone issues for users west of UTC)
- External date library such as date-fns or Day.js (rejected: YAGNI — constitution Principle III
  prohibits new dependencies unless required; the native `Date` API is sufficient)

**Implementation pattern**:
```js
function isOverdue(dueDate, completed) {
  if (completed) return false;
  if (!dueDate) return false;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;  // FR-008: invalid date → treat as no date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}
```

---

## 2. How to apply the visual indicator using the existing CSS design system

**Decision**: Add a single CSS class `.todo-card--overdue` that applies
`border-left: 3px solid var(--danger-color)` and renders the "Overdue" label text via a
`<span>` inside the card's due-date area, colored `var(--danger-color)`, font-size 12px.

**Rationale**:
- `--danger-color` is already defined in `packages/frontend/src/styles/theme.css` for both
  light (`#c62828`) and dark (`#ef5350`) themes via the `[data-theme="dark"]` selector.
  No new CSS variables are needed.
- A BEM modifier class (`.todo-card--overdue`) is the minimal, side-effect-free pattern for
  conditional card variants. It does not affect non-overdue cards.
- Using a modifier class rather than inline styles keeps styling in CSS, allows easy override,
  and is consistent with the existing `.todo-card-edit` pattern in `TodoCard.js`.
- The "Overdue" `<span>` satisfies FR-001(b) and meets WCAG 1.4.1 (color not the only means of
  conveying information).

**Alternatives considered**:
- Inline `style={{ borderLeft: '3px solid #c62828' }}` (rejected: hardcodes a color value,
  breaks dark mode, violates constitution Principle I and IV)
- CSS Modules (rejected: project uses plain global CSS; no CSS Modules infrastructure exists)
- A separate `OverdueIndicator` component (rejected: YAGNI — a `<span>` and one CSS class
  inside `TodoCard` is sufficient and doesn't warrant a new file)

---

## 3. Where to place the overdue logic — component or utility

**Decision**: Extract `isOverdue(dueDate, completed)` as a pure utility function in a new file
`packages/frontend/src/utils/overdueUtils.js`, imported by `TodoCard.js`.

**Rationale**:
- A pure function isolated in its own module is independently unit-testable without rendering
  a React component, satisfying constitution Principle II (test-first).
- It avoids embedding date logic inside JSX, keeping the component's render path readable
  (constitution Principle I — Single Responsibility).
- A single-function utility file is not over-engineering; it is the lightest possible extraction.

**Alternatives considered**:
- Inline arrow function inside `TodoCard.js` (rejected: harder to test in isolation; mixes
  business logic with rendering)
- Placed inside `todoService.js` on the frontend (rejected: the service deals with API
  communication, not UI-derived state)

---

## 4. Testing strategy

**Decision**: Two test files, written before implementation:
1. `packages/frontend/src/utils/__tests__/overdueUtils.test.js` — pure unit tests for `isOverdue`
   covering all spec edge cases.
2. `packages/frontend/src/components/__tests__/TodoCard.test.js` — extended with cases for the
   overdue rendering, label presence, and class application; existing tests remain unchanged.

**Rationale**:
- Separating utility unit tests from component render tests follows constitution Principle II
  (test isolation) and keeps each test file focused on one responsibility.
- All edge cases from the spec (no due date, today, future, completed + overdue, invalid date,
  dark/light theme) can be covered without E2E infrastructure.
- `@testing-library/react` `getByText('Overdue')` verifies the DOM label; CSS class presence
  can be checked via `container.querySelector('.todo-card--overdue')`.

**Alternatives considered**:
- Testing all logic inside `TodoCard.test.js` only (rejected: date logic unit tests become
  fragile when coupled to component rendering)
- Snapshot testing (rejected: brittle for visual changes; WCAG and behavior tests are more
  valuable here)

---

## NEEDS CLARIFICATION — All Resolved

No open items. All spec ambiguities were resolved during `/speckit.clarify`.
