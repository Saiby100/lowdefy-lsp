import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { getParentKeys } from './parseYaml';
import { Position } from 'vscode-languageserver-textdocument';
import formatTypes from './formatTypes';

const lowdefyTypes = formatTypes();

function suggestActions(parentKeys: string[]): CompletionItem[] {
  if (parentKeys.length < 3) return [];
  if (parentKeys[0] === 'type' && parentKeys[2] === 'events') return lowdefyTypes.actions;
  return [];
}

function suggestConnections(parentKeys: string[]): CompletionItem[] {
  if (parentKeys.length < 2) return [];
  if (parentKeys[0] === 'type' && parentKeys[1] === 'connections') return lowdefyTypes.connections;
  return [];
}

function suggestBlocks(parentKeys: string[]): CompletionItem[] {
  const blocks = [
    ...lowdefyTypes.containers,
    ...lowdefyTypes.displays,
    ...lowdefyTypes.inputs,
    ...lowdefyTypes.lists,
  ];
  if (parentKeys.length < 2) return [];
  if (parentKeys[0] === 'type' && parentKeys[1] === 'blocks') return blocks;
  return [];
}

function suggestOperators(parentKeys: string[]): CompletionItem[] {
  const { operators } = lowdefyTypes;
  if (parentKeys?.[0] !== 'type') return operators;
  return operators.filter((operator) => operator.label === '_build');
}

function getSuggestions(parentKeys: string[]): CompletionItem[] {
  if (parentKeys.length === 0) return [];
  return [
    ...suggestActions(parentKeys),
    ...suggestConnections(parentKeys),
    ...suggestBlocks(parentKeys),
    ...suggestOperators(parentKeys),
  ];
}

function getCompletionSuggestions(
  documentText: string,
  documentJSON: Record<string, any>,
  position: Position
): CompletionItem[] {
  const defaultCompletions: CompletionItem[] = [
    //TODO: Suggest if parent node is sequence
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

  const keys = getParentKeys(documentText, documentJSON, position) ?? [];
  const suggestions = getSuggestions(keys);

  if (suggestions.length === 0) return defaultCompletions;
  return suggestions;
}

export default getCompletionSuggestions;
