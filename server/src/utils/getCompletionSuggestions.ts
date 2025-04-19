import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

export default function getCompletionSuggestions(text: string): CompletionItem[] {
  // Suggest block types if parent is `type`.
  // Suggest properties/params depending on if type was given.
  const defaultCompletions: CompletionItem[] = [
    {
      label: 'id',
      kind: CompletionItemKind.Field,
      insertText: 'id: ',
      documentation: {
        kind: 'markdown',
        value: '**id**: Sets the id of the block (should be unique).',
      },
    },
    {
      label: 'type',
      kind: CompletionItemKind.Field,
      insertText: 'type: ',
      documentation: {
        kind: 'markdown',
        value: '**type**: Sets the type of the block you would like to use.',
      },
    },
  ];
  return defaultCompletions;
}
