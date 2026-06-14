# Global Research Memory Protocol v1.0

## Scope

This protocol applies to all AI agents, including Codex, Pi agent, Claude, Cursor, Gemini, MCP agents, and other automation tools.

For any research, manuscript, data analysis, figure, submission, literature, or project-management task, the agent should follow this protocol regardless of the current working directory.

## Core Principle

The Obsidian vault or Markdown research-memory folder is the formal source of truth.

Agent internal memory, chat history, temporary caches, Supermemory, agentmemory, or other MCP memory systems may help recall context, but they must not replace the Project Hub, registries, or long-term database.

## Minimal Read Rule

After detecting the project, read only:

- `00_Project Hub.md`
- `00_Project Memory.md`, if present
- `00_Existing Project Intake.md`, if present
- Registry files directly relevant to the task

Do not read all old materials, PDFs, scripts, raw data, figures, or historical drafts by default.

## Deep Read Rule

Old materials are cold storage. Deep-read source files only when the task requires evidence verification, source-text confirmation, data tracing, script inspection, figure reproduction, or manuscript editing.

After deep-reading any old material, update the relevant registry or material summary so future sessions can reuse the summary.

## Figure Version Rule

Figure files are not copied into long-term memory by default. Long-term memory stores figure metadata by default.

The agent must not delete figure files unless the user explicitly approves cleanup.

When updating a figure, create a new version instead of overwriting the old one when feasible, then update `Figure Registry.md` and `Version Index.md`.

Use these figure status values:

| Status | Meaning |
|---|---|
| `current` | Current recommended version |
| `candidate` | Candidate version still under comparison |
| `superseded` | Replaced, but still useful for short-term rollback |
| `rejected` | Explicitly not adopted; cleanup still requires user confirmation |
| `archived` | Key historical, submitted, or non-reproducible version kept long term |
| `missing` | Registry record exists, but the local file was not found |
| `deleted` | File was deleted by the user or a prior workflow; registry keeps metadata only |

## End-of-Task Writeback Rule

At the end of each research task, write working memory by default.

Allowed automatic writeback:

- Task Summary
- Materials read
- Files created or modified
- Current recommended version
- Pending verification items
- Evidence gaps
- Blockers
- Next actions
- AI collaboration notes
- Version notes
- Registry updates for file status

Do not automatically write these as verified conclusions without explicit user confirmation:

- Final research conclusions
- Statistical interpretations
- Medical conclusions
- Literature evidence grades
- Manuscript-ready claims
- Official adoption or rejection of a research result

## Long-Context Refresh Rule

If the conversation becomes long, spans multiple tasks, or is about to write to memory files, the agent should re-read:

- Bootstrap
- The target project's `00_Project Hub.md`
- The target project's `00_Project Memory.md`
- Any registry that will be updated

Do not rely only on chat context for final writeback.

## Research Integrity Baseline

- Do not fabricate data, literature, statistical results, medical conclusions, or mechanistic conclusions.
- Do not describe association as causation.
- Do not present hypotheses as facts.
- Do not treat simulated, synthetic, assumed, or AI-generated data as formal research evidence.
- Mark uncertain content as `Unverified`, `Needs evidence`, `Blocked`, or `Do not use`.
