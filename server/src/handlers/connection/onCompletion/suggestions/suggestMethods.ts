import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import { formatMethods } from '../formatters';
const lowdefyMethods = formatMethods();

export default function suggestMethods({ lastTyped }: CursorContext): CompletionItem[] {
  if (!lastTyped?.startsWith('_') || !lastTyped?.endsWith('.')) return [];

  const operator = lastTyped.slice(0, -1);
  return lowdefyMethods[operator] || [];
}
