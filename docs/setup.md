# Setup

## Requirements

- Node.js 18+
- An Obsidian vault or Markdown folder for research memory
- An MCP-capable agent, such as opencode or Pi agent

## 1. Prepare Bootstrap

```bash
mkdir -p ~/.research-memory
cp templates/BOOTSTRAP.md ~/.research-memory/BOOTSTRAP.md
```

Edit the copied bootstrap and replace:

```text
<YOUR_OBSIDIAN_VAULT>
```

with your actual vault path.

## 2. Prepare Obsidian Files

Copy these into your research system:

```bash
mkdir -p "<your-vault>/research-memory-vault/00-control"
cp templates/global-research-memory-protocol.md "<your-vault>/research-memory-vault/00-control/"
cp templates/external-project-path-map.md "<your-vault>/research-memory-vault/00-control/"
```

Copy project templates as needed:

```bash
mkdir -p "<your-vault>/research-memory-vault/05-templates"
cp templates/project-memory-template.md "<your-vault>/research-memory-vault/05-templates/"
cp templates/figure-registry-template.md "<your-vault>/research-memory-vault/05-templates/"
cp templates/task-summary-template.md "<your-vault>/research-memory-vault/05-templates/"
```

## 3. Configure Environment

```bash
export RESEARCH_MEMORY_ROOT="<your-vault>/research-memory-vault"
export RESEARCH_MEMORY_BOOTSTRAP="$HOME/.research-memory/BOOTSTRAP.md"
```

Optional:

```bash
export RESEARCH_MEMORY_PATH_MAP="<your-vault>/research-memory-vault/00-control/external-project-path-map.md"
export RESEARCH_MEMORY_PROJECTS_DIR="<your-vault>/research-memory-vault/10-projects"
```

## 4. Configure MCP

For opencode, merge `config/opencode.example.json` into your `opencode.json`.

For Pi agent, merge `config/pi-mcp-servers.example.json` into your `~/.pi/mcp-servers.json`.

## 5. Smoke Test

```bash
npm run smoke
npm run smoke:fake
```

Or manually:

```bash
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | node mcp/research-memory-mcp.mjs
```
