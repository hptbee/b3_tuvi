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

## Codex CLI / hosts with repository skill discovery

- **Always-on map:** root `AGENTS.md`.
- **Skills:** gitignored `.agents/skills/<name>/SKILL.md` (one folder per skill, including **`$autodev`**). Recreate after a fresh clone with the codex install line above.
- **No Cursor `/autodev` slash command.** Use `$autodev` only when that host has actually discovered it. This does not imply that Codex cloud registers repository skills.
- If this folder is also opened in **Cursor**, both hosts may see `.agents/skills`; avoid also copying skills under `.cursor/skills`.

## Codex cloud / Linux

The committed `.b3/home` may contain a Windows path. Git does not transfer
ignored skill junctions from that machine. Changing the invocation to `$autodev`
alone does not install a skill.

From the product root:

```bash
bash scripts/setup-b3-cloud.sh
export B3_HOME="$(cat .b3/cloud-home)"
bash scripts/setup-b3-cloud.sh --verify
```

The bootstrap uses the canonical `hptbee/b3_ai-engineering` Linux adapter,
with the default dependency pinned to `443443094192c3c062a5164aa46ced8577dd1efd`.
It creates a local dependency cache and flattened symlinks for command skills
(including autodev) and domain skills. An existing valid `B3_HOME` or local pointer
is reused. Custom skill folders/conflicting links are refused, not replaced.
Tracked `.b3/home` and Cursor files are preserved. No skill body is copied.

For Codex cloud settings, run the bootstrap at the end of the installation
script and verify it in startup instructions. Export the resolved `B3_HOME`
when running shell commands that need B3. Publish the prepared environment
through the UI after reviewing saved configuration.

Installation proves readable files, **not registration in Codex cloud's skill
catalog**. Restarting a task or publishing an environment is not a verified
remedy for catalog registration. In the cloud session inspected here, the
catalog contained the onboarding plugin only, while executor skills were empty.

Use ordinary chat messages, without `/` or `$`:

```text
B3: autodev status
B3: plan docs/ROADMAP_NUMEROLOGY_A_TO_Z.md
B3: autodev <specific requirement or accepted plan>
B3: debug <failure>
B3: review <target>
B3: verify <claim>
B3: review-loop <target>
```

`AGENTS.md` routes these messages to the canonical B3 instructions. The helper
`bash scripts/b3-paths.sh autodev` prints source paths only; it does not execute
an AI lifecycle. The agent must read those files and perform the procedure.
See [Codex cloud B3 guide](../docs/CODEX_CLOUD_B3.md) for all actions and limits.
