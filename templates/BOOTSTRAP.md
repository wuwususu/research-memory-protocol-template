# Global Research Memory Bootstrap v1.0

## Purpose

This file is the universal entry point for all AI agents working on research tasks.

It applies to Codex, Pi agent, Claude, Cursor, Gemini, MCP agents, and any other agent that can read local files.

## Source of Truth

The formal research memory lives in:

`<YOUR_OBSIDIAN_VAULT>/research-memory-vault/`

Agent memory, chat history, MCP memory, Supermemory, agentmemory, or temporary cache may help recall context, but they are not the source of truth.

## Always Read First

For every research-related task, read:

1. `<YOUR_OBSIDIAN_VAULT>/research-memory-vault/99-ai-entry/ai-readme-entry.md`
2. `<YOUR_OBSIDIAN_VAULT>/research-memory-vault/00-control/global-research-memory-protocol.md`
3. `<YOUR_OBSIDIAN_VAULT>/research-memory-vault/00-control/external-project-path-map.md`

## Project Detection

Before working, determine the target project by this order:

1. Check whether the current working directory contains `.research-memory.md`.
2. If yes, follow the Project Hub path in that file.
3. If no, match the current path against `external-project-path-map.md`.
4. If no match is found, ask the user before creating or updating any Project Hub.

## Minimal Project Read

After detecting the project, read only the necessary memory files:

- `00_Project Hub.md`
- `00_Project Memory.md`, if present
- `00_Existing Project Intake.md`, if present
- Relevant Registry files only when needed:
  - Data Registry
  - Result Registry
  - Figure Registry
  - Literature Registry
  - Version Index
  - AI Collaboration Log

Do not read all old materials by default.

## Deep Read Rule

Old files, PDFs, scripts, raw data, manuscripts, figures, or converted Markdown are cold storage.

Read them only when the current task requires direct evidence, source verification, code inspection, figure tracing, or manuscript editing.

After deep reading any old material, update the corresponding Registry or material summary so future sessions can reuse the summary.

## Figure Versioning Rule

- Do not delete figure files unless the user explicitly approves cleanup.
- When updating a figure, create a new version instead of overwriting the old one when feasible.
- Record figure versions in `Figure Registry.md`.
- Long-term memory stores figure metadata, source data, script path, version status, and decision notes, not every figure file.
- Only final, submitted, non-reproducible, or user-selected key figures should be archived as files.

Recommended figure status values:

- `current`: current recommended version
- `candidate`: comparison version under consideration
- `superseded`: replaced but still useful for rollback
- `rejected`: explicitly not adopted; cleanup requires approval
- `archived`: key historical or submission version kept long term
- `missing`: expected file not found during sync
- `deleted`: user or prior process deleted the file; registry keeps metadata only

## End-of-Task Writeback Rule

At the end of every research task, write back working memory by default.

Allowed automatic writeback:

- Task Summary
- Materials read
- Files created or modified
- Current recommended version
- Pending verification items
- Evidence gaps
- Blockers
- Next actions
- AI collaboration log
- Version notes
- Registry updates for file status, not final conclusions

Do not automatically write as verified:

- Final research conclusions
- Statistical interpretations
- Medical conclusions
- Literature evidence grades
- Manuscript-ready claims
- Official project recommendations

These require explicit user confirmation before entering the long-term database or verified conclusion fields.

## Context Discipline

If the conversation becomes long, re-read this bootstrap and the project memory files before making file changes or writing final conclusions.

Do not rely on long chat context for project truth.
