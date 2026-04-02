---
description: "Task list for 001-overdue-todo-visual"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-visual/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: Tests are included — TDD order (write tests → fail → implement → pass) per constitution Principle II.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in every task description

---

## Phase 1: Setup

**Purpose**: Create the `utils/` directory structure needed to house the new overdue utility.

- [X] T001 Create `packages/frontend/src/utils/` directory and `packages/frontend/src/utils/__tests__/` subdirectory

---

## Phase 2: Foundational (Blocking Prerequisite — `isOverdue` Utility)

**Purpose**: Implement the `isOverdue` pure utility that ALL three user stories depend on. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: `TodoCard.js` changes in Phase 3 import this utility. Complete T002 and T003 first.

- [X] T002 Write unit tests for `isOverdue` in `packages/frontend/src/utils/__tests__/overdueUtils.test.js` — cover all 8 contract rows: `(null, false)→false`, `('invalid', false)→false`, `('2099-01-01', false)→false`, `(todayString, false)→false`, `('2020-01-01', false)→true`, `('2020-01-01', true)→false`, `('2020-01-01', 1)→false`, `('2020-01-01', 0)→true`
- [X] T003 Implement `isOverdue(dueDate, completed)` in `packages/frontend/src/utils/overdueUtils.js` using local-midnight boundary comparison and `isNaN` guard per research.md decision 1

**Checkpoint**: Run `npm test --workspace=packages/frontend` — all T002 tests MUST pass; no other tests should be affected

---

## Phase 3: User Story 1 — Visual Overdue Indicator in the Todo List (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a past due date display a 3 px Danger-color left border and an "Overdue" text label. Todos that are complete, have no date, have today's date, a future date, or an invalid date show no indicator.

**Independent Test**: Render `<TodoCard>` with `{ completed: 0, dueDate: '2020-01-01' }` — confirm `getByText('Overdue')` present and container has `.todo-card--overdue`. Render with `{ completed: 0, dueDate: '2099-01-01' }` — confirm neither cue appears.

### Tests for User Story 1 (write first — must FAIL before T006)

- [X] T004 [P] [US1] Add overdue rendering test cases to `packages/frontend/src/components/__tests__/TodoCard.test.js` — assert: (a) `getByText('Overdue')` present and `.todo-card--overdue` class on container when `completed=0` + past `dueDate`; (b) `queryByText('Overdue')` is null and no `.todo-card--overdue` class for `completed=0` + future `dueDate`; (c) same null assertions for `completed=0` + no `dueDate`; (d) same null assertions for `completed=0` + today's date; (e) same null assertions for `completed=0` + invalid `dueDate`

### Implementation for User Story 1

- [X] T005 [P] [US1] Add `.todo-card--overdue` and `.todo-overdue-label` CSS rules to `packages/frontend/src/styles/theme.css` using `var(--danger-color)`, `border-left: 3px solid`, `font-size: 12px`, `font-weight: 400`, `margin-left: 6px` — no hardcoded hex values
- [X] T006 [US1] Update `packages/frontend/src/components/TodoCard.js`: import `{ isOverdue }` from `../utils/overdueUtils`, compute `const overdue = isOverdue(todo.dueDate, todo.completed)` in the view path, conditionally add `todo-card--overdue` class to the card container, and render `<span className="todo-overdue-label">Overdue</span>` adjacent to the formatted due date when `overdue` is true

**Checkpoint**: At this point US1 is fully functional — `npm test --workspace=packages/frontend` must pass all T004 assertions; `isOverdue` utility tests (T002) must still pass

---

## Phase 4: User Story 2 — Overdue Indicator Clears When Todo Is Completed (Priority: P2)

**Goal**: A completed todo with a past due date shows no overdue indicator. Unchecking it immediately restores the indicator.

**Independent Test**: Render `<TodoCard>` with `{ completed: 1, dueDate: '2020-01-01' }` — confirm `queryByText('Overdue')` is null and no `.todo-card--overdue` class. Then render with `{ completed: 0, dueDate: '2020-01-01' }` — confirm both cues are present.

### Tests for User Story 2

- [X] T007 [US2] Add completion-toggle test cases to `packages/frontend/src/components/__tests__/TodoCard.test.js` — assert: (a) `queryByText('Overdue')` is null and no `.todo-card--overdue` when `completed=1` + past `dueDate`; (b) `queryByText('Overdue')` is null when `completed=1` + past `dueDate` (integer truthy); (c) `getByText('Overdue')` present when `completed=0` + past `dueDate` (re-opened state)

**Note**: No new implementation required — `isOverdue` already returns `false` when `completed` is truthy (implemented in T003/T006).

**Checkpoint**: At this point US1 AND US2 are independently functional — all T004 and T007 assertions must pass

---

## Phase 5: User Story 3 — Overdue Indicator Respects Light and Dark Themes (Priority: P3)

**Goal**: The overdue indicator class is applied consistently regardless of active theme; the CSS uses `var(--danger-color)` so it resolves correctly in both light (`#c62828`) and dark (`#ef5350`) modes without any JS changes.

**Independent Test**: With `data-theme="dark"` set on the document element, render `<TodoCard>` with `{ completed: 0, dueDate: '2020-01-01' }` — confirm `.todo-card--overdue` class is present (same as light mode — CSS variable handles the color).

### Tests for User Story 3

- [X] T008 [US3] Add theme-compliance test cases to `packages/frontend/src/components/__tests__/TodoCard.test.js` — assert: (a) `.todo-card--overdue` class is present when `data-theme="dark"` is set on `document.documentElement` and todo is overdue; (b) CSS rule for `.todo-card--overdue` in `packages/frontend/src/styles/theme.css` uses `var(--danger-color)` and not a hardcoded hex value (verify by importing and checking the stylesheet, or by snapshot)

**Note**: No new implementation required — `theme.css` already defines `--danger-color` for both themes via `[data-theme="dark"]` selector (implemented in T005).

**Checkpoint**: All three user stories are independently functional and tested

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify coverage gates and lint compliance before the pull request.

- [X] T009 Run Jest coverage for `packages/frontend` via `npm test --workspace=packages/frontend -- --coverage` and confirm: overall coverage ≥ 80%; `overdueUtils.js` at 100% line/branch/function coverage
- [X] T010 Run ESLint via `npm run lint --workspace=packages/frontend` (or equivalent) and fix any errors in `overdueUtils.js`, `TodoCard.js`, `theme.css`, and test files

---

## Dependencies

```
T001 → T002 → T003 → T004 [P]
                    → T005 [P]
                    → T003 → T006 (depends on T003 utility + T004 test pass + T005 CSS)
                           → T007 (verifies T006 behavior)
                           → T008 (verifies T005 + T006 behavior)
                           → T009 (after T006, T007, T008)
                           → T010 (after T006)
```

**User story completion order**: US1 (T001–T006) → US2 (T007) → US3 (T008) → Polish (T009–T010)

**Parallel execution within Phase 3**: T004 (test file) and T005 (CSS file) target different files and MUST both complete before T006.

---

## Parallel Execution Examples

### Phase 2 (sequential — T002 must produce failing tests before T003 implements):
```
T002 (write tests) → T003 (implement)
```

### Phase 3 US1 (T004 and T005 in parallel, then T006):
```
┌─ T004: TodoCard.test.js (overdue rendering tests) ─┐
│                                                      ├→ T006: TodoCard.js (implementation)
└─ T005: theme.css (CSS rules)        ────────────────┘
```

---

## Implementation Strategy

**MVP scope**: Phases 1–3 (T001–T006). This delivers US1 completely — users can see the overdue indicator on past-due incomplete todos.

**Incremental delivery**:
1. **T001–T003**: `isOverdue` utility live and tested. No UI change yet.
2. **T004–T006**: Full US1 visible in the browser. Passes all unit + component tests.
3. **T007**: US2 test coverage confirmed (behavior already works from T006).
4. **T008**: US3 theme compliance confirmed (CSS already works from T005).
5. **T009–T010**: PR-ready: coverage gate + zero lint errors.
