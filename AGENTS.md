# AGENTS.md

## State

- Never use `useState` in `apps/frontend`. Use `useImmer` from `use-immer` for all local component and hook state, including single primitives (`const [open, setOpen] = useImmer(false)`). ESLint (`no-restricted-imports` in `apps/frontend/eslint.config.mjs`) enforces this.
- Setter updaters are immer draft producers: mutate the draft (`setList((draft) => { draft.push(x) })`) or pass the next value (`setOpen(!open)`).
- There are no legacy exceptions. Do not add an ESLint override for `no-restricted-imports`.
- Do not work around the rule (for example `React.useState`, a re-exported `useState`, or disabling the lint rule) without owner approval.

## Git workflow

Details: `.claude/skills/git-workflow/SKILL.md`.

- Agents work on a branch (`feat|fix|chore|docs|refactor/<slug>`) and open a pull request for every change.
- Agents never commit or push to `main`, never force-push, never use `--no-verify`, and never merge a PR, even if asked. Humans may push to `main` directly only after `npm run lint` and the build pass.
- Before committing run `npm run lint`, the build of each touched workspace, and `git diff --check`; report results honestly.

## Verification

Before handoff, run checks proportional to the change:

```bash
npm run lint
npm run build --workspace=frontend
npm run build --workspace=backend
git diff --check
```

For frontend work, verify at least lint + build. For backend changes, run focused tests where available. Report unrelated pre-existing worktree changes; do not discard them.
