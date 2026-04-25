# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `README.md` for the architecture overview (client/server split, handler currying, completion and validation flow).

## IMPORTANT: Always Clarify Before Acting

**Do NOT assume requirements. Always ask questions first.**

Before starting any task — especially feature work, refactors, or anything with ambiguity — ask clarifying questions to fully understand what is expected. Do not guess at intent, scope, or implementation details. It is always better to ask one too many questions than to build the wrong thing.

## Code Style

- Prefer small, focused files with utility functions over large files with many functions. Group closely related functions together in the same file.
- TypeScript throughout (both `client/` and `server/` are TypeScript projects built via `tsc -b`).

## Type Definition Guidelines

- **Use `type` over `interface`**: Prefer `type` for consistency. Use `interface` only when declaration merging is needed.
- **No `any`**: Use `unknown` for truly unknown data, or type it properly. `Record<string, unknown>` over `Record<string, any>`.
- **Prefer narrow types**: Use string literal unions over plain `string` for fields with known values.
- **Document type fields**: Every field in a `type` definition must have a brief JSDoc comment (`/** ... */`) describing its purpose.

## Commit Guidelines

- **One commit per task**: Separate tasks must be committed separately — never bundle unrelated changes into a single commit. If you completed multiple tasks before committing, create one commit per task.
- **Ask when unsure**: If it's unclear whether changes belong in one commit or multiple, ask before committing.

## Maintaining this file

When making changes that affect architecture, commands, or key patterns, update the relevant sections of this CLAUDE.md (and `README.md` where appropriate) to keep them accurate.
