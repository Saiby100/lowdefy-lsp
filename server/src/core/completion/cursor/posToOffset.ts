import { Position } from 'vscode-languageserver-types';

/**
 * Calculates the offset of a cursor position in a YAML document.
 * @param pos the position of the cursor in the document
 * @param text the stringified text of the document
 * @returns the offset of the cursor in the document
 */
function posToOffset(pos: Position, text: string): number {
  const lines = text.split('\n');
  let offset = 0;
  for (let i = 0; i < pos.line; i++) {
    offset += lines[i].length + 1;
  }
  return offset + pos.character;
}

export default posToOffset;
