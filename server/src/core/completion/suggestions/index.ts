import { CompletionItem } from 'vscode-languageserver';
import { CursorContext } from '../types/cursor-context';

import suggestActions from './suggestActions';
import suggestConnections from './suggestConnections';
import suggestMethods from './suggestMethods';
import suggestOperators from './suggestOperators';
import suggestBlocks from './suggestBlocks';
import suggestBlockSchema from './suggestBlockSchema';
import suggestDefaults from './suggestDefaults';

export default function getSuggestions(cursorContext: CursorContext): CompletionItem[] {
  const actions = suggestActions(cursorContext);
  const connections = suggestConnections(cursorContext);
  const methods = suggestMethods(cursorContext);
  const operators = suggestOperators(cursorContext);
  const blocks = suggestBlocks(cursorContext);
  const blockSchema = suggestBlockSchema(cursorContext);
  const defaults = suggestDefaults(cursorContext);

  if (blockSchema.length > 0) return blockSchema;
  if (defaults.length > 0) return defaults;
  if (operators.length > 0) return operators;
  if (methods.length > 0) return methods;

  return [...actions, ...connections, ...blocks];
}
