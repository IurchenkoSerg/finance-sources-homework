# Security and Git Rules

- Never commit API keys, tokens, passwords, `.env*` files, or private user data.
- Use environment variables for secrets and document only placeholder names.
- Review `git status` and relevant diffs before committing.
- Preserve unrelated working-tree changes.
- Do not use destructive Git commands unless the user explicitly requests them.
- Do not commit, push, publish, or open a pull request unless the user asks.
- Keep commits focused and write concise English commit messages.
- Verify tests and the production build before publishing when practical.
- Prefer official documentation and official MCP servers; avoid unknown MCP
  hubs unless the user accepts the security risk.
