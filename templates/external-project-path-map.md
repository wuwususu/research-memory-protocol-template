# External Project Path Map

This table maps working directories outside the research-memory vault to their Project Hub records.

When an agent works in any folder, it should first check whether the current directory contains `.research-memory.md`. If no pointer file exists, it should match the path against this table.

## Path Map

| External path | Project name | Project Hub | Project Memory | Status | Notes |
|---|---|---|---|---|---|
| `<ABSOLUTE_PATH_TO_EXTERNAL_PROJECT>` | Fake-Depression-ML | `<ABSOLUTE_PATH_TO_VAULT>/research-memory-vault/10-projects/Fake-Depression-ML/00_Project Hub.md` | `<ABSOLUTE_PATH_TO_VAULT>/research-memory-vault/10-projects/Fake-Depression-ML/00_Project Memory.md` | active / needs verification | Example only |

## Update Rules

- After creating a Project Hub, replace `TBD` with the actual path.
- If an external directory contains `.research-memory.md`, prefer that pointer file.
- Do not move old files just because a path matches; link them by default.
- If multiple projects match the same path, ask the user to confirm the target project.
