import { Node, Document } from 'yaml';
import { Position } from 'vscode-languageserver-types';

import { getNodePath, posToOffset, determineSuggestionContext } from './cursor';

function getCursorContext(
  documentText: string,
  documentJSON: Document.Parsed,
  position: Position
): Record<string, any> {
  const offset = posToOffset(position, documentText);
  const rootNode = documentJSON.contents as Node;

  if (!rootNode)
    return {
      suggestionType: 'unknown',
      meta: {
        keyPath: [],
        operator: '',
      },
    };

  const cursorPath = getNodePath(offset, rootNode, []).reverse();
  return determineSuggestionContext(cursorPath, documentJSON);
}

export default getCursorContext;
