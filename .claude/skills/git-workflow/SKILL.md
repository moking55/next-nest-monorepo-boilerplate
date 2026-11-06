---
name: git-workflow
description: Branch, commit, push and open pull requests in this repo. Use whenever a task involves git commit, git push, creating a branch, or opening or updating a pull request.
---

# Git workflow

Every change reaches `main` through a pull request. Humans (owner and teammate) may push straight to `main` only after lint and build pass. **Agents never may**, even if asked: say it is not allowed for agents and offer to open a PR instead.

## Hard rules

- Never commit to or push to `main`. Never `git push --force` / `--force-with-lease`. Never `--no-verify`. Never merge a PR yourself.
- Commit and push only when the user asks. Do not discard uncommitted work you did not make (`reset --hard`, `checkout --`, `clean`) without asking.
- Leave other worktrees and branches alone.

## Steps

1. **Branch.** If on `main`, `git switch -c <type>/<slug>` first; uncommitted changes come along. `type` is one of `feat`, `fix`, `chore`, `docs`, `refactor`. If already on a feature branch, stay on it.
2. **Check before each commit** (commands from `AGENTS.md` "Verification"). Report real results; if one fails, say so and stop:
   - `npm run lint` (if a lint script uses `--fix` and rewrites files, run `git status` and `git restore` any file you did not mean to change)
   - `npm run build --workspace=frontend` and/or `--workspace=backend` for each workspace you touched
   - `git diff --check`
3. **Commit one concern per commit** (docs, refactor and feature are separate commits). Subject: `type(scope): imperative summary`, at most 72 characters; put the why in the body. End with the attribution trailer the session specifies.
4. **Push** the branch: `git push -u origin <branch>`.
5. **Open the PR** against `main` with `gh pr create`: Summary, Notes for review, Test plan as checkboxes. Link the scope statement or SPEC. State what was not verified. End with the PR attribution line the session specifies.

## Example

```text
refactor(frontend): replace useState with useImmer and enforce via ESLint

- Migrate the remaining useState files to useImmer (1:1, no behavior change)
- Add no-restricted-imports rule banning useState from react
```

## Notes

- LF/CRLF warnings on Windows are noise, not errors.
- The owner picks the merge method per PR on GitHub. Squash merges collapse the per-concern commits in step 3.
