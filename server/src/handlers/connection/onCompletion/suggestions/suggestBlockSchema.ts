import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import { formatBlockSchemas } from '../formatters';
const lowdefyBlockSchema = formatBlockSchemas();

// TODO: Fix
export default function suggestBlockProps({
  keys,
  currentObject,
}: CursorContext): CompletionItem[] {
  if (typeof currentObject?.type !== 'string') return [];
  console.log('keys', [currentObject.type, ...keys]);
  return [];
  // return getValue(lowdefyBlockSchema, [currentObject.type, ...keys]);
}
