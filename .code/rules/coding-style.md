# Coding Style Rules

- Use modern JavaScript ES modules with `import` and `export`.
- Prefer `const`; use `let` only when a binding must be reassigned, and do not
  use `var`.
- Use descriptive English names for files, functions, variables, props, and
  tests. React component names use `PascalCase`; functions and variables use
  `camelCase`.
- Keep functions focused on one responsibility. Extract helpers when doing so
  removes duplicated logic or makes business rules easier to test.
- Prefer early validation and early returns over deeply nested conditions.
- Keep finance calculations in pure functions under `lib/`, separate from
  React rendering and network requests.
- Do not mutate function arguments, API responses, React state, or imported
  data. Return new arrays and objects when transforming values.
- Handle expected failures explicitly. Do not leave empty `catch` blocks or
  ignore rejected promises.
- Avoid unnecessary dependencies, abstractions, comments, and clever syntax.
  Comments should explain a non-obvious reason, not repeat the code.
- Match the existing formatting and file organization. Run the checks required
  by `.code/rules/testing.md` after behavior changes.
