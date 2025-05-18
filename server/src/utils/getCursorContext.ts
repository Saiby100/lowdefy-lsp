import { isMap, isSeq, Node, Pair, isPair, isScalar } from 'yaml';
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

/**
 * Recursively finds the path of nodes leading to the current offset (cursor position).
 */
function findNodePath(offset: number, node: Node, currentPath: (Node | Pair)[]): (Node | Pair)[] {
  if (!node || !node.range) return currentPath;
  const [start, , end] = node.range;

  if (offset < start || offset > end) return currentPath;

  let path = [...currentPath, node];

  if (isSeq(node)) {
    node.items.forEach((item) => {
      const seqPath = findNodePath(offset, item as Node, path);
      if (seqPath.length > path.length) path = seqPath;
    });
  }

  if (isMap(node)) {
    node.items.forEach((item) => {
      if (!isPair(item)) return;

      const pair = item as Pair;

      const keyPath = findNodePath(offset, pair.key as Node, [...path, pair]);
      const valuePath = findNodePath(offset, pair.value as Node, [...path, pair]);

      if (keyPath.length - 1 > path.length && keyPath.length > valuePath.length) path = keyPath;
      if (valuePath.length - 1 > path.length && valuePath.length > keyPath.length) path = valuePath;
    });
  }

  return path;
}

function getSequenceNode(path: (Node | Pair)[], sequenceKeys: string[] = []): string | undefined {
  const matches = ['blocks', 'connections', 'requests', 'plugins', 'on.*', ...sequenceKeys];
  const regex = new RegExp(`^(${matches.join('|')})$`);

  for (const node of path) {
    if (isPair(node) && isSeq(node.value) && isScalar(node.key)) {
      const key = node.key.value;
      if (typeof key === 'string' && key.match(regex)) {
        return key;
      }
    }
  }
  return undefined;
}

function getParentKeys(path: (Node | Pair)[]): string[] | undefined {
  const keys: string[] = [];

  path.forEach((node) => {
    if (!isPair(node)) return;
    if (isScalar(node.key) && typeof node.key.value === 'string') {
      keys.push(node.key.value);
    }
  });

  return keys.length > 0 ? keys : undefined;
}

function getCursorContext(
  documentText: string,
  documentJSON: Record<string, any>,
  position: Position
): Record<string, any> {
  const offset = posToOffset(position, documentText);
  const rootNode = documentJSON.contents as Node;

  if (!rootNode) return {};

  const path = findNodePath(offset, rootNode, []).reverse();
  const keys = getParentKeys(path);
  const sequenceNode = getSequenceNode(path);

  return {
    offset,
    path,
    keys,
    sequenceNode,
  };
}

export { getCursorContext };
