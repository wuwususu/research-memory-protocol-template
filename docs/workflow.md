# Workflow

## Start of Task

Ask the agent:

```text
Use the research_memory MCP. First call read_bootstrap, then detect_project, then read_project_memory for the current project. Follow the research memory protocol.
```

## During the Task

The agent should:

1. Prefer Project Hub, Project Memory, and registries.
2. Avoid deep-reading old materials unless required.
3. Use source files only for evidence verification, figure tracing, code inspection, or manuscript editing.
4. Update registries after deep reading old materials.

## Figure Iteration

When a figure changes:

1. Do not delete old figure files automatically.
2. Create a new version when feasible.
3. Call `append_figure_version`.
4. Mark old versions as `candidate`, `superseded`, `rejected`, `archived`, `missing`, or `deleted`.

## End of Task

The agent should call `append_task_summary`.

Working memory can be written automatically.

Verified conclusions require user confirmation.

## Long Context

If a conversation becomes long, ask:

```text
Re-read research_memory.read_bootstrap and research_memory.read_project_memory before continuing.
```

