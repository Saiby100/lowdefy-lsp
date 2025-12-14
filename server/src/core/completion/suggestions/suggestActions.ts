import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import { formatActions } from '../formatters';

const lowdefyActions = formatActions();

export default function suggestActions({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (!sequenceKey?.startsWith('on') || keys[0] !== 'type') return [];
  return lowdefyActions;
}
