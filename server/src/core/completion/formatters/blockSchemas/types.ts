import { CompletionItemKind } from 'vscode-languageserver';

export interface SchemaProperty {
  /** JSON schema type: a single type name or a union of type names. */
  type?: string | string[];
  /** Human-readable description for the property. */
  description?: string;
  /** Allowed enum values when the property is a fixed set. */
  enum?: string[];
  /** Default value assigned when the property is omitted. */
  default?: unknown;
  /** Alternative schema variants; the property matches if any variant matches. */
  oneOf?: SchemaProperty[];
  /** Nested properties when the property is an object. */
  properties?: Record<string, SchemaProperty>;
  /** Item schema when the property is an array. */
  items?: SchemaProperty;
  /** Docs metadata, notably a display-type override used by the UI. */
  docs?: { displayType?: string };
}

export interface Suggestions {
  /** Synthetic marker for the property's shape: "object", "array", "oneOf", or a type string. */
  _type?: string;
  /** Completion items rendered for this level of the schema tree. */
  completions?: Array<{
    label: string;
    kind: CompletionItemKind;
    insertText: string;
    documentation: { kind: string; value: string };
  }>;
  /** Child suggestion trees keyed by property name. */
  [key: string]: unknown;
}
