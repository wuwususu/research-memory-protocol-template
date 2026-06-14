# Research Memory Protocol Template

中文说明见 [README.zh-CN.md](README.zh-CN.md).

Local-first research memory protocol for AI agents, Obsidian, and MCP.

This template helps researchers manage cross-session project memory without treating AI chat history as the source of truth.

## What This Solves

- Agents forget project context across sessions.
- Old project files are repeatedly reprocessed or converted.
- Multiple versions of figures, manuscripts, and reports become hard to track.
- AI-generated content can be mistaken for verified research evidence.
- Different agents need a shared protocol, not tool-specific memory.

## Core Idea

```text
Obsidian Vault = source of truth
Project Hub / Registry = structured project memory
MCP server = controlled read/write tools
Agent memory = optional recall layer, not evidence
```

## Repository Layout

```text
research-memory-protocol-template/
  mcp/
    research-memory-mcp.mjs
  templates/
    BOOTSTRAP.md
    全域科研记忆协议.md
    外部项目路径映射表.md
    Project Memory 模板.md
    Figure Registry 模板.md
    Task Summary 模板.md
    .research-memory.md.template
  examples/
    fake-obsidian-vault/
    fake-external-project/
  config/
    opencode.example.json
    pi-mcp-servers.example.json
  docs/
    setup.md
    workflow.md
    safety.md
```

## Quick Start

Choose one setup mode:

- **MCP mode**: for agents that support MCP, such as opencode or Pi agent.
- **No-MCP file protocol mode**: for any agent that can read and edit local files.

Both modes use the same Obsidian Markdown files as source of truth.

See:

- [MCP setup](docs/setup.md)
- [No-MCP setup](docs/no-mcp-setup.md)
- [Agent prompts](docs/agent-prompts.md)

## MCP Quick Start

1. Copy `templates/BOOTSTRAP.md` to:

```bash
mkdir -p ~/.research-memory
cp templates/BOOTSTRAP.md ~/.research-memory/BOOTSTRAP.md
```

2. Copy protocol files into your Obsidian research system:

```bash
cp templates/全域科研记忆协议.md "<your-vault>/科研规范_v1.0/00_总控/"
cp templates/外部项目路径映射表.md "<your-vault>/科研规范_v1.0/00_总控/"
```

3. Configure environment variables:

```bash
export RESEARCH_MEMORY_ROOT="<your-vault>/科研规范_v1.0"
export RESEARCH_MEMORY_BOOTSTRAP="$HOME/.research-memory/BOOTSTRAP.md"
```

4. Add the MCP server to your agent:

```bash
node /path/to/research-memory-protocol-template/mcp/research-memory-mcp.mjs
```

## Agent Prompt

Use this short prompt at the start of a session:

```text
Use the research_memory MCP. First call read_bootstrap, then detect_project, then read_project_memory for the current project. Follow the research memory protocol: do not fabricate, do not move old files, do not delete figures automatically, prefer summaries and registries before deep-reading source files, and write back working memory with append_task_summary at the end. Final conclusions require my confirmation.
```

## MCP Tools

- `read_bootstrap`
- `detect_project`
- `read_project_memory`
- `append_task_summary`
- `append_figure_version`
- `list_projects`
- `file_fingerprint`

## Safety Model

The MCP server can write working memory, not verified conclusions.

Allowed automatic writeback:

- Task summaries
- Materials read
- Files created or modified
- Pending verification items
- Evidence gaps
- Figure version rows

Requires user confirmation:

- Final research conclusions
- Statistical interpretations
- Medical conclusions
- Literature evidence grades
- Manuscript-ready claims

## Privacy

Do not publish your real Obsidian Vault, unpublished data, manuscripts, API keys, patient data, or real project paths.

This repository contains only templates and fake examples.
