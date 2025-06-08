import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { getCursorContext } from './getCursorContext';
import { Position } from 'vscode-languageserver-textdocument';
import { formatBlocks, formatOperators, formatMethods } from './formatTypes';
import { CursorContext } from '../types/cursor-context';
import { Document } from 'yaml';
import formatBlockSchemas from './formatBlockSchemas';
import getValue from './getValue';

const lowdefyBlocks = formatBlocks();
const lowdefyOperators = formatOperators();
const lowdefyMethods = formatMethods();
const lowdefyBlockSchema = formatBlockSchemas();

function suggestActions({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (!sequenceKey?.startsWith('on') || keys[0] !== 'type') return [];
  return lowdefyBlocks.actions;
}

function suggestConnections({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (sequenceKey !== 'connections' || keys[0] !== 'type') return [];
  return lowdefyBlocks.connections;
}

function suggestBlocks({ keys, sequenceKey }: CursorContext): CompletionItem[] {
  if (sequenceKey !== 'blocks' || keys[0] !== 'type') return [];
  return [
    ...lowdefyBlocks.containers,
    ...lowdefyBlocks.displays,
    ...lowdefyBlocks.inputs,
    ...lowdefyBlocks.lists,
  ];
}

function suggestOperators({ lastTyped }: CursorContext): CompletionItem[] {
  if (!lastTyped?.startsWith('_') || lastTyped?.endsWith('.')) return [];
  return lowdefyOperators;
}

function suggestMethods({ lastTyped }: CursorContext): CompletionItem[] {
  if (!lastTyped?.startsWith('_') || !lastTyped?.endsWith('.')) return [];

  const operator = lastTyped.slice(0, -1);
  return lowdefyMethods[operator] || [];
}

function suggestBlockProps({ keys, currentObject }: CursorContext): CompletionItem[] {
  if (typeof currentObject?.type !== 'string') return [];
  console.log('keys', [currentObject.type, ...keys]);
  return [];
  // return getValue(lowdefyBlockSchema, [currentObject.type, ...keys]);
}

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

function getSuggestions(cursorContext: CursorContext): CompletionItem[] {
  if (cursorContext.keys.length === 0) return [];
  const actions = suggestActions(cursorContext);
  const connections = suggestConnections(cursorContext);
  const blocks = suggestBlocks(cursorContext);
  const operators = suggestOperators(cursorContext);
  const methods = suggestMethods(cursorContext);
  const defaults = suggestDefaults(cursorContext);

  if (defaults.length > 0) return defaults;
  if (operators.length > 0) return operators;
  if (methods.length > 0) return methods;

  return [...actions, ...connections, ...blocks];
}

function getCompletionSuggestions(
  documentText: string,
  documentJSON: Document.Parsed,
  position: Position
): CompletionItem[] {
  const cursorContext = getCursorContext(documentText, documentJSON, position);
  const suggestions = getSuggestions(cursorContext);

  console.log('cursorContext', cursorContext);
  return suggestions;
}

export default getCompletionSuggestions;
