# Styling and Localization Rules

- Keep global styles in `app/globals.css` unless a component clearly benefits
  from isolated styles.
- Preserve the modern liquid-glass visual direction.
- Maintain readable contrast, visible focus states, and responsive layouts.
- Respect `prefers-reduced-motion` for non-essential animation.
- Support both light and dark themes with a visible sun/moon indicator.
- Support Russian and English with an explicit `RU`/`EN` control.
- Store interface text in translation objects instead of scattering language
  conditions through JSX.
- Keep numbers and currencies language-aware with `Intl.NumberFormat`.
- Do not translate data values, currency codes, identifiers, or API fields.
