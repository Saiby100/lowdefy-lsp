import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { getCursorContext } from './getCursorContext';
import { Position } from 'vscode-languageserver-textdocument';
import formatTypes from './formatTypes';

const lowdefyTypes = formatTypes();

function suggestActions({
  keys,
  sequenceNode,
}: {
  keys: string[];
  sequenceNode: string | undefined;
}): CompletionItem[] {
  if (!sequenceNode?.startsWith('on.') || keys[0] !== 'type') return [];
  return lowdefyTypes.actions;
}

function suggestConnections({
  keys,
  sequenceNode,
}: {
  keys: string[];
  sequenceNode: string | undefined;
}): CompletionItem[] {
  if (sequenceNode !== 'connections' || keys[0] !== 'type') return [];
  return lowdefyTypes.connections;
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

function getSuggestions(cursorContext: Record<string, any>): CompletionItem[] {
  if (cursorContext.keys.length === 0) return [];
  return [
    ...suggestActions(cursorContext),
    ...suggestConnections(cursorContext),
    ...suggestBlocks(cursorContext),
    ...suggestOperators(cursorContext),
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

  // const keys = getParentKeys(documentText, documentJSON, position) ?? [];
  const cursorContext = getCursorContext(documentText, documentJSON, position);
  const suggestions = getSuggestions(cursorContext);

  if (suggestions.length === 0) return defaultCompletions;
  return suggestions;
}

export default getCompletionSuggestions;
