import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { getCursorContext } from './getCursorContext';
import { Position } from 'vscode-languageserver-textdocument';
import formatTypes from './formatTypes';
import { CursorContext } from '../types/cursor-context';
import { isScalar, Node, Scalar } from 'yaml';

const lowdefyTypes = formatTypes();

function suggestActions({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (!sequenceKey?.startsWith('on.') || keys[0] !== 'type') return [];
  return lowdefyTypes.actions;
}

function suggestConnections({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (sequenceKey !== 'connections' || keys[0] !== 'type') return [];
  return lowdefyTypes.connections;
}

function suggestBlocks({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (sequenceKey !== 'blocks' || keys[0] !== 'type') return [];
  return [
    ...lowdefyTypes.containers,
    ...lowdefyTypes.displays,
    ...lowdefyTypes.inputs,
    ...lowdefyTypes.lists,
  ];
}

function suggestOperators({ lastTyped }: CursorContext): CompletionItem[] {
  if (!lastTyped || !lastTyped.startsWith('_')) return [];
  return lowdefyTypes.operators;
}

function suggestDefaults({ keys, sequenceKey, lastTyped }: CursorContext): CompletionItem[] {
  const firstKey = lastTyped === keys[0] ? keys[1] : keys[0]; // TODO: Related to todo in getCursorContext
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

function getSuggestions(cursorContext: CursorContext): CompletionItem[] {
  if (cursorContext.keys.length === 0) return [];
  return [
    ...suggestActions(cursorContext),
    ...suggestConnections(cursorContext),
    ...suggestBlocks(cursorContext),
    ...suggestOperators(cursorContext),
    ...suggestDefaults(cursorContext),
  ];
}

function getCompletionSuggestions(
  documentText: string,
  documentJSON: Record<string, any>,
  position: Position
): CompletionItem[] {
  const cursorContext = getCursorContext(documentText, documentJSON, position);
  const suggestions = getSuggestions(cursorContext);

  console.log('cursorContext', cursorContext);
  // if (suggestions.length === 0) return defaultCompletions;
  return suggestions;
}

export default getCompletionSuggestions;
