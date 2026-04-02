# Data Model: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-visual`  
**Phase**: 1 — Design  
**Date**: 2026-04-02

---

## Existing Entity: Todo Item

No new fields are added to the Todo Item entity. The feature relies entirely on two existing
fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | yes | Unique identifier (managed by backend) |
| `title` | string (max 255) | yes | Human-readable task description |
| `dueDate` | ISO 8601 date string (`YYYY-MM-DD`) or `null` | no | Calendar date the task is due; day precision only |
| `completed` | boolean / integer (0 or 1) | yes | `true`/`1` = done; `false`/`0` = incomplete |
| `createdAt` | ISO 8601 datetime string | yes | Creation timestamp (managed by backend) |

---

## Derived Property: Overdue Status

`isOverdue` is a **client-side, read-only, derived** property. It is never stored, never sent
to the backend, and never part of any API contract.

### Definition

```
isOverdue(todo) = true
  iff  todo.completed is falsy
  AND  todo.dueDate is a valid, parseable date string
  AND  new Date(todo.dueDate) < today (midnight local time)
```

### Truth Table

| `completed` | `dueDate` | Date relative to today | `isOverdue` |
|-------------|-----------|------------------------|-------------|
| true (1) | any | any | `false` |
| false (0) | null / absent | — | `false` |
| false (0) | invalid string | — | `false` (FR-008) |
| false (0) | valid date | future | `false` |
| false (0) | valid date | today | `false` |
| false (0) | valid date | past | **`true`** |

### State Transitions

```
┌─────────────────────────────────────┐
│  incomplete + past dueDate          │  ──→  isOverdue = true  (show indicator)
└─────────────────────────────────────┘
          │ user marks complete
          ▼
┌─────────────────────────────────────┐
│  completed + past dueDate           │  ──→  isOverdue = false (hide indicator)
└─────────────────────────────────────┘
          │ user marks incomplete
          ▼
┌─────────────────────────────────────┐
│  incomplete + past dueDate          │  ──→  isOverdue = true  (indicator reappears)
└─────────────────────────────────────┘
```

---

## Visual Representation on the TodoCard

When `isOverdue` is `true`, the following visual changes apply to the card:

| Element | Change |
|---------|--------|
| Card container | CSS class `todo-card--overdue` added; results in `border-left: 3px solid var(--danger-color)` |
| Due date area | `<span className="todo-overdue-label">Overdue</span>` rendered adjacent to the date text |
| Label color | `var(--danger-color)` (light: `#c62828`; dark: `#ef5350`) |
| Label typography | 12 px, regular weight (caption scale per design system) |

When `isOverdue` is `false`, neither the class nor the `<span>` are rendered.

---

## No Backend / Schema Changes

The backend `Todo` entity (managed by `packages/backend/src/services/todoService.js`) is
unchanged. No migration, no new API fields, no validation changes required.
