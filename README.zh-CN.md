# 科研记忆协议模板

一个面向 AI agent、Obsidian 和 MCP 的本地优先科研项目记忆系统。

它的目标不是让某个 agent “凭记忆工作”，而是把项目状态、证据链、版本记录、图表迭代和任务总结写入一个所有 agent 都能读取的 Markdown 记忆库。

## 解决的问题

- 不同会话之间 agent 忘记项目背景。
- 旧材料被重复读取、重复转换、重复整理。
- 图表、稿件、结果有多个版本，回来以后分不清哪个是当前推荐版本。
- AI 生成内容和已核验科研证据混在一起。
- Codex、Pi agent、opencode、Claude、Cursor 等不同 agent 没有统一记忆入口。

## 核心思路

```text
Obsidian Vault = 正式科研记忆库 / source of truth
Project Hub / Registry = 项目当前真相和证据索引
MCP server = 受控读取与写回工具
Agent 内部 memory = 可选辅助召回，不是证据来源
```

## 两种使用方式

### 方式 A：MCP 模式

适合支持 MCP 的 agent，例如 opencode、Pi agent、Claude Desktop、Cursor 等。

MCP 提供这些工具：

- `read_bootstrap`：读取全域启动协议
- `detect_project`：按当前目录识别项目
- `read_project_memory`：读取 Project Hub / Project Memory / Intake / Registry
- `append_task_summary`：任务结束写回工作记忆
- `append_figure_version`：同步图表版本状态，不删除图
- `list_projects`：列出项目
- `file_fingerprint`：计算文件 sha256，用于防重复转换

### 方式 B：无 MCP 文件协议模式

适合任何能读写本地文件的 agent。

让 agent 直接读取：

- `~/.research-memory/BOOTSTRAP.md`
- 当前目录 `.research-memory.md`
- `00_Project Hub.md`
- `00_Project Memory.md`
- 相关 Registry

任务结束后，agent 直接编辑 Markdown 写回 Task Summary 和 Project Memory。

## 快速开始

### 1. 复制启动协议

```bash
mkdir -p ~/.research-memory
cp templates/BOOTSTRAP.md ~/.research-memory/BOOTSTRAP.md
```

编辑 `~/.research-memory/BOOTSTRAP.md`，把：

```text
<YOUR_OBSIDIAN_VAULT>
```

替换为你的 Obsidian Vault 路径。

### 2. 复制协议文件到 Obsidian

```bash
cp templates/全域科研记忆协议.md "<your-vault>/科研规范_v1.0/00_总控/"
cp templates/外部项目路径映射表.md "<your-vault>/科研规范_v1.0/00_总控/"
```

### 3. 配置 MCP 环境变量

```bash
export RESEARCH_MEMORY_ROOT="<your-vault>/科研规范_v1.0"
export RESEARCH_MEMORY_BOOTSTRAP="$HOME/.research-memory/BOOTSTRAP.md"
```

### 4. 启动 MCP server

```bash
node mcp/research-memory-mcp.mjs
```

## 给 agent 的提示词

MCP 模式：

```text
使用 research_memory MCP。先调用 read_bootstrap，再 detect_project，再 read_project_memory。执行任务时遵守科研记忆协议：不编造、不自动移动旧文件、不自动删除图表，优先读概要和 Registry，必要时再深读源文件。任务结束用 append_task_summary 写回工作记忆；图表更新用 append_figure_version。最终结论必须等我确认后才能写入长期数据库。
```

无 MCP 模式：

```text
进入科研记忆系统工作模式，但不要使用 MCP。请直接读取 ~/.research-memory/BOOTSTRAP.md 和当前目录的 .research-memory.md，然后读取对应 Project Hub / Project Memory / 相关 Registry。任务结束时直接写回 Task Summary、Project Memory 和相关 Registry。最终结论必须等我确认。
```

## 图表版本规则

图表文件不默认进入长期记忆库，长期记忆库只记录图表元数据：

- Figure ID
- 版本
- 文件路径
- 状态
- 来源数据
- 生成脚本
- 修改原因
- 是否人工核验
- 是否用于正式稿件

Agent 不得自动删除旧图，除非用户明确批准。

推荐状态：

| Status | 含义 |
|---|---|
| `current` | 当前推荐版本 |
| `candidate` | 候选版本，仍在比较 |
| `superseded` | 已被替代，但短期可回滚 |
| `rejected` | 明确不采用，清理仍需用户确认 |
| `archived` | 关键历史版、投稿版或不可复现版本 |
| `missing` | Registry 记录存在，但本地未找到 |
| `deleted` | 文件已删除，仅保留记录 |

## 安全边界

MCP 可以自动写回：

- Task Summary
- 读取材料
- 文件变更
- 待核验项
- 证据缺口
- 图表版本状态

但不能自动写成“已验证结论”：

- 研究主结论
- 统计解释
- 医学结论
- 文献证据等级
- 可投稿判断
- 正式采用或废弃某个结果

这些必须由用户确认。

## 隐私提醒

不要开源你的真实 Obsidian Vault、未发表论文、真实数据、患者信息、真实项目路径或 API key。

本仓库只包含模板和 fake 示例。

