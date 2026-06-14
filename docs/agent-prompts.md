# Agent Prompts

## MCP Mode

Short version:

```text
Use the research_memory MCP. First call read_bootstrap, then detect_project, then read_project_memory. At the end, call append_task_summary.
```

Full version:

```text
Use the research_memory MCP. First call read_bootstrap, then detect_project for the current working directory, then read_project_memory for the matched project. Follow the research memory protocol: do not fabricate, do not move old files, do not delete figures automatically, prefer summaries and registries before deep-reading source files, and write back working memory with append_task_summary at the end. If figures are updated, use append_figure_version. Final conclusions require my confirmation before entering any verified long-term database.
```

Long-context refresh:

```text
Re-read research_memory.read_bootstrap and research_memory.read_project_memory before continuing. Do not rely only on current chat context for project truth.
```

## No-MCP Mode

Short version:

```text
Enter research memory mode without MCP. Read ~/.research-memory/BOOTSTRAP.md and the current folder's .research-memory.md, then follow the Project Hub and Project Memory.
```

Full version:

```text
Enter research memory mode without MCP.

Please directly read:
1. ~/.research-memory/BOOTSTRAP.md
2. The current folder's .research-memory.md, if present
3. If no pointer exists, read the external project path map and identify the project
4. The matched project's 00_Project Hub.md, 00_Project Memory.md, and relevant Registry files

During the task:
- Prefer summaries and registries before reading old materials in full.
- Deep-read source files only when needed for evidence, scripts, figures, or manuscript edits.
- Do not move old files.
- Do not delete figures automatically.
- Do not fabricate data, literature, statistics, or medical conclusions.
- AI output is Unverified until checked.

At the end:
- Write a Task Summary to the project's AI collaboration log.
- Update 00_Project Memory.md.
- If figures changed, update Figure Registry.md.
- If versions changed, update Version Index.md.
- Final conclusions require my confirmation.
```

