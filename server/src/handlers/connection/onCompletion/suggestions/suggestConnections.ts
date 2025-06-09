import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import { formatConnections } from '../formatters';
const lowdefyConnections = formatConnections();

export default function suggestConnections({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (sequenceKey !== 'connections' || keys[0] !== 'type') return [];
  return lowdefyConnections;
}
