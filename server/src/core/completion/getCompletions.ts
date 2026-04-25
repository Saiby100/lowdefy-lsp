import { CompletionItem } from 'vscode-languageserver';
import { Position } from 'vscode-languageserver-textdocument';

import getSuggestionContext from './getSuggestionContext';
import { Document } from 'yaml';
import getSuggestions from './suggestions';
import { SuggestionContext } from './types/suggestion-context';

function getCompletions(
  documentText: string,
  documentJSON: Document.Parsed,
  position: Position
): CompletionItem[] {
  const suggestionContext = getSuggestionContext(
    documentText,
    documentJSON,
    position
  ) as SuggestionContext;
  const suggestions = getSuggestions(suggestionContext);

  return suggestions;
}

export default getCompletions;
