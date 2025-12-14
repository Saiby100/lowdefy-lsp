import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { CursorContext } from '../types/cursor-context';

function suggestDefaults({ keys, sequenceKey, lastTyped }: CursorContext): CompletionItem[] {
  const firstKey = lastTyped === keys[0] ? keys[1] : keys[0];
  if (!sequenceKey || sequenceKey !== firstKey) return [];
  return [
    {
      label: 'id',
      kind: CompletionItemKind.Field,
      insertText: 'id:',
      documentation: {
        kind: 'markdown',
        value: '**id**: Sets the id of the block (should be unique).',
      },
    },
    {
      label: 'type',
      kind: CompletionItemKind.Field,
      insertText: 'type:',
      documentation: {
        kind: 'markdown',
        value: '**type**: Sets the type of the block you would like to use.',
      },
    },
  ];
}

export default suggestDefaults;
