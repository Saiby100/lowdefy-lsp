import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import { formatOperators } from '../formatters';
const lowdefyOperators = formatOperators();

export default function suggestOperators({ lastTyped }: CursorContext): CompletionItem[] {
  if (!lastTyped?.startsWith('_') || lastTyped?.endsWith('.')) return [];
  return lowdefyOperators;
}
