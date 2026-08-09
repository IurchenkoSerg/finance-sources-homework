# Next.js Rules

- Use the App Router and keep routes under `app/`.
- Use `page.js` for route UI, `layout.js` for shared layout and metadata, and
  `route.js` for Route Handlers.
- Prefer Server Components. Add `"use client"` only when browser APIs, React
  state, effects, or event handlers require it.
- Keep secrets and authenticated external requests on the server.
- Export static `metadata` from a layout or page; use `generateMetadata` only
  when metadata depends on dynamic data.
- Do not use `next/head` in the App Router.
- Preserve valid loading, error, and empty states when changing a route.
- Check current Next.js documentation with Context7 when framework behavior or
  API syntax may have changed.
