import { CompletionItemKind } from 'vscode-languageserver';

export interface SchemaProperty {
  type?: string | string[];
  description?: string;
  enum?: string[];
  default?: unknown;
  oneOf?: SchemaProperty[];
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
  docs?: { displayType?: string };
}

export interface Suggestions {
  _type?: string;
  completions?: Array<{
    label: string;
    kind: CompletionItemKind;
    insertText: string;
    documentation: { kind: string; value: string };
  }>;
  [key: string]: unknown;
}
