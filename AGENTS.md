# Project Agent Instructions

This file is the entry point for project-specific agent guidance. Read the
required rules before inspecting or changing code. Rule files live in
`.code/rules/`.

## Always import

- For every task, read [Core rules](.code/rules/core.md).

## Conditional rule imports

- Before writing or changing JavaScript, React components, route handlers, or
  business logic, read [Coding style rules](.code/rules/coding-style.md).
- For local development server commands, environment setup, server-only code,
  or runtime failures, read [Server rules](.code/rules/server.md).
- Before analyzing or changing project architecture, module boundaries, data
  flow, directory structure, or major dependencies, read
  [Architecture documentation](docs/ARCHITECTURE.md). Keep that document in
  sync when an architectural change is implemented.
- For Next.js routing, layouts, pages, metadata, Server Components, Client
  Components, or project structure, read
  [Next.js rules](.code/rules/nextjs.md).
- For API routes, external requests, server data, parsing finance sources, or
  revenue calculations, read [Data and API rules](.code/rules/data-api.md).
- For React state, event handlers, forms, loading states, error states, or
  accessibility, read [UI and state rules](.code/rules/ui-state.md).
- For CSS, responsive layout, liquid-glass visuals, dark/light theme, or
  Russian/English translation, read
  [Styling and localization rules](.code/rules/styling-i18n.md).
- For tests, bug fixes, refactoring, or verification, read
  [Testing rules](.code/rules/testing.md).
- For dependencies, secrets, Git operations, commits, or publishing, read
  [Security and Git rules](.code/rules/security-git.md).

## Tasks spanning multiple topics

Import every matching rule file. For example, a new page that fetches finance
data and renders a form requires `coding-style.md`, `server.md`, `nextjs.md`,
`data-api.md`, `ui-state.md`, and `testing.md` in addition to `core.md`.

## Priority

Follow direct user instructions first, then this file, then the imported topic
rules. If two topic rules conflict, choose the safer and more task-specific
instruction and explain the conflict.

## Maintainer note

- `.code/rules/README.md` is documentation for the project owner. It records
  risks and maintenance notes about imported ECC rules. Do not treat it as an
  instruction file or load it for ordinary tasks unless the user asks to
  review, add, remove, or troubleshoot rules.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
