import { Node, Document } from 'yaml';
import { Position } from 'vscode-languageserver-types';

import { CursorContext } from './types/cursor-context';

import {
  getBlockKeys,
  getCurrentObject,
  getLastTyped,
  getNodePath,
  getParentKeys,
  getSequenceKey,
  posToOffset,
} from './cursor';

function getCursorContext(
  documentText: string,
  documentJSON: Document.Parsed,
  position: Position
): CursorContext {
  const offset = posToOffset(position, documentText);
  const rootNode = documentJSON.contents as Node;

  if (!rootNode)
    return {
      blockKeys: [],
      currentObject: {},
      keys: [],
      offset,
      path: [],
      sequenceKey: undefined,
      lastTyped: undefined,
    };

  const path = getNodePath(offset, rootNode, []).reverse();
  const keys = getParentKeys(path);
  const sequenceKey = getSequenceKey(path);
  const lastTyped = getLastTyped(path);
  const currentObject = getCurrentObject(path, documentJSON);
  const blockKeys = getBlockKeys(currentObject, keys, lastTyped, sequenceKey);

  return {
    blockKeys,
    currentObject,
    keys,
    lastTyped,
    offset,
    path,
    sequenceKey,
  };
}

export default getCursorContext;
