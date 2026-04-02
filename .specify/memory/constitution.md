<!--
SYNC IMPACT REPORT
==================
Version change: [blank/unset] → 1.0.0
Modified principles: none (initial fill)
Added sections:
  - Core Principles (I–V)
  - Technical Standards
  - Development Workflow
  - Governance
Removed sections: none (initial fill)
Templates reviewed:
  - .specify/templates/plan-template.md       ✅ compatible (Constitution Check section present)
  - .specify/templates/spec-template.md       ✅ compatible (FR/user-story structure aligns)
  - .specify/templates/tasks-template.md      ✅ compatible (user-story phases align with principles)
  - .specify/templates/checklist-template.md  ✅ no conflicting references
  - .specify/templates/agent-file-template.md ✅ no conflicting references
Follow-up TODOs: none – all placeholders resolved.
-->

# Copilot Bootcamp Session 6 — Todo App Constitution

## Core Principles

### I. Code Quality & Consistency

All code MUST follow the project's formatting and naming conventions without exception:

- **Indentation**: 2 spaces everywhere (JS, JSON, CSS, Markdown).
- **Naming**: `camelCase` for variables/functions; `PascalCase` for React components and classes;
  `UPPER_SNAKE_CASE` for constants.
- **File names**: MUST match their exported component/class name (e.g., `TodoCard.js`).
- **Import order**: external libraries → internal modules → styles, each group separated by a
  blank line. No circular imports.
- **Single Responsibility**: Every module, component, and function MUST have one well-defined
  purpose. Mixed concerns MUST be split before merging.
- **Linting**: ESLint MUST pass with zero errors before any code is merged.

*Rationale*: Consistent style reduces cognitive overhead, prevents common errors, and ensures the
codebase remains maintainable as it grows through bootcamp sessions.

### II. Test-First Development (NON-NEGOTIABLE)

Tests MUST be written alongside or before implementation code:

- **Coverage target**: 80 %+ across all packages (measured by Jest coverage reports).
- **Co-location**: Test files MUST live in `__tests__/` directories next to the code under test,
  named `{filename}.test.js`.
- **Isolation**: Every test MUST be independent – no shared mutable state, no reliance on
  execution order, all external dependencies (API calls, timers) MUST be mocked.
- **Test types required**: unit tests for individual components/functions; integration tests for
  component interactions and API communication.
- **Descriptive names**: Test descriptions MUST explain the behaviour under test, not the
  implementation detail.

*Rationale*: Tests are the primary quality gate for a bootcamp project where rapid iteration
occurs. 80 %+ coverage with isolated, well-named tests enables confident refactoring and validates
behaviour across sessions.

### III. Simplicity & Minimal Scope

The application MUST stay within its defined functional boundary:

- Feature set is strictly limited to: create, read, update status, update details, and delete todo
  items with optional due dates.
- YAGNI strictly applied – no feature, abstraction, or dependency may be added unless required by
  a defined functional requirement.
- No authentication, multi-user support, filtering, search, undo/redo, bulk operations,
  categories, recurring todos, or mobile-specific optimisations.
- Complexity MUST be justified in writing before it is introduced.

*Rationale*: A minimal, focused scope keeps the bootcamp project manageable, prevents scope
creep, and ensures every line of code teaches a clear concept.

### IV. UI Design System Compliance

All UI components MUST conform to the established design system:

- **Color tokens**: Only the defined light-mode and dark-mode palette values may be used; no
  ad-hoc hex codes.
- **Spacing**: All margins and padding MUST derive from the 8px grid (xs=8px, sm=16px, md=24px,
  lg=32px, xl=48px).
- **Typography**: Font sizes and weights MUST match the defined scale (heading 28 px/700,
  subheading 18 px/600, body 16 px/400, caption 12 px/400, button 14 px/600).
- **Dark/Light mode**: Both modes MUST be supported and all new components MUST supply correct
  styles for each.
- **Component patterns**: Card, form, and list layouts MUST follow the structures defined in
  `docs/ui-guidelines.md` (border-radius 8px, sm padding, subtle shadow, hover without animation).

*Rationale*: A consistent visual language produces a professional product and teaches systematic
design-token usage – a key skill practised across the bootcamp.

### V. Monorepo Architecture & Separation of Concerns

The repository structure MUST be kept clean and boundaries honoured:

- Frontend (`packages/frontend/` – React) and backend (`packages/backend/` – Express.js) MUST
  remain in separate workspace packages with no direct cross-package imports.
- All data persistence MUST go through the Express REST API; frontend code MUST NOT touch
  persistence mechanisms directly.
- Each package owns its own tests, dependencies, and scripts.
- New shared code MUST live in a dedicated workspace package; it MUST NOT be duplicated into
  both existing packages.

*Rationale*: Maintaining a clean monorepo boundary reinforces full-stack separation-of-concerns
and mirrors real-world project structures developers will encounter beyond the bootcamp.

## Technical Standards

The project is a JavaScript monorepo managed with npm workspaces and MUST adhere to the
following constraints:

- **Runtime**: Node.js ≥ 16; npm ≥ 7.
- **Frontend**: React (functional components + hooks); no class components in new code.
- **Backend**: Express.js REST API; no alternative frameworks introduced.
- **Testing framework**: Jest for all packages; `@testing-library/react` for frontend component
  tests.
- **Styling**: Plain CSS using design tokens from `docs/ui-guidelines.md`; no CSS-in-JS
  libraries or pre-processors unless explicitly approved.
- **No database changes** beyond what is already provided by the backend persistence layer.
- **Security**: All inputs from users MUST be validated. Dependencies MUST be kept up to date;
  no known high-severity CVEs may be merged.

## Development Workflow

1. **Branching**: Feature work happens on a dedicated branch; direct commits to `main` are
   prohibited.
2. **Constitution check**: Every implementation plan MUST include a Constitution Check section
   verifying compliance with all five principles before work begins.
3. **Linting gate**: `npm run lint` MUST pass with zero errors before opening a pull request.
4. **Test gate**: `npm test` MUST pass with ≥ 80 % coverage before a pull request is merged.
5. **Peer review**: At least one reviewer MUST confirm that principles I–V are satisfied.
6. **Scope changes**: Any addition outside the defined functional requirements (Principle III)
   MUST be logged, justified, and approved before implementation.

## Governance

- This constitution supersedes all other project documents where conflicts arise.
- Amendments MUST update this file with an incremented version, a revised Sync Impact Report,
  and corresponding updates to any affected templates or docs.
- Versioning follows semantic versioning:
  - **MAJOR**: principle removal, redefinition, or backward-incompatible governance change.
  - **MINOR**: new principle or section added, or material expansion of existing guidance.
  - **PATCH**: clarification, wording fix, or non-semantic refinement.
- All pull requests MUST be checked against this constitution. Non-compliant code MUST NOT be
  merged.
- Constitution reviews are recommended at the start of each bootcamp session.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
