# B3 in this product repository

This repo is attached to B3 (`b3_ai-engineering`). Meaning stays in B3; this tree holds **pointers**, **commands**, and (for Cursor) **rules/agents**.

## Shared (Cursor + Codex)

| What | Where |
| --- | --- |
| B3 location | `.b3/home` (one line) or env `B3_HOME` |
| Commands | `.cursor/commands/*.md` — procedure selectors |
| Autodev workflow | `{B3_HOME}/workflows/autonomous-development.md` |
| Rules (bodies) | `{B3_HOME}/rules/*.md` |
| Review loop | `{B3_HOME}/review-loop/` |
| Delegated roles | `{B3_HOME}/.cursor/agents/` (product also has `.cursor/agents/` for Cursor) |

**Commit:** `.b3/home`, `AGENTS.md`, `.cursor/commands/`, `.cursor/agents/`, `.cursor/rules/`, `rules/`.

**Do not commit:** `.b3/autodev/`, `.agents/skills` (local link only).

Re-attach after upgrading B3 (from your B3 clone):

```powershell
.\adapters\install-product.ps1 -ProductRoot D:\Project\b3_tuvi -HostName cursor
# and/or
.\adapters\install-product.ps1 -ProductRoot D:\Project\b3_tuvi -HostName codex
```

---

## Cursor

- Slash commands: `/autodev`, `/plan`, `/implement`, `/debug`, `/review`, `/verify`, `/review-loop` from `.cursor/commands/`.
- **Skills are not copied** into this repo. Recommended once per machine:

  `%USERPROFILE%\.cursor\skills\b3-ai-engineering` → `{B3_HOME}\.cursor\skills`

- Rules/agents: discovered from this repo’s `.cursor/rules/` and `.cursor/agents/`.

---

## Codex

- **Always-on map:** root `AGENTS.md`.
- **Skills:** gitignored `.agents/skills/<name>/SKILL.md` (one folder per skill, including **`$autodev`**). Recreate after a fresh clone with the codex install line above.
- **No `/autodev` slash command.** In Codex type `$autodev` or `/skills` then pick `autodev`. Same for `$plan`, `$implement`, `$debug`, `$review`, `$verify`, `$review-loop`.
- If this folder is also opened in **Cursor**, both hosts may see `.agents/skills`; avoid also copying skills under `.cursor/skills`.
