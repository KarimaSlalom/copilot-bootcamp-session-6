# UI Component Contract: TodoCard — Overdue Indicator

**Feature**: `001-overdue-todo-visual`  
**Component**: `packages/frontend/src/components/TodoCard.js`  
**Phase**: 1 — Design  
**Date**: 2026-04-02

---

## Overview

This contract documents the externally observable interface changes to the `TodoCard` component
introduced by the overdue indicator feature. It defines rendering behavior that tests MUST assert.

---

## Props (unchanged)

`TodoCard` receives the same props as before — no new props are added:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `todo` | object | yes | Todo item (see data-model.md for fields) |
| `onToggle` | function | yes | Called with `(id)` when checkbox toggled |
| `onEdit` | function | yes | Called with `(id, title, dueDate)` on save |
| `onDelete` | function | yes | Called with `(id)` on confirmed delete |
| `isLoading` | boolean | yes | Disables interactive elements when true |

---

## Rendering Contract

### When `isOverdue(todo)` is `true`

1. **Card container** MUST have CSS class `todo-card--overdue` in addition to `todo-card`.
2. **"Overdue" label** MUST be present in the DOM as a `<span>` with class `todo-overdue-label`
   and text content exactly `"Overdue"`.
3. The label MUST be rendered inside the due-date area (adjacent to the formatted date string).
4. The card MUST NOT apply the `todo-card--overdue` class when `todo.completed` is truthy.

### When `isOverdue(todo)` is `false`

1. **Card container** MUST NOT have CSS class `todo-card--overdue`.
2. **"Overdue" label** MUST NOT be present in the DOM (no `<span>` with class `todo-overdue-label`).

### Conditions that produce `isOverdue = false` (must all be tested)

| Condition | Expected result |
|-----------|----------------|
| `todo.completed` is truthy | No indicator |
| `todo.dueDate` is `null` / absent | No indicator |
| `todo.dueDate` is an invalid string | No indicator (graceful fallback) |
| `todo.dueDate` is today's date | No indicator |
| `todo.dueDate` is a future date | No indicator |

---

## CSS Contract

New rule added to `packages/frontend/src/styles/theme.css`:

```css
.todo-card--overdue {
  border-left: 3px solid var(--danger-color);
}

.todo-overdue-label {
  color: var(--danger-color);
  font-size: 12px;
  font-weight: 400;
  margin-left: 6px;
}
```

- `var(--danger-color)` resolves to `#c62828` in light mode and `#ef5350` in dark mode.
- No other card styles are changed.

---

## New Utility Contract

New pure function exported from `packages/frontend/src/utils/overdueUtils.js`:

```js
/**
 * Returns true if the todo is incomplete and its dueDate is strictly before today.
 * @param {string|null} dueDate - ISO date string (YYYY-MM-DD) or null
 * @param {boolean|number} completed - truthy = done
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed) { ... }
```

| Input | Expected return |
|-------|----------------|
| `(null, false)` | `false` |
| `('invalid', false)` | `false` |
| `('2099-01-01', false)` | `false` |
| `(todayString, false)` | `false` |
| `('2020-01-01', false)` | `true` |
| `('2020-01-01', true)` | `false` |
| `('2020-01-01', 1)` | `false` |
| `('2020-01-01', 0)` | `true` |

---

## Test Assertions (minimum required)

Tests in `TodoCard.test.js` MUST cover:

- `getByText('Overdue')` present when `completed=0` + past `dueDate`
- `queryByText('Overdue')` returns null for completed todo with past `dueDate`
- `queryByText('Overdue')` returns null for todo with no `dueDate`
- `queryByText('Overdue')` returns null for todo with today's `dueDate`
- `container.querySelector('.todo-card--overdue')` non-null iff `isOverdue` is true

Tests in `overdueUtils.test.js` MUST cover all rows in the utility contract table above.
