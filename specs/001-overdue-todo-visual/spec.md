# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-visual`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicator in the Todo List (Priority: P1)

A user opens their todo list and immediately sees which incomplete tasks are past their due date,
without having to compare individual dates to today's date. Items whose due date has already passed
and that have not yet been completed are rendered with a distinct visual treatment (e.g., danger
color border or label) so they stand out from non-overdue items.

**Why this priority**: This is the core value of the feature. A user who can instantly spot
overdue tasks can prioritise their work without any mental arithmetic. It delivers the complete
feature in a single, independently shippable increment.

**Independent Test**: Create two incomplete todos — one with a due date in the past and one with a
due date in the future. Load the todo list. Verify that only the past-due item displays the overdue
visual indicator. The future-due item must show no overdue styling.

**Acceptance Scenarios**:

1. **Given** an incomplete todo whose due date is before today's date, **When** the user views the
   todo list, **Then** that todo is shown with a visible overdue indicator (danger color styling).
2. **Given** an incomplete todo whose due date is today or in the future, **When** the user views
   the todo list, **Then** that todo displays no overdue indicator.
3. **Given** an incomplete todo with no due date, **When** the user views the todo list, **Then**
   that todo displays no overdue indicator.

---

### User Story 2 - Overdue Indicator Clears When Todo Is Completed (Priority: P2)

A user marks an overdue todo as complete. The overdue visual indicator immediately disappears,
leaving only the completed styling (strikethrough, reduced opacity) as defined by the existing
design system.

**Why this priority**: Without this story, the list becomes misleading — completed tasks would
still appear as overdue, undermining trust in the feature. This story is the necessary complement
to P1 to make the feature fully coherent.

**Independent Test**: Create an incomplete todo with a past due date and confirm it shows the
overdue indicator. Mark the todo as complete. Verify that the overdue indicator is gone and only
the completion styling remains.

**Acceptance Scenarios**:

1. **Given** an incomplete todo showing the overdue indicator, **When** the user marks it as
   complete, **Then** the overdue indicator is removed immediately.
2. **Given** a completed todo whose due date is in the past, **When** the user views the todo list,
   **Then** no overdue indicator is shown (completed state takes precedence).
3. **Given** a completed todo that the user marks as incomplete again and whose due date is in the
   past, **When** the list re-renders, **Then** the overdue indicator reappears.

---

### User Story 3 - Overdue Indicator Respects Light and Dark Themes (Priority: P3)

A user who has switched to dark mode sees the overdue indicator in the correct danger color for
that theme, matching the established design system tokens. The indicator is equally legible in both
light and dark modes without any manual configuration.

**Why this priority**: This story ensures the feature is polished and compliant with the project's
design system. It can be deferred until P1 and P2 are complete, but is required for the feature to
be considered production-ready.

**Independent Test**: With at least one overdue incomplete todo, switch between light and dark mode.
Confirm that the overdue indicator color matches the design system's Danger token for each theme
(light: `#c62828`; dark: `#ef5350`).

**Acceptance Scenarios**:

1. **Given** an overdue todo and the app in light mode, **When** the user views the todo list,
   **Then** the overdue indicator uses the light-mode Danger color.
2. **Given** an overdue todo and the app in dark mode, **When** the user views the todo list,
   **Then** the overdue indicator uses the dark-mode Danger color.

---

### Edge Cases

- **No due date**: A todo with no due date set must never display an overdue indicator.
- **Due date is today**: A todo due today is not yet overdue; the indicator must not appear.
- **Completion after due date**: A todo completed after its due date passed must show no overdue
  indicator — completed state always takes precedence.
- **All todos overdue**: When every visible todo is overdue, all are highlighted; no special
  treatment is needed beyond the standard indicator.
- **Due date crosses midnight**: The overdue calculation is based on calendar date only (day
  precision), not time of day.
- **Empty list**: When there are no todos, no overdue logic runs and the empty state message is
  shown as normal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish incomplete todo items whose due date is strictly
  before the current calendar date from all other todos.
- **FR-002**: System MUST compute the overdue state entirely on the client side, using the todo's
  stored due date compared to the current date at render time. No backend changes are required.
- **FR-003**: System MUST NOT display the overdue indicator on a todo that is marked as complete,
  regardless of its due date.
- **FR-004**: System MUST NOT display the overdue indicator on a todo that has no due date.
- **FR-005**: System MUST NOT display the overdue indicator on a todo whose due date is today or in
  the future.
- **FR-006**: The overdue visual indicator MUST use the design system's Danger color token for the
  active theme (light mode: `#c62828`; dark mode: `#ef5350`), as defined in `docs/ui-guidelines.md`.
- **FR-007**: When a user toggles an overdue todo from incomplete to complete (or vice versa), the
  overdue indicator MUST update immediately without requiring a page reload.

### Key Entities

- **Todo Item**: existing entity with a `dueDate` field (optional date, day precision) and a
  `completed` field (boolean). These two fields are the sole inputs for the overdue calculation.
  No new fields are added to the entity.
- **Overdue Status**: a derived, read-only, client-computed property — evaluates to `true` when
  `completed === false` AND `dueDate` is strictly before today's calendar date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify every overdue incomplete todo at a glance, without reading or
  comparing individual due date values, on a list of up to 50 items.
- **SC-002**: The overdue indicator disappears immediately (within the same render cycle) when a
  todo is marked as complete — no page refresh required.
- **SC-003**: All overdue indicators render using the correct design-system Danger color in both
  light and dark mode — verified by visual inspection and/or automated style assertions.
- **SC-004**: Todos with no due date, a today due date, or a future due date display zero overdue
  indicators — 100% accuracy across all such items in the list.

## Assumptions

- "Overdue" means the todo's due date is a calendar date strictly before today; a due date of
  today is considered on-time, not overdue.
- Due date precision is at the day level; time of day is not considered.
- The overdue status is computed on the frontend only; no changes to the backend API or data
  model are required.
- The design system Danger color tokens (`#c62828` light / `#ef5350` dark) are used for the
  overdue indicator, consistent with the existing delete-action styling.
- The feature applies to the existing list view only; no new "overdue" filter, section, or
  separate view is introduced.
- The existing `dueDate` field already stores date values compatible with client-side date
  comparison — no migration or data transformation is needed.
