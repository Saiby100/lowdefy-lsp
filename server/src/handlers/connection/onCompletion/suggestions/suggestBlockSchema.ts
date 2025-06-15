import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import { formatBlockSchemas } from '../formatters';
import getValue from '../utils/getValue';
const lowdefyBlockSchema = formatBlockSchemas();

export default function suggestBlockProps({ blockKeys }: CursorContext): CompletionItem[] {
  if (!blockKeys || blockKeys.length === 0) return [];
  const completions = getValue(lowdefyBlockSchema, blockKeys)?.completions ?? [];
  return completions;
}
