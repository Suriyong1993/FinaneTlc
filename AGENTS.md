# AGENTS.md — church-finance-app

Guidance for AI coding agents (Codex, Cursor, Claude Code, Trae, Windsurf, Cline, Gemini, Hermes, GitHub Copilot) working in this repo.

## Project

A church finance application (React). Tracks donations/offerings (income), expenses, and produces financial reports.

> Status: scaffolding. Tooling is set up before app code.

## Skills / agents available

All agents share a full suite of skills from [agent-skills](https://github.com/addyosmani/agent-skills), mirrored per-tool:

| Tool               | Location                                   |
| ------------------ | ------------------------------------------ |
| Central / Codex    | `.agents/skills/*/`                        |
| Claude Code        | `.claude/skills/*/` + `.claude/commands/`  |
| Cursor             | `.cursor/rules/` + `.cursor/skills/*/`     |
| Cline              | `.clinerules/` + `.clinerules/skills/*/`   |
| Gemini             | `.gemini/skills/*/`                        |
| Trae               | `.trae/skills/*/`                          |
| Windsurf           | `.windsurf/skills/*/`                      |
| GitHub Actions CI  | `.github/workflows/react-doctor.yml`       |
| Hermes             | `~/.hermes/skills/software-development/*/` (global) |

These copies are kept identical. Edit the source of truth at `.agents/skills/`
then run `./scripts/sync-skills.sh` (or `./scripts/sync-skills.ps1` on Windows)
to redistribute — do NOT hand-edit individual copies.

## Available skills

- `using-agent-skills`: Meta-skill to guide which skill to use when
- `interview-me`: Extract requirements with clarifying questions
- `idea-refine`: Explore and refine vague ideas
- `spec-driven-development`: Write a specification before coding
- `planning-and-task-breakdown`: Break specs into verifiable tasks
- `incremental-implementation`: Build in small, safe slices
- `test-driven-development`: Red-green-refactor testing
- `context-engineering`: Provide the right context to agents
- `source-driven-development`: Base decisions on official docs
- `doubt-driven-development`: Verify decisions with adversarial checks
- `frontend-ui-engineering`: UI component design and implementation
- `api-and-interface-design`: API contract design
- `browser-testing-with-devtools`: Test with browser DevTools
- `debugging-and-error-recovery`: Systematic debugging
- `code-review-and-quality`: Multi-axis code reviews
- `code-simplification`: Simplify while preserving behavior
- `security-and-hardening`: Security best practices
- `performance-optimization`: Measure then optimize
- `git-workflow-and-versioning`: Git best practices
- `ci-cd-and-automation`: CI/CD pipeline design
- `deprecation-and-migration`: Deprecation and migration patterns
- `documentation-and-adrs`: Write docs and ADRs
- `observability-and-instrumentation`: Add logging and metrics
- `shipping-and-launch`: Launch checklist and rollout
- `react-doctor`: Scan React code for issues (original skill)

## React Doctor

Scans React code for security, performance, correctness, accessibility, bundle-size,
and architecture issues, producing a 0–100 health score.

- After code changes: `npx react-doctor@latest --verbose --scope changed` and check the score did not regress.
- Full cleanup: `npx react-doctor@latest --verbose`, fix errors first, then warnings.
- `/doctor`: follow the full triage playbook described in the skill's `SKILL.md`.

## Conventions

- This is a finance app — prefer TypeScript and be strict about number/type correctness.
- Do not commit secrets; leave `.env` files alone.
- Do not pin `react-doctor@latest` in production CI without a security review.
