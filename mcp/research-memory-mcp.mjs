#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

const ROOT = process.env.RESEARCH_MEMORY_ROOT || path.join(os.homedir(), "Documents", "Obsidian Vault", "科研规范_v1.0");
const BOOTSTRAP = process.env.RESEARCH_MEMORY_BOOTSTRAP || path.join(os.homedir(), ".research-memory", "BOOTSTRAP.md");
const PROTOCOL = process.env.RESEARCH_MEMORY_PROTOCOL || path.join(ROOT, "00_总控", "全域科研记忆协议.md");
const PATH_MAP = process.env.RESEARCH_MEMORY_PATH_MAP || path.join(ROOT, "00_总控", "外部项目路径映射表.md");
const PROJECTS_DIR = process.env.RESEARCH_MEMORY_PROJECTS_DIR || path.join(ROOT, "10_科研项目");

const serverInfo = { name: "research-memory", version: "1.0.0" };

function nowIso() {
  return new Date().toISOString();
}

function exists(file) {
  try { fs.accessSync(file); return true; } catch { return false; }
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeFile(file) {
  return path.resolve(String(file || "").replace(/^~(?=$|\/)/, os.homedir()));
}

function projectDir(projectName) {
  return path.join(PROJECTS_DIR, projectName);
}

function findProjectDirs() {
  if (!exists(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "00_想法池")
    .map((d) => path.join(PROJECTS_DIR, d.name));
}

function readPointer(cwd) {
  let dir = normalizeFile(cwd || process.cwd());
  while (dir && dir !== path.dirname(dir)) {
    const pointer = path.join(dir, ".research-memory.md");
    if (exists(pointer)) return { pointer, text: readText(pointer) };
    dir = path.dirname(dir);
  }
  return null;
}

function extractPathAfterLabel(text, label) {
  const idx = text.indexOf(label);
  if (idx === -1) return null;
  const match = text.slice(idx + label.length).match(/`([^`]+)`/);
  return match?.[1] ?? null;
}

function parseMapRows() {
  if (!exists(PATH_MAP)) return [];
  const lines = readText(PATH_MAP).split(/\r?\n/);
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith("| `")) continue;
    const cells = line.split("|").map((c) => c.trim()).slice(1, -1);
    if (cells.length < 6 || cells[0] === "External path") continue;
    rows.push({
      externalPath: cells[0].replace(/^`|`$/g, ""),
      projectName: cells[1],
      projectHub: cells[2].replace(/^`|`$/g, ""),
      projectMemory: cells[3].replace(/^`|`$/g, ""),
      status: cells[4],
      notes: cells[5],
    });
  }
  return rows;
}

function detectProject(cwd) {
  const resolvedCwd = normalizeFile(cwd || process.cwd());
  const pointer = readPointer(resolvedCwd);
  if (pointer) {
    const projectHub = extractPathAfterLabel(pointer.text, "Project Hub:") ?? "";
    const projectMemory = extractPathAfterLabel(pointer.text, "Project Memory:") ?? "";
    const nameMatch = pointer.text.match(/Project name:\s*(.+)/);
    return {
      matched: true,
      method: ".research-memory.md",
      cwd: resolvedCwd,
      pointer: pointer.pointer,
      projectName: nameMatch?.[1]?.trim() || path.basename(path.dirname(projectHub)),
      projectHub,
      projectMemory,
      status: projectHub && exists(projectHub) ? "found" : "hub_missing",
      notes: "Matched project pointer file.",
    };
  }

  const rows = parseMapRows()
    .filter((r) => r.externalPath && !r.externalPath.includes("待创建"))
    .sort((a, b) => b.externalPath.length - a.externalPath.length);
  const match = rows.find((r) => resolvedCwd === r.externalPath || resolvedCwd.startsWith(r.externalPath + path.sep));
  if (match) {
    return {
      matched: true,
      method: "external_path_map",
      cwd: resolvedCwd,
      projectName: match.projectName,
      projectHub: match.projectHub === "待创建" ? "" : match.projectHub,
      projectMemory: match.projectMemory === "待创建" ? "" : match.projectMemory,
      status: match.status,
      notes: match.notes,
    };
  }

  return {
    matched: false,
    method: "none",
    cwd: resolvedCwd,
    projectName: "",
    projectHub: "",
    projectMemory: "",
    status: "unmatched",
    notes: "No .research-memory.md or external path map match. Ask user before creating or updating Project Hub.",
  };
}

function contentText(text) {
  return { content: [{ type: "text", text }] };
}

function contentJson(value) {
  return contentText(JSON.stringify(value, null, 2));
}

function safeAppend(file, text) {
  ensureDir(path.dirname(file));
  fs.appendFileSync(file, text, "utf8");
}

function safeWriteIfMissing(file, text) {
  ensureDir(path.dirname(file));
  if (!exists(file)) fs.writeFileSync(file, text, "utf8");
}

function makeProjectMemory(projectName) {
  const file = path.join(projectDir(projectName), "00_Project Memory.md");
  const template = `# ${projectName} Project Memory

## Current Truth

- Current status: 待补充
- Current recommended version: 待补充
- Current main question: 待补充
- Current main output: 待补充
- Last meaningful update: ${nowIso()}

## Stable Decisions

| Date | Decision | Reason | Evidence / source | Reversible? |
|---|---|---|---|---|

## Active Context

- What the next agent should know:
- What should not be repeated:
- Which old files have already been summarized:
- Which files should not be trusted without verification:

## Open Verification Items

| Item | Why it matters | Source to check | Status |
|---|---|---|---|

## Working Memory Log

| Date | Task | Summary | Files touched | Writeback status |
|---|---|---|---|---|

## Long-Term Database Candidates

Only add items here as candidates. Do not mark them verified unless the user confirms.

| Candidate memory | Evidence source | Verification status | User confirmed? |
|---|---|---|---|
`;
  safeWriteIfMissing(file, template);
  return file;
}

function makeFigureRegistry(projectName) {
  const file = path.join(projectDir(projectName), "05_图表", "Figure Registry.md");
  const template = `# ${projectName} Figure Registry

## Rules

- Do not delete figure files unless the user explicitly approves cleanup.
- Create a new version instead of overwriting when feasible.
- Store figure metadata here; do not copy every figure file into Obsidian by default.
- Archive only final, submitted, non-reproducible, or user-selected key figures as files.
- AI-generated or AI-modified figures are \`Unverified until checked\`.

## Figure Versions

| Figure ID | Version | File | Status | Source data | Script / method | Modified reason | Human verification | Used in manuscript |
|---|---|---|---|---|---|---|---|---|
`;
  safeWriteIfMissing(file, template);
  return file;
}

function appendTaskSummary(args) {
  if (!args.project_name) throw new Error("project_name is required");
  const logDir = path.join(projectDir(args.project_name), "08_AI协作记录");
  const date = new Date().toISOString().slice(0, 10);
  const file = path.join(logDir, `Task Summary ${date}.md`);
  const block = `

---

# Task Summary

- Date: ${nowIso()}
- Project: ${args.project_name}
- Agent: ${args.agent ?? "unknown"}
- Task: ${args.task ?? "未说明"}

## Materials Read

${args.materials_read ?? "- 待补充"}

## Actions Completed

${args.actions_completed ?? "- 待补充"}

## Files Created / Modified

${args.files_changed ?? "- 待补充"}

## Current Recommended Version

${args.current_recommended_version ?? "- 待补充"}

## Unverified Items

${args.unverified_items ?? "- 待补充"}

## Evidence Gaps

${args.evidence_gaps ?? "- 待补充"}

## Blockers

${args.blockers ?? "- 无"}

## Next Actions

${args.next_actions ?? "- [ ] 待补充"}

## Long-Term Database Decision

- Candidate for long-term database: ${args.long_term_candidate ?? "needs_user_confirmation"}
- User confirmation needed: yes
`;
  safeAppend(file, block);
  const memory = makeProjectMemory(args.project_name);
  const oneLine = (args.actions_completed ?? args.task ?? "").replace(/\s+/g, " ").slice(0, 180);
  safeAppend(memory, `| ${nowIso()} | ${args.task ?? "未说明"} | ${oneLine || "见 Task Summary"} | ${args.files_changed ?? "未列出"} | working memory written; final conclusions need user confirmation |\n`);
  return { file, projectMemory: memory };
}

function appendFigureVersion(args) {
  if (!args.project_name) throw new Error("project_name is required");
  const registry = makeFigureRegistry(args.project_name);
  const row = `| ${args.figure_id ?? "Fig"} | ${args.version ?? "v?"} | \`${args.file ?? ""}\` | ${args.status ?? "candidate"} | \`${args.source_data ?? ""}\` | \`${args.script_or_method ?? ""}\` | ${args.modified_reason ?? ""} | ${args.human_verification ?? "未核验"} | ${args.used_in_manuscript ?? "否"} |\n`;
  safeAppend(registry, row);
  return { registry };
}

function hashFile(file) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(file));
  return h.digest("hex");
}

const tools = [
  {
    name: "read_bootstrap",
    description: "Read the global research memory bootstrap and protocol entry points.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: () => contentText([
      "# BOOTSTRAP",
      exists(BOOTSTRAP) ? readText(BOOTSTRAP) : `Missing: ${BOOTSTRAP}`,
      "\n# PROTOCOL",
      exists(PROTOCOL) ? readText(PROTOCOL) : `Missing: ${PROTOCOL}`,
    ].join("\n\n")),
  },
  {
    name: "detect_project",
    description: "Detect the research project for a working directory using .research-memory.md or the external path map.",
    inputSchema: {
      type: "object",
      properties: { cwd: { type: "string", description: "Working directory to classify. Defaults to server cwd." } },
      additionalProperties: false,
    },
    handler: (args) => contentJson(detectProject(args.cwd)),
  },
  {
    name: "read_project_memory",
    description: "Read Project Hub, Project Memory, Existing Intake, and optionally registries for a project or cwd.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project folder name under 10_科研项目." },
        cwd: { type: "string", description: "Alternative: detect project from this working directory." },
        include_registries: { type: "boolean", description: "Include common registry files if present." },
      },
      additionalProperties: false,
    },
    handler: (args) => {
      let projectName = args.project_name;
      let detected = null;
      if (!projectName && args.cwd) {
        detected = detectProject(args.cwd);
        projectName = detected.projectName;
      }
      if (!projectName) return contentJson({ error: "project_name or cwd is required", detected });
      const dir = projectDir(projectName);
      const files = [
        path.join(dir, "00_Project Hub.md"),
        path.join(dir, "00_Project Memory.md"),
        path.join(dir, "00_Existing Project Intake.md"),
      ];
      if (args.include_registries) {
        files.push(
          path.join(dir, "03_数据与实验", "Data Registry.md"),
          path.join(dir, "04_分析与结果", "Result Registry.md"),
          path.join(dir, "05_图表", "Figure Registry.md"),
          path.join(dir, "01_文献", "Literature Registry.md"),
          path.join(dir, "99_归档", "Version Index.md"),
          path.join(dir, "08_AI协作记录", "AI Collaboration Log.md"),
        );
      }
      return contentText(files.map((f) => exists(f) ? `\n\n# ${f}\n\n${readText(f)}` : `\n\n# ${f}\n\n[MISSING]`).join(""));
    },
  },
  {
    name: "append_task_summary",
    description: "Append a working-memory Task Summary and Project Memory log. Does not mark final conclusions as verified.",
    inputSchema: {
      type: "object",
      required: ["project_name", "task"],
      properties: {
        project_name: { type: "string" },
        task: { type: "string" },
        agent: { type: "string" },
        materials_read: { type: "string" },
        actions_completed: { type: "string" },
        files_changed: { type: "string" },
        current_recommended_version: { type: "string" },
        unverified_items: { type: "string" },
        evidence_gaps: { type: "string" },
        blockers: { type: "string" },
        next_actions: { type: "string" },
        long_term_candidate: { type: "string", enum: ["yes", "no", "needs_user_confirmation"] },
      },
      additionalProperties: false,
    },
    handler: (args) => contentJson({ ok: true, ...appendTaskSummary(args) }),
  },
  {
    name: "append_figure_version",
    description: "Append a figure version row to Figure Registry. Does not delete or archive figure files.",
    inputSchema: {
      type: "object",
      required: ["project_name", "figure_id", "file"],
      properties: {
        project_name: { type: "string" },
        figure_id: { type: "string" },
        version: { type: "string" },
        file: { type: "string" },
        status: { type: "string", enum: ["current", "candidate", "superseded", "rejected", "archived", "missing", "deleted"] },
        source_data: { type: "string" },
        script_or_method: { type: "string" },
        modified_reason: { type: "string" },
        human_verification: { type: "string" },
        used_in_manuscript: { type: "string" },
      },
      additionalProperties: false,
    },
    handler: (args) => contentJson({ ok: true, ...appendFigureVersion(args) }),
  },
  {
    name: "list_projects",
    description: "List Project Hub folders under the research memory project directory.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: () => contentJson(findProjectDirs().map((dir) => ({
      projectName: path.basename(dir),
      projectHub: path.join(dir, "00_Project Hub.md"),
      projectMemory: path.join(dir, "00_Project Memory.md"),
      hasHub: exists(path.join(dir, "00_Project Hub.md")),
      hasMemory: exists(path.join(dir, "00_Project Memory.md")),
    }))),
  },
  {
    name: "file_fingerprint",
    description: "Return size, mtime, and sha256 for a local file for conversion or evidence registries.",
    inputSchema: {
      type: "object",
      required: ["file"],
      properties: { file: { type: "string" } },
      additionalProperties: false,
    },
    handler: (args) => {
      const file = normalizeFile(args.file);
      if (!exists(file)) return contentJson({ file, exists: false });
      const st = fs.statSync(file);
      return contentJson({ file, exists: true, size: st.size, mtime: st.mtime.toISOString(), sha256: hashFile(file) });
    },
  },
];

const toolMap = new Map(tools.map((t) => [t.name, t]));

function ok(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function err(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

async function handle(msg) {
  if (msg.method === "initialize") {
    return ok(msg.id, {
      protocolVersion: msg.params?.protocolVersion ?? "2024-11-05",
      capabilities: { tools: {} },
      serverInfo,
    });
  }
  if (msg.method === "notifications/initialized") return null;
  if (msg.method === "tools/list") {
    return ok(msg.id, { tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
  }
  if (msg.method === "tools/call") {
    const name = msg.params?.name;
    const args = msg.params?.arguments ?? {};
    const tool = toolMap.get(name);
    if (!tool) return err(msg.id, -32601, `Unknown tool: ${name}`);
    try {
      return ok(msg.id, await tool.handler(args));
    } catch (e) {
      return ok(msg.id, { content: [{ type: "text", text: `Error: ${e.message ?? e}` }], isError: true });
    }
  }
  return err(msg.id, -32601, `Unsupported method: ${msg.method}`);
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  while (buffer.includes("\n")) {
    const idx = buffer.indexOf("\n");
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    const response = await handle(msg);
    if (response) process.stdout.write(JSON.stringify(response) + "\n");
  }
});

