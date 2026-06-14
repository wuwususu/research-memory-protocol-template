# No-MCP File Protocol Setup

Use this mode when your agent can read and edit local files but does not support MCP.

Both MCP and no-MCP modes use the same Obsidian Markdown files as source of truth.

## 1. Copy Bootstrap

```bash
mkdir -p ~/.research-memory
cp templates/BOOTSTRAP.md ~/.research-memory/BOOTSTRAP.md
```

Edit `~/.research-memory/BOOTSTRAP.md` and replace:

```text
<YOUR_OBSIDIAN_VAULT>
```

with your actual vault path.

## 2. Copy Protocol Files

```bash
cp templates/全域科研记忆协议.md "<your-vault>/科研规范_v1.0/00_总控/"
cp templates/外部项目路径映射表.md "<your-vault>/科研规范_v1.0/00_总控/"
```

## 3. Add a Pointer to Each External Project

In each external project folder, create:

```text
.research-memory.md
```

Example:

```md
# Research Memory Pointer

Project name: Your-Project

Bootstrap:
`/Users/you/.research-memory/BOOTSTRAP.md`

Project Hub:
`/path/to/your/Obsidian Vault/科研规范_v1.0/10_科研项目/Your-Project/00_Project Hub.md`

Project Memory:
`/path/to/your/Obsidian Vault/科研规范_v1.0/10_科研项目/Your-Project/00_Project Memory.md`
```

## 4. Tell Your Agent

```text
Enter research memory mode without MCP. Read ~/.research-memory/BOOTSTRAP.md, then read the current folder's .research-memory.md, then read the Project Hub and Project Memory. Prefer summaries and registries before deep-reading old source files. At task end, write a Task Summary back to the project memory files. Final conclusions require my confirmation.
```

## Tradeoffs

Pros:

- Works with any local-file-capable agent.
- No server process.
- Easy to inspect and debug.

Cons:

- The agent must remember to follow file instructions.
- Project detection and writeback are less structured than MCP tools.
- Formatting depends more on the agent's discipline.

