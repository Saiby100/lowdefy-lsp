import { CompletionItem } from 'vscode-languageserver';

import { SuggestionContext } from '../types/suggestion-context';
import {
  formatActions,
  formatBlocks,
  formatConnections,
  formatDefaults,
  formatMethods,
  formatOperators,
} from '../formatters';

const lowdefyActions = formatActions();
const lowdefyBlocks = formatBlocks();
const lowdefyConnections = formatConnections();
const lowdefyDefaults = formatDefaults();
const lowdefyMethods = formatMethods();
const lowdefyOperators = formatOperators();

export default function getSuggestions(cursorContext: SuggestionContext): CompletionItem[] {
  switch (cursorContext.suggestionType) {
    case 'action':
      return lowdefyActions;
    case 'connection':
      return lowdefyConnections;
    case 'method':
      return lowdefyMethods[cursorContext.meta.operator] || [];
    case 'operator':
      return lowdefyOperators;
    case 'block':
      return lowdefyBlocks;
    case 'block_default':
      return lowdefyDefaults['block_default'];
    case 'plugin_default':
      return lowdefyDefaults['plugin_default'];
    default:
      return [];
  }
}
