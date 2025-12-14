import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import { formatBlocks } from '../formatters';
const lowdefyBlocks = formatBlocks();

export default function suggestBlocks({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (sequenceKey !== 'blocks' || keys[0] !== 'type') return [];
  return lowdefyBlocks;
}
