import { CompletionItem } from 'vscode-languageserver';
import { Position } from 'vscode-languageserver-textdocument';

import getCursorContext from './getCursorContext';
import { Document } from 'yaml';
import getSuggestions from './suggestions';

function getCompletionSuggestions(
  documentText: string,
  documentJSON: Document.Parsed,
  position: Position
): CompletionItem[] {
  const cursorContext = getCursorContext(documentText, documentJSON, position);
  const suggestions = getSuggestions(cursorContext);

  // console.log('cursorContext', cursorContext);
  return suggestions;
}

export default getCompletionSuggestions;
