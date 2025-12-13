# Lowdefy LSP Extension - Architecture Overview

This document provides an overview of how the VS Code LSP extension for Lowdefy works.

## Architecture Overview

This is a standard **VS Code Language Server Protocol (LSP)** extension with two main parts:

### 1. Client (`client/src/extension.ts`)

The client is a VS Code extension that:

- Launches the language server as a child process
- Communicates via **IPC** (Inter-Process Communication)
- Watches YAML files (`.yaml`, `.yml`)

```
activate() → Create LanguageClient → Start server
deactivate() → Stop client gracefully
```

### 2. Server (`server/src/server.ts`)

The server handles all the "smart" features. It initializes a **ServerContext** that gets passed to all handlers:

```typescript
interface ServerContext {
  connection: Connection; // LSP connection
  documents: TextDocuments; // Managed text documents
  parsedDocuments: Map<uri, Document>; // Cached YAML ASTs
  validate: (type, value) => any; // AJV schema validator
}
```

## Handler Architecture

All handlers are **curried functions**:

```typescript
function handler(context: ServerContext) {
  return (params: Params): Result => {
    /* use context */
  };
}
```

### Connection Handlers (`server/src/handlers/connection/`)

- **onInitialize** - Negotiates capabilities (completion, sync mode)
- **onCompletion** - Main feature: generates context-aware completions
- **onCompletionResolve** - Resolves additional completion details

### Document Handlers (`server/src/handlers/document/`)

- **onDidChangeContent** - Parses YAML, caches AST, runs validation
- **onDidClose** - Cleans up cached data

## Completion System Flow

The completion system (`server/src/handlers/connection/onCompletion/`) works like this:

```
User types → getCursorContext() → getSuggestions() → CompletionItems
```

### 1. getCursorContext (`cursor/` utilities)

Analyzes YAML AST to find:

- `keys` - Ancestor keys like `['blocks', '0', 'properties']`
- `blockKeys` - Block path like `['Button', 'properties']`
- `sequenceKey` - Array context (e.g., `'blocks'`)
- `currentObject` - The current block being edited

### 2. getSuggestions (`suggestions/`)

Priority-based completion:

1. Block schema properties (from JSON schemas)
2. Default fields (`id`, `type`)
3. Operators (`_get`, `_switch`, etc.)
4. Actions, Connections, Blocks

### 3. Formatters (`formatters/`)

Convert data to `CompletionItem[]`

## Validation System

Located in `server/src/handlers/shared/validate/`:

1. **getBlocks** - Extracts all `{id, type}` objects from YAML
2. **getSchema** - Loads JSON schema from `resources/schemas/blocks/`
3. **AJV validation** - Validates blocks against schemas (cached)
4. Sends diagnostics back to the client

## Resources (`server/src/resources/`)

- **docs/** - JSON files with documentation (actions, blocks, connections, operators)
- **schemas/blocks/** - JSON schemas for each block type (Button.json, Input.json, etc.)

## Data Flow Summary

```
Editor → Client → IPC → Server
                         ├── onDidChangeContent → Parse YAML → Validate → Diagnostics
                         └── onCompletion → getCursorContext → getSuggestions → CompletionItems
```

## Key Files Reference

| File                                                              | Purpose                         |
| ----------------------------------------------------------------- | ------------------------------- |
| `client/src/extension.ts`                                         | VS Code extension entry point   |
| `server/src/server.ts`                                            | Language server entry point     |
| `server/src/types/server-context.ts`                              | ServerContext type definition   |
| `server/src/handlers/connection/onCompletion/`                    | Completion logic                |
| `server/src/handlers/connection/onCompletion/getCursorContext.ts` | YAML cursor analysis            |
| `server/src/handlers/connection/onCompletion/suggestions/`        | Completion suggestions          |
| `server/src/handlers/connection/onCompletion/formatters/`         | CompletionItem formatting       |
| `server/src/handlers/shared/validate/`                            | Document validation             |
| `server/src/resources/docs/`                                      | Lowdefy component documentation |
| `server/src/resources/schemas/blocks/`                            | JSON schemas for blocks         |

## Development Workflow

1. Run `npm run watch` or press `Cmd+Shift+B` to start TypeScript compiler in watch mode
2. Press F5 to launch Extension Development Host
3. Edit YAML files in the host to test
4. After server changes, restart with `Cmd+Shift+F5`
