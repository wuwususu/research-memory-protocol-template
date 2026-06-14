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
cp templates/全域科研记忆协议.md "<your-vault>/科研规范_v1.0/00_总控/"
cp templates/外部项目路径映射表.md "<your-vault>/科研规范_v1.0/00_总控/"
```

Copy project templates as needed:

```bash
cp templates/Project\\ Memory\\ 模板.md "<your-vault>/科研规范_v1.0/05_模板/"
cp templates/Figure\\ Registry\\ 模板.md "<your-vault>/科研规范_v1.0/05_模板/"
cp templates/Task\\ Summary\\ 模板.md "<your-vault>/科研规范_v1.0/05_模板/"
```

## 3. Configure Environment

```bash
export RESEARCH_MEMORY_ROOT="<your-vault>/科研规范_v1.0"
export RESEARCH_MEMORY_BOOTSTRAP="$HOME/.research-memory/BOOTSTRAP.md"
```

Optional:

```bash
export RESEARCH_MEMORY_PATH_MAP="<your-vault>/科研规范_v1.0/00_总控/外部项目路径映射表.md"
export RESEARCH_MEMORY_PROJECTS_DIR="<your-vault>/科研规范_v1.0/10_科研项目"
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
